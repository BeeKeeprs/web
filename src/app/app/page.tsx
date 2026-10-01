import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChartNoAxesCombined, Clock3, MessageCircle, SlidersHorizontal, Sparkles, Thermometer, Waypoints } from "lucide-react";

export const metadata: Metadata = {
  title: "앱과 데이터 | 아워비",
  description: "아워비 스마트벌통과 개폐기의 자동 제어, 앱의 온습도·출입 기록, AI 활동 리포트와 수정벌 추천 기능을 소개합니다.",
};

const features = [
  { icon: Thermometer, number: "01", title: "벌통의 지금", body: "내부·외부 온도와 습도, 연결 상태를 벌통별로 살펴봅니다." },
  { icon: SlidersHorizontal, number: "02", title: "내가 정하는 목표 온도", body: "앱에서 목표 온도를 0.5°C 단위로 조절하고 벌통에 적용합니다." },
  { icon: ChartNoAxesCombined, number: "03", title: "쌓이는 환경 기록", body: "시간별 온습도 흐름과 벌통의 변화를 다시 확인합니다." },
  { icon: Clock3, number: "04", title: "교체·출입 관리", body: "벌 교체 경과일을 기록하고 개폐기에 즉시·시간 예약 개폐 카드를 적용합니다." },
];

const aiFeatures = [
  { number: "01 / ACTIVITY", title: "AI 벌 활동 리포트", body: "개폐기에서 받은 출입량과 온습도 기록으로 시간대별 변화를 읽고, 농가가 살펴볼 항목을 정리합니다." },
  { number: "02 / RECOMMEND", title: "수정벌 추천", body: "작물과 재배 환경을 입력하면 수정벌 선택에 참고할 추천 결과와 이유를 확인합니다." },
  { number: "03 / ASK", title: "수정벌 AI 상담", body: "사육과 관리 중 생긴 질문을 앱에서 묻고, 답변과 참고 정보를 살펴봅니다." },
];

export default function AppPage() {
  return <main className="subpage app-page">
    <section className="app-hero section-wrap">
      <div className="app-hero-copy" data-reveal>
        <span className="eyebrow">OURBEE APP & DATA</span>
        <h1>보는 앱을 넘어,<br /><em>관리의 기준이 되는 앱.</em></h1>
        <p>벌통의 온도, 개폐기의 출입, 농가의 관리 이력. 따로 흩어져 있던 순간을 아워비 앱에서 이어 봅니다.</p>
        <Link className="button-orange" href="/contact">우리 농장에 맞게 문의하기 <ArrowUpRight size={18} /></Link>
      </div>
      <div className="app-hero-visual" data-reveal>
        <div className="app-phone"><Image src="/images/product/app-control.png" alt="온습도와 목표 온도를 표시하는 아워비 앱 화면" fill priority sizes="(max-width: 760px) 68vw, 330px" /></div>
        <span>온습도 확인 · 목표 온도 설정 · 기록</span>
      </div>
    </section>

    <section className="app-flow">
      <div className="section-wrap">
        <div className="app-section-heading" data-reveal><span className="eyebrow">HOW THE SYSTEM WORKS</span><h2>현장에서 측정하고,<br /><em>장치가 움직이고, 앱에 남습니다.</em></h2></div>
        <div className="app-flow-grid">
          <article data-reveal><span>01 / SENSE</span><Thermometer size={28} /><h3>벌통의 환경을 읽다</h3><p>벌통 안팎의 온도와 습도를 센서가 측정합니다.</p></article>
          <article data-reveal><span>02 / CONTROL</span><SlidersHorizontal size={28} /><h3>설정 온도를 따라 제어</h3><p>농가가 정한 목표 온도에 맞춰 벌통의 냉각 장치가 자동으로 작동합니다.</p></article>
          <article data-reveal><span>03 / RECORD</span><Waypoints size={28} /><h3>앱에서 다시 보다</h3><p>측정값과 상태가 앱에 이어져, 그날의 변화를 기록으로 살펴봅니다.</p></article>
        </div>
      </div>
    </section>

    <section className="app-features section-wrap">
      <div className="app-section-heading" data-reveal><span className="eyebrow">IN YOUR HAND</span><h2>농가가 앱에서<br /><em>직접 할 수 있는 일.</em></h2></div>
      <div className="app-feature-grid">{features.map(({ icon: Icon, number, title, body }) => <article key={number} data-reveal><div><Icon size={25} strokeWidth={1.8} /><span>{number}</span></div><h3>{title}</h3><p>{body}</p></article>)}</div>
      <div className="app-record-story" data-reveal><div><span className="eyebrow">A RECORD FOR EVERY SEASON</span><h3>온도 하나에서,<br />환경·출입·관리 이력으로.</h3><p>스마트벌통은 환경 변화를, 개폐기는 벌의 출입과 온습도 기록을 남깁니다. 농가는 한 앱에서 각각의 기록을 살펴보며 다음 관리의 근거를 쌓습니다.</p></div><div className="app-record-image"><Image src="/images/product/app-records.png" alt="시간별 온습도 기록을 보여주는 아워비 앱 화면" fill sizes="(max-width: 760px) 60vw, 280px" /></div></div>
    </section>

    <section className="app-ai">
      <div className="section-wrap app-ai-layout"><div className="app-ai-intro" data-reveal><span className="eyebrow eyebrow-light"><Sparkles size={16} /> OURBEE AI</span><h2>기록을 모은 다음,<br /><em>무엇을 볼지 알려주는 AI.</em></h2><p>AI는 현장 기록을 읽기 쉬운 설명으로 정리하고, 수정벌 선택과 관리 질문에 참고할 정보를 제공합니다.</p><div className="ai-boundary"><MessageCircle size={20} /><span>온도 제어와 출입구 동작은 장치·농가의 설정에 따라 이뤄집니다. AI가 임의로 장치를 작동시키지는 않습니다.</span></div></div><div className="app-ai-list">{aiFeatures.map(({ number, title, body }) => <article key={number} data-reveal><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div></div>
    </section>

    <section className="app-close section-wrap" data-reveal><span className="eyebrow">ONE CONNECTED VIEW</span><h2>벌통에서 끝나는 기술이 아니라,<br /><em>농가의 다음 판단으로 이어지는 기록.</em></h2><p>아워비의 스마트벌통과 개폐기, 앱을 농장의 환경에 맞게 연결해 보세요.</p><div><Link className="button-orange" href="/products">제품 살펴보기 <ArrowUpRight size={18} /></Link><Link className="button-text" href="/contact">도입 문의 <ArrowUpRight size={18} /></Link></div></section>
  </main>;
}
