import type { Metadata } from "next";
import { Mail } from "lucide-react";
import ContactForm from "../_components/ContactForm";

export const metadata: Metadata = { title: "도입 문의 | 아워비", description: "아워비 스마트벌통·스마트개폐기 가격과 설치 구성을 문의하세요." };

export default function ContactPage() {
  return <main className="subpage contact-page section-wrap"><div className="contact-intro" data-reveal><span className="eyebrow">CONTACT OURBEE</span><h1>우리 농장의 이야기부터<br /><em>들려주세요.</em></h1><p>작물, 벌통 수량과 설치 환경을 알려주시면 제품 구성과 가격을 함께 안내합니다.</p><div className="contact-direct"><Mail size={20} /><div><span>직접 이메일 보내기</span><a href="mailto:da.young.yun13@gmail.com">da.young.yun13@gmail.com</a></div></div></div><ContactForm /></main>;
}
