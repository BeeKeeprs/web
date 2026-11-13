"use client";

import { useRouter } from "next/navigation";
import InquiryPanel from "../_components/InquiryPanel";
import { farmInquiryFields } from "../_components/farmInquiryFields";
import FarmInquiryPreview from "../_components/FarmInquiryPreview";

export default function PilotForm() {
  const router = useRouter();

  function send(values: Record<string, string>) {
    const body = farmInquiryFields.map(({ name }) => `${name}: ${values[name] || "미입력"}`).join("\n");
    const subject = encodeURIComponent("[아워비] 100일 실증농가 참여 문의");
    window.location.href = `mailto:da.young.yun13@gmail.com?subject=${subject}&body=${encodeURIComponent(`아워비 100일 실증농가 참여 문의\n\n${body}`)}`;
    window.setTimeout(() => router.push("/contact/complete"), 300);
  }

  return (
    process.env.NODE_ENV === "development" ? <FarmInquiryPreview pilot /> :
    <InquiryPanel
      title="참여 문의 남기기"
      description="농장 정보를 적어주시면 참여 가능 여부를 함께 살펴보겠습니다."
      fields={farmInquiryFields}
      submitLabel="문의하기"
      note="문의하기를 누른 뒤 열리는 메일 작성 화면에서 보내기를 완료해 주세요."
      onSubmit={send}
    />
  );
}
