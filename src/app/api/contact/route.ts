import { NextResponse } from "next/server";

export const runtime = "nodejs";

// The inquiry goes to the OurBee backend (POST /api/v1/inquiries), which mails it to the team.
const backendUrl = process.env.BACKEND_API_URL ?? "https://webeelab.site";
// The form sends the product slug; the backend expects its enum name.
const products: Record<string, string> = {
  "smart-hive": "SMART_HIVE",
  gate: "GATE",
  app: "APP",
  all: "ALL",
  other: "OTHER",
};

function text(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength ? trimmed : null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "요청 내용을 확인해 주세요." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "요청 내용을 확인해 주세요." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = text(input.name, 80);
  const phone = input.phone == null || input.phone === "" ? null : text(input.phone, 40);
  const email = input.email == null || input.email === "" ? null : text(input.email, 254);
  const organization = input.organization == null || input.organization === "" ? null : text(input.organization, 120);
  const interestProduct = typeof input.interestProduct === "string" ? input.interestProduct : "";
  const message = text(input.message, 5000);

  if (!name || !message || !Object.hasOwn(products, interestProduct)) {
    return NextResponse.json({ error: "이름과 관심 제품, 문의 내용을 확인해 주세요." }, { status: 400 });
  }
  if (input.phone != null && input.phone !== "" && !phone) {
    return NextResponse.json({ error: "전화번호는 40자 이내로 입력해 주세요." }, { status: 400 });
  }
  if (input.email != null && input.email !== "" && !email) {
    return NextResponse.json({ error: "이메일 주소를 확인해 주세요." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "이메일 주소를 확인해 주세요." }, { status: 400 });
  }
  if (phone && !/^[+\d().\-\s]{7,40}$/.test(phone)) {
    return NextResponse.json({ error: "전화번호를 확인해 주세요." }, { status: 400 });
  }
  if ((input.organization != null && input.organization !== "" && !organization) || !phone && !email) {
    if (!phone && !email) return NextResponse.json({ error: "답변받으실 전화번호나 이메일을 하나 남겨주세요." }, { status: 400 });
    return NextResponse.json({ error: "소속은 120자 이내로 적어주세요." }, { status: 400 });
  }

  try {
    const response = await fetch(`${backendUrl}/api/v1/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, organization, interestProduct: products[interestProduct], message }),
      signal: AbortSignal.timeout(10000),
    });

    if (response.status === 400) {
      return NextResponse.json({ error: "입력 내용을 한 번 더 확인해 주세요." }, { status: 400 });
    }
    if (!response.ok) {
      return NextResponse.json({ error: "보내지 못했어요. 잠시 후 다시 눌러주세요." }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "전송이 잘 안 됐어요. 잠시 후 다시 눌러주세요." }, { status: 502 });
  }
}
