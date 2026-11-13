"use client";

import { useRouter } from "next/navigation";
import InquiryPanel from "./InquiryPanel";
import { farmInquiryFields } from "./farmInquiryFields";
import FarmInquiryPreview from "./FarmInquiryPreview";

type ContactResponse = { error?: string };

export default function ContactForm() {
  const router = useRouter();

  async function send(values: Record<string, string>) {
    // The inquiry API wants one message and a product: fold the farm details into the message.
    const requested = new URLSearchParams(window.location.search).get("product");
    const interestProduct = requested === "gate" || requested === "smart-hive" ? requested : "all";
    const message = [
      `농장 지역: ${values["농장 지역"]}`,
      `재배 작물: ${values["재배 작물"]}`,
      `수정벌 사용 현황: ${values["수정벌 사용 현황"]}`,
      "",
      values["문의 내용"] || "(문의 내용 없음)",
    ].join("\n");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values["성함"],
        phone: values["연락처"] || null,
        email: values["이메일"] || null,
        organization: null,
        interestProduct,
        message,
      }),
    });
    const result = (await response.json()) as ContactResponse;
    if (!response.ok) throw new Error(result.error || "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    router.push("/contact/complete");
  }

  return (
    process.env.NODE_ENV === "development" ? <FarmInquiryPreview /> :
    <InquiryPanel
      title="문의 남기기"
      description="농장 정보를 적어주시면 알맞은 제품과 가격을 안내해 드릴게요."
      fields={farmInquiryFields}
      submitLabel="문의 보내기"
      note="선택 항목은 비워두셔도 돼요."
      onSubmit={send}
    />
  );
}
