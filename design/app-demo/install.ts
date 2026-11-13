/**
 * 웹 데모 전용: 서버 없이 앱 화면을 그리기 위한 가짜 로그인과 가짜 API.
 * 홈페이지 소개용 빌드에서만 쓰이며 실제 앱에는 들어가지 않습니다.
 */
import { StyleSheet as CssInteropSheet, cssInterop } from "react-native-css-interop";
import Animated from "react-native-reanimated";
import axios from "axios";
import { Dimensions } from "react-native";
import { api } from "@/lib/api";
import { DEFAULT_NFC_DOOR_CARDS, createCustomDoorCard } from "@/features/door-opener/components/nfcDoorCards";
import { PUBLIC_CONFIG } from "@/lib/publicConfig";

try { (CssInteropSheet as any).setFlag?.("darkMode", "class"); } catch {}

Object.assign(PUBLIC_CONFIG as any, { fruitPriceBaseUrl: "https://demo.invalid/price", fruitPriceServiceKey: "demo", nongsaroBaseUrl: "https://demo.invalid/nongsaro", nongsaroApiKey: "demo" });


// 개폐기 카드: 기본 카드 뒤에 시간별 여닫기·벌 마릿수별 샘플 카드를 미리 넣습니다.
try {
  const days = (on: boolean) => ({ sun: on, mon: on, tue: on, wed: on, thu: on, fri: on, sat: on });
  const only = (...on: Array<"sun"|"mon"|"tue"|"wed"|"thu"|"fri"|"sat">) => ({ sun: on.includes("sun"), mon: on.includes("mon"), tue: on.includes("tue"), wed: on.includes("wed"), thu: on.includes("thu"), fri: on.includes("fri"), sat: on.includes("sat") });
  const both = { entranceOpen: true, exitOpen: true };
  const exitOnly = { entranceOpen: false, exitOpen: true };
  const closed = { entranceOpen: false, exitOpen: false };
  const custom = [
    createCustomDoorCard({ title: "06:30 열기", functionType: "open_at", detail: "06:30", repeat: true, memo: "매일 반복", start: "06:30", end: "" }),
    createCustomDoorCard({ title: "18:30 닫기", functionType: "close_at", detail: "18:30", repeat: true, memo: "매일 반복", start: "", end: "18:30" }),
    createCustomDoorCard({ title: "0~3마리 구간 제어", functionType: "count_control", detail: "", repeat: true, start: "", end: "", memo: "매일 · 06:00~18:00", countControl: { low: 0, high: 3, within: both, above: exitOnly, repeatDays: days(true), timeWindowStart: "06:00", timeWindowEnd: "18:00" } }),
    createCustomDoorCard({ title: "5~12마리 구간 제어", functionType: "count_control", detail: "", repeat: true, start: "", end: "", memo: "월~금 · 09:00~16:00", countControl: { low: 5, high: 12, within: both, above: both, repeatDays: only("mon", "tue", "wed", "thu", "fri"), timeWindowStart: "09:00", timeWindowEnd: "16:00" } }),
    createCustomDoorCard({ title: "13~20마리 구간 제어", functionType: "count_control", detail: "", repeat: true, start: "", end: "", memo: "토·일 · 종일", countControl: { low: 13, high: 20, within: exitOnly, above: closed, repeatDays: only("sat", "sun"), timeWindowStart: "00:00", timeWindowEnd: "24:00" } }),
  ].map((card, i) => ({ ...card, id: `demo-card-${i + 1}` }));
  globalThis.localStorage?.setItem("ourbee:nfc-door-cards:v1", JSON.stringify({ version: 1, cards: [...DEFAULT_NFC_DOOR_CARDS, ...custom] }));
} catch {}

// 같은 화면에서 가로로 밀려 보이지 않게 막습니다.
try {
  const fixX = () => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    if (document.documentElement.scrollLeft) document.documentElement.scrollLeft = 0;
  };
  globalThis.addEventListener?.("DOMContentLoaded", fixX);
  globalThis.addEventListener?.("scroll", fixX, true);
} catch {}

// iframe(390x745)을 폰 한 대로 보이게: 모듈 로드 시점에 창 크기가 흔들려도 카드 폭이 어긋나지 않게 고정합니다.
try {
  const fixed = { width: 390, height: 745, scale: 1, fontScale: 1 };
  const original = Dimensions.get.bind(Dimensions);
  (Dimensions as any).get = (key: "window" | "screen") => (key === "window" || key === "screen" ? fixed : original(key));
} catch {}

// 웹에서는 reanimated 컴포넌트가 className을 무시해 레이아웃이 깨집니다(패딩·flex-row 등). 앱과 같게 className을 style로 연결합니다.
try {
  for (const Comp of [Animated.View, Animated.ScrollView, Animated.Text, Animated.Image]) {
    if (Comp) cssInterop(Comp as any, { className: "style" });
  }
} catch {}

const NOW = () => new Date();
const pad = (n: number) => String(n).padStart(2, "0");

try {
  const ls = globalThis.localStorage;
  if (ls) {
    ls.setItem("auth-storage", JSON.stringify({
      state: {
        user: { id: "demo", username: "demo", email: "demo@ourbee.kr", fullName: "아워비 농장", cropName: "딸기", cultivationType: "시설재배", cultivationAddress: "경상남도 산청군" },
        accessToken: "demo", refreshToken: "demo", isAuthenticated: true,
      },
      version: 0,
    }));
    ls.setItem("webee-welcome-hide-forever", "true");
    ls.setItem("webee-gate-offline-notice-hide-forever", "true");
    ls.setItem("webee:assistant-chat-guide-hidden", "true");
    const at = (minutesAgo: number) => new Date(Date.now() - minutesAgo * 60_000).toISOString();
    const qa: [string, string][] = [
      ["수정벌은 언제 넣는 게 좋을까요?", "딸기는 꽃이 피기 시작하는 시기에 넣는 것이 일반적이에요. 작물과 개화 정도에 따라 달라지니, 농장 상황을 알려주시면 더 정확히 안내해 드릴게요."],
      ["벌통 온도는 몇 도가 적당한가요?", "수정벌이 활동하기 좋은 벌통 내부 온도는 24~27°C예요. 스마트벌통 화면에서 목표 온도를 이 구간으로 맞춰 두면 돼요."],
      ["농약 치는 날에는 벌을 어떻게 하나요?", "살포 전에 개폐기로 출입구를 닫고, 농약별 안전 기간을 확인한 뒤 다시 열어 주세요. 안심농약찾기에서 작물과 곤충으로 검색할 수 있어요."],
    ];
    ls.setItem("assistant-conversations-v1", JSON.stringify([{
      id: "demo-conversation", title: qa[0][0], mode: "RAG", createdAt: at(30), updatedAt: at(1),
      messages: qa.flatMap(([q, a], i) => [
        { id: `demo-q-${i}`, role: "user", text: q, createdAt: at(30 - i * 8) },
        { id: `demo-a-${i}`, role: "assistant", text: a, createdAt: at(29 - i * 8) },
      ]),
    }]));
  }
} catch {}

const ok = (data: unknown) => ({ code: "OK", message: "ok", data });

const hives = [
  { hiveId: 1, name: "토마토 1호", region: "경상남도 산청군", location: "비닐 1동 남쪽", macAddress: "AA:BB:CC:00:00:01", memo: null, createdAt: "2026-09-02T09:00:00" },
];

const gates = [
  { gateId: 1, name: "남쪽 온실 개폐기", region: "경상남도 산청군", location: "비닐 1동 입구", macAddress: "DD:EE:FF:00:00:01", memo: null, isConnected: true, createdAt: "2026-09-02T09:00:00" },
];

function wave(base: number, amp: number, i: number, phase = 0) {
  return Math.round((base + amp * Math.sin((i + phase) / 3.2)) * 10) / 10;
}


// 외부 온도(하루 일교차): 0시 8°C 부근에서 시작해 14시 28°C 부근까지 올랐다가 23시 10°C 부근으로 내려오되,
// 실제 기록처럼 구름·바람에 흔들리는 잔 변동을 얹습니다.
function externalAt(label: string, i: number) {
  const match = /(\d+)\s*(시|:)/.exec(label);
  const hour = match ? Number(match[1]) : null;
  if (hour === null) return Math.round((19 + 3 * Math.sin(i)) * 10) / 10;
  const base = hour <= 14 ? 8 + (20 * hour) / 14 : 28 - (18 * (hour - 14)) / 9;
  const wiggle = 1.5 * Math.sin(hour * 1.9) + 1.0 * Math.sin(hour * 4.3 + 0.7) + 0.6 * Math.sin(hour * 7.1 + 2);
  const value = Math.min(28, Math.max(8, base + wiggle));
  return Math.round(value * 10) / 10;
}

// 앱에서 목표 온도를 바꾸면 내부 온도도 곧바로 그 값으로 맞춰 보여줍니다(실제 벌통 대신 샘플).
let targetTemp = 26.5;

function telemetryPoint(label: string, i: number) {
  return {
    label,
    internalTemperature: targetTemp,
    externalTemperature: externalAt(label, i),
    internalHumidity: Math.round(wave(72, 4, i, 1)),
    externalHumidity: Math.round(wave(76, 6, i, 3)),
    co2: Math.round(wave(444, 25, i)),
    peltierMode: "COOL", peltierDutyPct: 32, fanHotDutyPct: 18, fanColdDutyPct: 24, fanState: "ON",
    targetTemperature: targetTemp, internalSensorValid: true, externalSensorValid: true,
    peltierCoolCurrentA: 1.2, peltierHeatCurrentA: 0,
  };
}

function telemetry(params: Record<string, string> | undefined) {
  const period = params?.period ?? "DAY";
  const now = NOW();
  let labels: string[] = [];
  if (period === "HOUR") {
    const step = { TEN_SEC: 10, ONE_MIN: 60, FIVE_MIN: 300, TEN_MIN: 600 }[params?.interval ?? "ONE_MIN"] ?? 60;
    const from = params?.from ? new Date(params.from) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
    const isCurrent = from.getTime() > now.getTime() - 3600_000;
    const limit = isCurrent ? (now.getMinutes() * 60 + now.getSeconds()) : 3600;
    for (let s = 0; s < 3600 && s <= limit; s += step) {
      labels.push(step < 60 ? `${pad(from.getHours())}:${pad(Math.floor(s / 60))}:${pad(s % 60)}` : `${pad(from.getHours())}:${pad(Math.floor(s / 60))}`);
    }
  } else if (period === "DAY") {
    for (let h = 0; h <= 23; h++) labels.push(`${pad(h)}시`);
  } else if (period === "WEEK") {
    labels = ["월", "화", "수", "목", "금", "토", "일"].map((d) => `${d}요일`);
  } else {
    labels = ["1주차", "2주차", "3주차", "4주차"];
  }
  return { period, data: labels.map((label, i) => telemetryPoint(label, i)) };
}

function gateSeries(period: string, sensor: string) {
  const labels = period === "DAY" ? Array.from({ length: NOW().getHours() + 1 }, (_, h) => `${pad(h)}시`) : period === "WEEK" ? ["월", "화", "수", "목", "금", "토", "일"].map((d) => `${d}요일`) : ["1주차", "2주차", "3주차", "4주차"];
  return { sensorType: sensor, period, data: labels.map((label, i) => ({ label, value: sensor === "TEMPERATURE" ? wave(26, 4, i) : Math.round(wave(68, 8, i)) })) };
}

function gateBees(period: string) {
  const labels = period === "DAY" ? Array.from({ length: NOW().getHours() + 1 }, (_, h) => `${pad(h)}시`) : period === "WEEK" ? ["월", "화", "수", "목", "금", "토", "일"].map((d) => `${d}요일`) : ["1주차", "2주차", "3주차", "4주차"];
  return { period, data: labels.map((label, i) => { const k = Math.max(0, Math.sin((i - 5) / 4)); return { label, entranceIn: Math.round(60 * k + 4), entranceOut: Math.round(56 * k + 3), exitIn: Math.round(52 * k + 3), exitOut: Math.round(58 * k + 4) }; }) };
}


function cropGuide(name: string, category: string) {
  return {
    name, category, menuId: "demo", cntntsNo: "demo", applicableVarieties: ["설향", "금실", "죽향"], usagePeriod: "개화기",
    pollinators: [{
      insectType: "뒤영벌", durationDays: 14, inputTiming: `${name} 꽃이 개화 10%정도 투입`, releaseQuantity: "1봉군(200마리 이상)/1,980~3,310m²",
      installationSteps: ["봉군의 출구를 해가 있는 방향으로 방사 1~2일 전 설치하고, 30~100cm 높이의 받침대와 직사광선을 피하기 위해 봉군 지붕에 판자나 스티로폼 등으로 덮어줌", "포장 내 설치 후 1일 정도 안정시킨 후 출입문을 입구 출구가 노출되도록 완전히 열어둠"],
    }],
    precautions: { colonyManagement: ["봉군은 직사광선을 피해 설치"], temperature: ["내부 온도 24~27°C 유지"], pesticideSafety: ["농약 살포 전 출입구 닫기"] },
    effectiveness: { source: "테스트 데이터", highlights: ["착과율 향상"] },
  };
}

function priceRows(params: Record<string, string>) {
  const mid = Object.entries(params).find(([k]) => k.includes("gds_mclsf_nm"))?.[1] ?? "멜론";
  const corps = ["서울청과(주)", "중앙청과(주)", "동화청과(주)", "한국청과(주)"];
  const origins = ["전라남도", "경상남도", "충청남도", "강원도"];
  const smalls = mid === "딸기" ? ["설향", "금실", "죽향"] : mid === "멜론" ? ["네트계", "머스크", "얼스"] : ["상품", "특품", "보통"];
  const d = new Date(Date.now() + 9 * 3600_000);
  const day = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  return Array.from({ length: 300 }, (_, i) => ({
    scsbd_dt: `${day} ${pad(14 - Math.floor(i / 40))}:${pad((59 - (i * 7) % 60))}:${pad((i * 13) % 60)}`,
    whsl_mrkt_nm: "서울가락", corp_nm: corps[i % corps.length], gds_mclsf_nm: mid, gds_sclsf_nm: smalls[i % smalls.length],
    corp_gds_vrty_nm: smalls[i % smalls.length], plor_nm: origins[i % origins.length], scsbd_prc: String(18000 + ((i * 937) % 24000)),
    qty: String(1 + (i % 6)), unit_qty: String(i % 2 ? 2 : 4), pkg_nm: i % 2 ? "박스" : "상자",
    gds_lclsf_cd: "08", gds_mclsf_cd: "0801", gds_sclsf_cd: "080101",
  }));
}

const PEST_CODES = `<response><header><resultCode>00</resultCode></header><body><items>
${["딸기", "토마토", "참외", "오이"].map((n) => `<item><code>A</code><codeNm>${n}</codeNm></item>`).join("")}
${["살균제", "살충제", "제초제"].map((n) => `<item><code>B</code><codeNm>${n}</codeNm></item>`).join("")}
${["뒤영벌", "꿀벌류", "기타"].map((n) => `<item><code>C</code><codeNm>${n}</codeNm></item>`).join("")}
</items></body></response>`;

function pestList() {
  const rows: string[] = [];
  const names = ["지존", "올스타", "비루투소", "안티멕", "응애특급", "켈스타", "마하", "다이센", "빅카드", "프로파"];
  const goods = ["스피로메시펜 액상수화제", "아바멕틴 유제", "아바멕틴 유제", "아바멕틴 유제", "아바멕틴 유제"];
  for (let i = 0; i < 60; i++) {
    rows.push(`<item><agchmApplcNo>${495 + i}</agchmApplcNo><prdlstNm>${goods[i % goods.length]}</prdlstNm><brandNm>${names[i % names.length]}</brandNm><contInfo>${i % 5 === 0 ? 20 : 1.8}</contInfo><prpos>살충제</prpos><applcsicknsHlsctsickns>점박이응애</applcsicknsHlsctsickns><safeRdmtrTime>${i % 3 ? "2" : "3"}</safeRdmtrTime><sprngspcsNm>뒤영벌</sprngspcsNm><cropsNm>딸기</cropsNm></item>`);
  }
  return `<response><header><resultCode>00</resultCode></header><body><items>${rows.join("")}</items></body></response>`;
}

type Rule = [RegExp, string | null, (m: RegExpMatchArray, cfg: any) => unknown];

const rules: Rule[] = [
  [/^\/api\/v1\/hives$/, "get", () => ok({ totalCount: hives.length, hives })],
  [/^\/api\/v1\/hives\/(\d+)$/, "get", (m) => ok({ ...hives.find((h) => String(h.hiveId) === m[1]) ?? hives[0], connectionStatus: m[1] === "1" ? "ONLINE" : "OFFLINE", lastConnectedAt: NOW().toISOString() })],
  [/^\/api\/v1\/hives\/(\d+)\/connection$/, "get", (m) => ok({ isConnected: m[1] === "1", lastConnectedAt: m[1] === "1" ? NOW().toISOString() : null })],
  [/^\/api\/v1\/hives\/(\d+)\/telemetry$/, "get", (m, cfg) => ok(m[1] === "1" ? telemetry(cfg.params) : { period: cfg.params?.period ?? "DAY", data: [] })],
  [/^\/api\/v1\/hives\/(\d+)\/control$/, "get", () => ok({ controls: [{ type: "TEMPERATURE", targetValue: targetTemp }, { type: "HUMIDITY", targetValue: null }] })],
  [/^\/api\/v1\/hives\/(\d+)\/control\/manual$/, "post", (_m, cfg) => {
    try {
      const body = typeof cfg.data === "string" ? JSON.parse(cfg.data) : cfg.data;
      if (typeof body?.targetTemperature === "number") targetTemp = body.targetTemperature;
    } catch {}
    return ok(null);
  }],
  [/^\/api\/v1\/hives\/(\d+)\/replacement-history$/, "get", () => ok({ first: true, size: 20, content: [{ replacementHistoryId: 1, replacedAt: "2026-10-10", usageDays: 14 }], number: 0, numberOfElements: 1, last: true, empty: false })],
  [/^\/api\/v1\/gates$/, "get", () => ok({ totalCount: gates.length, gates })],
  [/^\/api\/v1\/gates\/(\d+)$/, "get", () => ok({ ...gates[0], lastConnectedAt: NOW().toISOString(), modifiedAt: null })],
  [/^\/api\/v1\/gates\/(\d+)\/connection$/, "get", () => ok({ isConnected: true, lastConnectedAt: NOW().toISOString() })],
  [/^\/api\/v1\/gates\/(\d+)\/telemetry$/, "get", (_m, cfg) => ok(gateSeries(cfg.params?.period ?? "DAY", cfg.params?.sensorType ?? "TEMPERATURE"))],
  [/^\/api\/v1\/gates\/(\d+)\/bee-count$/, "get", (_m, cfg) => ok(gateBees(cfg.params?.period ?? "DAY"))],
  [/^\/api\/v1\/users\/me$/, "get", () => ok({ id: "demo", username: "demo", email: "demo@ourbee.kr", fullName: "아워비 농장" })],
  [/^\/api\/v1\/profile\/crops$/, "get", () => ok([{ userCropId: 1, cropName: "딸기", varietyName: "설향", cultivationType: "시설재배", region: "경상남도 산청군", area: 600, plantingDate: "2026-09-05" }])],
  [/^\/api\/v1\/profile\/crops$/, "get", () => ok([{ id: 1, name: "딸기", variety: "설향", cultivationType: "CONTROLLED", cultivationAddress: "경상남도 산청군", cultivationArea: 600, plantingDate: "2026-09-05", harvestStartDate: "2026-12-01", harvestEndDate: "2027-04-30" }])],
  [/^\/api\/v1\/bee\/recommendations\/crops$/, "get", () => ok([{ category: "과채류", crops: ["딸기", "토마토", "참외", "수박", "멜론", "오이"] }, { category: "과수", crops: ["사과", "배", "복숭아", "블루베리"] }])],
  [/^\/api\/v1\/bee\/recommendations\/crops\/guide$/, "get", (_m, cfg) => ok(cropGuide(cfg.params?.crop ?? "딸기", cfg.params?.category ?? "과채류"))],
  [/^\/api\/v1\/bee\/recommendations$/, "get", () => ok([])],
  [/^\/api\/v1\/bee\/recommendations\/ai$/, "post", () => ok({ beeType: "뒤영벌", characteristics: ["저온에서도 활동량이 좋은 편", "시설 내부 좁은 공간에서 꽃가루를 옮김"], inputStartDate: "2026-11-20", inputEndDate: "2026-12-05", caution: ["농약 살포 후에는 안전 기간을 확인하고 입봉"], usageTip: ["봉군 출구는 해가 드는 방향으로 설치"] })],
  [/^\/api\/v1\/assistants\/sample-questions$/, "get", () => ok(["수정벌은 언제 넣는 게 좋을까요?", "벌통 온도는 몇 도가 적당한가요?", "농약 친 뒤 언제 벌을 다시 넣나요?"])],
  [/^\/api\/v1\/assistants\/messages$/, "post", () => ok({ conversationId: "demo", sources: [], answer: "재배 작물과 개화 단계, 시설 내부 온도에 따라 달라져요. 작물과 재배 면적을 알려주시면 이어서 안내할게요." })],
  [/^\/api\/v1\/interest-markets$/, "get", () => ok([{ interestMarketId: 1, marketCode: "110001", cropMajorCode: "08", cropMidName: "딸기", cropMinorName: "산딸기" }])],
  [/^\/api\/v1\/interest-pesticides$/, "get", () => ok({ content: [] })],
  [/^\/api\/v1\/fcm-tokens$/, null, () => ok("ok")],
];

function install() {
  api.defaults.adapter = async (config: any) => {
    const url = String(config.url ?? "").replace(/^https?:\/\/[^/]+/, "").split("?")[0];
    const method = String(config.method ?? "get").toLowerCase();
    for (const [re, m, fn] of rules) {
      const hit = url.match(re);
      if (hit && (m === null || m === method)) {
        return { data: fn(hit, config), status: 200, statusText: "OK", headers: {}, config, request: {} };
      }
    }
    console.warn("[demo-mock-miss]", method, url, config.params ?? "");
    return { data: ok(null), status: 200, statusText: "OK", headers: {}, config, request: {} };
  };
}

install();

function installExternal() {
  const prev = (axios.defaults as any).adapter;
  axios.defaults.adapter = async (config: any) => {
    const url = String(config.url ?? "");
    if (url.startsWith("https://demo.invalid/price")) {
      const rows = priceRows(config.params ?? {});
      return { data: { response: { header: { resultCode: "0", resultMsg: "OK" }, body: { totalCount: rows.length, items: { item: rows } } } }, status: 200, statusText: "OK", headers: {}, config, request: {} };
    }
    if (url.startsWith("https://demo.invalid/nongsaro")) {
      const data = url.endsWith("insectAgchApplcCode") ? PEST_CODES : pestList();
      return { data, status: 200, statusText: "OK", headers: {}, config, request: {} };
    }
    if (url.startsWith("/api/") || url.includes("webeelab")) return (api.defaults.adapter as any)(config);
    return typeof prev === "function" ? prev(config) : Promise.reject(new Error("demo: blocked"));
  };
}
installExternal();
