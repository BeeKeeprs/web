import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight, Check, MapPin, Thermometer, ClipboardList } from "lucide-react";
import PilotForm from "./PilotForm";
import PilotMotion from "./PilotMotion";
import "./pilot.css";

export const metadata: Metadata = {
  title: "100일 실증농가 모집 | 아워비",
  description: "수정벌을 사용하는 시설재배 농가를 찾습니다. 아워비 스마트벌통을 100일간 무상으로 사용하고 겨울철 현장 경험을 함께 기록해 주세요.",
  openGraph: { images: ["/images/product/hero-greenhouse.png"] },
};

const expectations = [
  { icon: Thermometer, title: "겨울철 벌통 환경을 살펴봅니다", text: "하우스 안팎의 온도 변화와 벌통 내부 온습도를 기록하고, 농가가 정한 목표 온도에 맞춰 관리하는 과정이 현장에서 유용한지 확인합니다." },
  { icon: ClipboardList, title: "직접 확인하는 수고를 살펴봅니다", text: "앱에서 벌통 상태와 시간별 기록을 확인하는 방식이 겨울철 농가의 관리 동선에 어떤 도움을 주는지 의견을 듣습니다." },
  { icon: Check, title: "실제 사용성을 함께 점검합니다", text: "설치 위치, 전원·통신 환경, 앱 사용과 유지관리에서 불편한 점을 찾아 다음 제품 개선에 반영합니다." },
];

export default function PilotPage() {
  return (
    <main className="pilot-page">
      <PilotMotion />
      <div className="pilot-scroll-track" aria-hidden="true"><span /></div>
      <section className="pilot-hero">
        <div className="pilot-hero-copy" data-pilot-reveal>
          <p className="pilot-overline">수정벌 사용 농가와 함께하는 겨울 현장 실험</p>
          <h1>이번 겨울,<br /><span>벌통을 함께</span><br />살펴볼 농가를 찾습니다.</h1>
          <p className="pilot-hero-desc">밀양을 비롯한 수정벌 사용 지역의 시설재배 농가에서 아워비 스마트벌통을 <strong>100일간 무상으로 사용</strong>해 보실 분을 모집합니다.</p>
          <div className="pilot-hero-actions"><a href="#apply" className="pilot-primary">실증 참여 문의하기 <ArrowRight size={19} /></a><a href="#program" className="pilot-secondary">100일 실험 알아보기 <ArrowDown size={17} /></a></div>
          <p className="pilot-hero-foot">신청 후 재배 환경과 설치 가능 여부를 함께 확인합니다.</p>
        </div>
        <div className="pilot-hero-visual" data-pilot-reveal>
          <Image src="/images/product/hero-greenhouse.png" alt="딸기 시설하우스에 놓인 아워비 스마트벌통 이미지" fill priority sizes="(max-width: 900px) 100vw, 55vw" />
          <div className="pilot-hero-stamp"><strong>100<span>일</span></strong><small>스마트벌통<br />무상 사용</small></div>
        </div>
      </section>

      <div className="pilot-ribbon"><span>수정벌 사용 시설재배 농가</span><i /><span>스마트벌통 100일 무상 사용</span><i /><span>현장 경험을 함께 기록</span></div>

      <section className="pilot-intro pilot-wrap" id="program">
        <div className="pilot-section-heading" data-pilot-reveal><span>왜 함께 하나요</span><h2>실제 농가에서 써봐야<br />알 수 있는 것들이 있습니다.</h2></div>
        <div className="pilot-intro-content" data-pilot-reveal><p>겨울철 딸기꽃이 피는 하우스에서 수정벌을 관리할 때, 벌통의 환경을 확인하고 기록하는 방식이 농가에 맞는지 알고 싶습니다.</p><p>아워비가 장비를 제공하고, 농가는 100일 동안 사용하며 편했던 점과 불편했던 점을 들려주세요. 이번 실증은 성능이나 수확 효과가 이미 입증됐다는 뜻이 아닙니다.</p></div>
      </section>

      <section className="pilot-photo-section"><div className="pilot-flower-photo"><Image src="/images/strawberry-blossom-winter-ai.png" alt="겨울 시설하우스의 딸기꽃 이미지" fill sizes="(max-width: 900px) 100vw, 48vw" /></div><div className="pilot-photo-copy" data-pilot-reveal><span>겨울철에 확인할 것</span><h2>꽃이 피는 계절,<br />벌통 안의 환경은<br />어떻게 달라질까요?</h2><p>하우스 환경이 달라지는 겨울 동안, 벌통 안팎의 온습도 변화와 설정 온도에 따른 작동 기록을 살펴봅니다. 그 기록이 농가의 실제 관리에 도움이 되는지도 함께 확인합니다.</p><a href="#expectations">기대효과 살펴보기 <ArrowRight size={18} /></a></div></section>

      <section className="pilot-expect" id="expectations"><div className="pilot-wrap"><div className="pilot-section-heading" data-pilot-reveal><span>기대효과 · 실증에서 확인할 항목</span><h2>100일 동안 함께<br />확인하고 싶은 변화</h2><p>아래 내용은 기대하는 사용 경험이며, 벌의 생존율·수분율·수확량 개선을 보장하는 결과가 아닙니다.</p></div><div className="pilot-expect-grid">{expectations.map(({ icon: Icon, title, text }, index) => <article key={title} data-pilot-reveal style={{ "--pilot-delay": `${index * 120}ms` } as CSSProperties}><div className="pilot-expect-icon"><Icon size={24} strokeWidth={1.7} /></div><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="pilot-details pilot-wrap"><div className="pilot-section-heading" data-pilot-reveal><span>참여 안내</span><h2>우리 농장도<br />참여할 수 있을까요?</h2></div><div className="pilot-detail-list"><div data-pilot-reveal><strong><MapPin size={20} /> 대상</strong><p>밀양 등 수정벌을 사용하는 지역의 시설재배 농가. 딸기 재배 농가를 우선 살펴보며, 다른 작물도 문의할 수 있습니다.</p></div><div data-pilot-reveal><strong>제공</strong><p>아워비 스마트벌통을 100일간 무상으로 사용할 수 있도록 제공합니다. 장비 구성과 설치 방식은 현장 확인 후 협의합니다.</p></div><div data-pilot-reveal><strong>함께할 일</strong><p>100일 동안 장비를 사용하고, 관리 경험과 불편 사항을 간단히 공유해 주세요. 방문·기록 방식은 농가와 협의합니다.</p></div><div data-pilot-reveal><strong>신청 과정</strong><p>참여 문의 → 농장 환경 확인 → 실증 내용 협의 → 설치 및 사용 → 100일 사용 경험 정리</p></div></div></section>

      <section className="pilot-apply" id="apply"><div className="pilot-wrap pilot-apply-inner"><div className="pilot-apply-copy" data-pilot-reveal><span>100일 실증농가 모집</span><h2>이번 겨울,<br />우리 농장에서<br />함께 확인해 볼까요?</h2><p>농장 위치, 재배 작물, 수정벌 사용 현황을 알려주세요. 참여 가능 여부와 구체적인 조건을 안내드리겠습니다.</p><small>신청만으로 참여가 확정되지는 않습니다. 실증 종료 후 장비 처리와 전원·통신 등 세부 조건은 참여 전 개별 협의합니다.</small></div><div data-pilot-reveal><PilotForm /></div></div></section>
    </main>
  );
}
