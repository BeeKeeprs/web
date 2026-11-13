import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

export default function ContactComplete() {
  return (
    <main className="contact-complete-page section-wrap">
      <div className="contact-complete-card">
        <span className="contact-complete-icon" aria-hidden="true"><Check size={36} /></span>
        <span className="eyebrow">CONTACT OURBEE</span>
        <h1>문의 작성이<br /><em>완료되었습니다!</em></h1>
        <p>문의 내용을 작성해 주셔서 감사합니다.</p>
        <div className="contact-complete-actions">
          <Link className="button-text" href="/contact"><ArrowLeft size={17} /> 문의 페이지로 돌아가기</Link>
        </div>
      </div>
    </main>
  );
}
