import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowUpRight, ChartNoAxesCombined, DoorOpen, MessageCircle, SlidersHorizontal, Sparkles, Thermometer } from "lucide-react";

export const metadata: Metadata = {
  title: "앱과 데이터 | 아워비",
  description: "스마트벌통 온습도와 작동 상태, 스마트개폐기 벌 출입을 자동 기록하고 AI로 변화와 알림을 살펴보는 아워비 앱을 소개합니다.",
};

const hiveFeatures = [
  { icon: Thermometer, number: "01", title: "벌통의 지금", body: "내부·외부 온도와 습도, 연결 상태를 벌통별로 살펴봅니다." },
  { icon: SlidersHorizontal, number: "02", title: "내가 정하는 목표 온도", body: "앱에서 0.5°C 단위로 목표 온도를 정하면 냉각 장치가 설정에 맞춰 작동합니다." },
  { icon: ChartNoAxesCombined, number: "03", title: "쌓이는 환경 기록", body: "시간별 온습도 흐름과 벌통의 변화를 다시 확인합니다." },
];

const gateFeatures = [
  { icon: Activity, number: "01", title: "시간대별 벌 출입", body: "개폐기가 기록한 벌 출입량을 시간대별로 확인합니다." },
  { icon: Thermometer, number: "02", title: "개폐기 주변 온습도", body: "개폐기에서 측정한 온도와 습도 기록을 함께 살펴봅니다." },
  { icon: DoorOpen, number: "03", title: "출입구 개폐 관리", body: "필요할 때 바로 열고 닫거나, 원하는 시간에 맞춰 예약합니다." },
];

const aiFeatures = [
  { number: "01 / ALERT", title: "필요한 순간, 먼저 알려드려요", body: "온도가 설정 범위를 벗어나거나 장치 연결·예약 개폐에 문제가 생기면 바로 알립니다." },
  { number: "02 / ANALYZE", title: "평소와 다른 흐름을 찾아요", body: "온습도와 벌 출입 기록을 시간대별로 비교해 달라진 점을 이해하기 쉽게 보여드립니다." },
  { number: "03 / FARM DATA", title: "비용과 수확 변화도 함께 봐요", body: "벌 구매·교체비와 수확량·판매액은 농가가 공유한 범위에서 비교해 수익 변화 분석에 활용합니다." },
];

export default function AppPage() {
  return <main className="subpage app-page">
    <section className="app-hero section-wrap">
      <div className="app-hero-copy" data-reveal>
        <span className="eyebrow">OURBEE APP & DATA</span>
        <h1>벌통과 개폐기를 연결해,<br /><em>기록은 자동으로.</em></h1>
        <p>전원과 통신을 연결하면 벌통의 온습도·작동 상태와 개폐기의 벌 출입이 자동으로 기록됩니다. 앱에서 현황과 변화를 한눈에 살펴보세요.</p>
        <Link className="button-orange" href="/contact">우리 농장에 맞게 문의하기 <ArrowUpRight size={18} /></Link>
      </div>
      <div className="app-hero-visual" data-reveal>
        <div className="app-phone"><Image src="/images/product/app-control.png" alt="온습도와 목표 온도를 표시하는 아워비 앱 화면" fill priority sizes="(max-width: 760px) 68vw, 330px" /></div>
        <span>온습도 · 목표 온도 · 자동 기록</span>
      </div>
    </section>

    <section className="app-features section-wrap">
      <div className="app-section-heading" data-reveal><span className="eyebrow">SMART HIVE</span><h2>스마트벌통과 연결하면<br /><em>환경 관리가 자동으로 이어집니다.</em></h2></div>
      <div className="app-feature-grid">{hiveFeatures.map(({ icon: Icon, number, title, body }) => <article key={number} data-reveal><div><Icon size={25} strokeWidth={1.8} /><span>{number}</span></div><h3>{title}</h3><p>{body}</p></article>)}</div>
    </section>

    <section className="app-gate-section">
      <div className="section-wrap app-gate-layout">
        <div className="app-section-heading" data-reveal><span className="eyebrow">SMART GATE</span><h2>개폐기와 연결하면<br /><em>벌의 출입도 기록됩니다.</em></h2><p>벌이 드나든 흐름과 개폐기 주변 환경을 앱에서 확인하고, 출입구 작동도 관리할 수 있습니다.</p></div>
        <div className="app-gate-grid">{gateFeatures.map(({ icon: Icon, number, title, body }) => <article key={number} data-reveal><span>{number}</span><Icon size={26} strokeWidth={1.7} /><h3>{title}</h3><p>{body}</p></article>)}</div>
      </div>
    </section>

    <section className="app-record-story section-wrap" data-reveal><div><span className="eyebrow">A RECORD FOR EVERY SEASON</span><h3>온도 하나에서,<br />환경·출입·관리 이력으로.</h3><p>전원과 통신을 연결하면 온습도·작동 상태와 벌 출입 기록이 자동으로 쌓입니다. 벌 구매·교체비와 수확량·판매액은 농가가 가능한 범위에서 공유하고, 아워비가 기록을 연결해 변화 흐름을 보여드립니다.</p></div><div className="app-record-image"><Image src="/images/product/app-records.png" alt="시간별 온습도 기록을 보여주는 아워비 앱 화면" fill sizes="(max-width: 760px) 60vw, 280px" /></div></section>

    <section className="app-ai">
      <div className="section-wrap app-ai-layout"><div className="app-ai-intro" data-reveal><span className="eyebrow eyebrow-light"><Sparkles size={16} /> OURBEE AI</span><h2>기록은 계속 살피고,<br /><em>필요한 변화는 먼저 알려드려요.</em></h2><p>정해둔 기준에서 벗어난 상황은 바로 알리고, 쌓인 기록은 AI가 시간대별로 분석합니다. 농가가 공유한 비용·수확 자료까지 연결해 관리와 수익의 변화를 살펴봅니다.</p><div className="ai-boundary"><MessageCircle size={20} /><span>온도와 개폐기는 정해둔 기준에 따라 작동합니다. AI는 기록에서 달라진 흐름을 찾아 이해하기 쉽게 알려드립니다.</span></div></div><div className="app-ai-list">{aiFeatures.map(({ number, title, body }) => <article key={number} data-reveal><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div></div>
    </section>

    <section className="app-close section-wrap" data-reveal><span className="eyebrow">ONE CONNECTED VIEW</span><h2>벌통에서 끝나는 기술이 아니라,<br /><em>농가의 다음 판단으로 이어지는 기록.</em></h2><p>아워비의 스마트벌통과 개폐기, 앱을 농장의 환경에 맞게 연결해 보세요.</p><div><Link className="button-orange" href="/products">제품 살펴보기 <ArrowUpRight size={18} /></Link><Link className="button-text" href="/contact">도입 문의 <ArrowUpRight size={18} /></Link></div></section>
  </main>;
}
