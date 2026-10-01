"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";

export default function ContactForm() {
  const [product, setProduct] = useState("스마트벌통");
  useEffect(() => { if (new URLSearchParams(window.location.search).get("product") === "gate") setProduct("스마트개폐기"); }, []);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = ["아워비 제품 문의", "", ...["이름", "연락처", "지역·작물", "필요한 제품", "문의 내용"].map((key) => `${key}: ${key === "필요한 제품" ? product : data.get(key) ?? ""}`)].join("\n");
    window.location.href = `mailto:da.young.yun13@gmail.com?subject=${encodeURIComponent(`[아워비 문의] ${product}`)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-pair"><label>이름<input name="이름" required placeholder="성함을 알려주세요" /></label><label>연락처<input name="연락처" required placeholder="전화번호 또는 이메일" /></label></div>
      <label>지역·작물<input name="지역·작물" placeholder="예: 밀양 · 딸기" /></label>
      <label>관심 제품<select value={product} onChange={(event) => setProduct(event.target.value)}><option>스마트벌통</option><option>스마트개폐기</option><option>두 제품 모두</option></select></label>
      <label>문의 내용<textarea name="문의 내용" rows={6} required placeholder="벌통 수량, 전원·네트워크 환경, 궁금한 점을 적어주세요." /></label>
      <button type="submit" className="button-orange">이메일 앱에서 문의 보내기 <ArrowUpRight size={19} /></button>
      <p>버튼을 누르면 이메일 앱이 열립니다. 이메일 앱에서 보내기를 눌러야 접수됩니다.</p>
    </form>
  );
}
