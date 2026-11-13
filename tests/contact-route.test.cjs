const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

// Exercise the real route in isolation without sending inquiries to the live backend.
function loadRoute(fetch) {
  const filename = path.join(__dirname, "../src/app/api/contact/route.ts");
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(source, {
    exports, fetch, AbortSignal,
    process: { env: { BACKEND_API_URL: "https://backend.example" } },
    require(name) {
      assert.equal(name, "next/server");
      return { NextResponse: { json: (body, init) => Response.json(body, init) } };
    },
  }, { filename });
  return exports.POST;
}

const valid = { name: "Farmer", phone: "010-1234-5678", interestProduct: "smart-hive", message: "Please contact me." };
const request = body => new Request("https://ourbee.example/api/contact", {
  method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" },
});

test("rejects malformed JSON before contacting the backend", async () => {
  const post = loadRoute(() => assert.fail("must not contact backend"));
  const response = await post(new Request("https://ourbee.example/api/contact", { method: "POST", body: "{" }));
  assert.equal(response.status, 400);
});

test("rejects invalid fields and inherited product names", async t => {
  const invalid = [null, [], {}, { ...valid, name: " " }, { ...valid, message: " " },
    { ...valid, name: "x".repeat(81) }, { ...valid, message: "x".repeat(5001) },
    { ...valid, interestProduct: "toString" }, { ...valid, interestProduct: "__proto__" },
    { ...valid, interestProduct: "constructor" }, { ...valid, interestProduct: "unknown" },
    { ...valid, phone: null }, { ...valid, phone: "abc" },
    { ...valid, phone: "1".repeat(41) }, { ...valid, email: "invalid" },
    { ...valid, organization: "x".repeat(121) }];
  for (const [index, body] of invalid.entries()) await t.test(`case ${index + 1}`, async () => {
    const post = loadRoute(() => assert.fail("must not contact backend"));
    assert.equal((await post(request(body))).status, 400);
  });
});

test("maps every product enum and trims fields", async t => {
  for (const [slug, enumName] of Object.entries({ "smart-hive": "SMART_HIVE", gate: "GATE", app: "APP", all: "ALL", other: "OTHER" })) {
    await t.test(slug, async () => {
      let calls = 0;
      const post = loadRoute(async (url, init) => {
        calls++;
        assert.equal(url, "https://backend.example/api/v1/inquiries");
        assert.equal(init.method, "POST");
        assert.ok(init.signal instanceof AbortSignal);
        assert.deepEqual(JSON.parse(init.body), {
          name: "Farmer", phone: null, email: "farm@example.com", organization: null,
          interestProduct: enumName, message: valid.message,
        });
        return new Response(null, { status: 201 });
      });
      const response = await post(request({ ...valid, name: " Farmer ", phone: null, email: " farm@example.com ", interestProduct: slug }));
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { ok: true });
      assert.equal(calls, 1);
    });
  }
});

test("returns safe errors for backend validation, failures and timeouts", async t => {
  for (const status of [400, 401, 429, 500]) await t.test(`HTTP ${status}`, async () => {
    const post = loadRoute(async () => new Response("private backend detail", { status }));
    const response = await post(request(valid));
    assert.equal(response.status, status === 400 ? 400 : 502);
    assert.ok((await response.json()).error);
  });
  for (const error of [new Error("private network detail"), new DOMException("timeout", "TimeoutError")]) {
    const post = loadRoute(async () => { throw error; });
    const response = await post(request(valid));
    assert.equal(response.status, 502);
    assert.doesNotMatch(JSON.stringify(await response.json()), /private|timeout/);
  }
});
