import type { InquiryField } from "./InquiryPanel";

// The farm inquiry fields, shared by the pilot sign-up and the contact page so labels and order never drift apart.
export const farmInquiryFields: InquiryField[] = [
  { name: "성함", label: "성함", required: true, half: true, placeholder: "성함", autoComplete: "name", maxLength: 80 },
  { name: "연락처", label: "연락처", type: "tel", required: true, half: true, placeholder: "전화번호", autoComplete: "tel", maxLength: 40 },
  { name: "농장 지역", label: "농장 지역", required: true, half: true, placeholder: "예: 경남 밀양", maxLength: 120 },
  { name: "재배 작물", label: "재배 작물", required: true, half: true, placeholder: "예: 딸기", maxLength: 120 },
  { name: "수정벌 사용 현황", label: "수정벌 사용 현황", required: true, placeholder: "예: 사용 중인 벌통 수량", maxLength: 200 },
  { name: "이메일", label: "이메일", type: "email", placeholder: "name@example.com", autoComplete: "email", maxLength: 254 },
  { name: "문의 내용", label: "문의 내용", type: "textarea", placeholder: "설치 환경이나 궁금한 점을 적어주세요", maxLength: 4000 },
];
