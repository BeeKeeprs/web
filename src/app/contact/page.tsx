import type { Metadata } from "next";
import ContactForm from "../_components/ContactForm";

export const metadata: Metadata = { title: "도입 문의 | 아워비", description: "아워비 스마트벌통·스마트개폐기 가격과 설치 구성을 문의하세요." };

export default function ContactPage() {
  return (
    <main className="subpage ct-page">
      <section className="ct-apply">
        <div className="ct-inner" data-reveal>
          <div className="ct-copy">
            <h1>우리 농장에 맞는<br />구성을 상담해요.</h1>
            <p>작물과 하우스 환경, 벌통 수를 알려주시면 알맞은 제품과 가격을 안내해 드릴게요.</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
