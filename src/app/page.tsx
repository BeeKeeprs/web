import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import ProductCard from "./_components/ProductCard";

const faqs = [
  ["벌통 온도는 직접 정할 수 있나요?", "네. 앱에서 목표 온도를 직접 설정하고, 벌통 안팎의 온도와 습도를 확인할 수 있습니다."],
  ["농약을 칠 때 벌통을 옮기지 않아도 되나요?", "스마트개폐기로 출입구를 관리할 수 있습니다. 농약 살포 시 필요한 이동·안전 조치는 살포 조건에 따라 달라지므로 문의 부탁드립니다."],
  ["벌 구입비는 얼마나 아낄 수 있나요?", "봉군 단가와 재구입 횟수에 따라 다릅니다. 제품 상세페이지에서 농가의 숫자를 넣어 절감 가능액을 가정해 볼 수 있습니다."],
  ["AI가 벌통을 알아서 조작하나요?", "온도 제어는 농가가 설정한 목표 온도를 따릅니다. AI는 수집된 출입·온습도 기록을 활동 리포트로 정리하고 관리 질문에 참고할 정보를 제공합니다."],
  ["우리 농장에도 설치할 수 있나요? 가격은요?", "벌통 형태, 수량, 설치 환경에 맞춰 안내합니다. 제품 가격과 설치 가능 여부는 문의하기로 상담해 주세요."],
];

export default function HomePage() {
  return (
    <main>
      <section className="hero section-wrap" id="top">
        <div className="hero-copy" data-reveal>
          <span className="eyebrow"><i /> SMART BUMBLEBEE HIVE</span>
          <h1>벌통의 온도,<br /><em>농가가 직접 정하다.</em></h1>
          <p>목표 온도는 농가가 정하고,<br />벌통은 그 설정에 맞춰 작동합니다.<br />현장의 변화는 앱에 기록됩니다.</p>
          <div className="hero-actions"><Link className="button-orange glow-cta" href="/products">아워비 제품 둘러보기 <ArrowRight size={21} /></Link></div>
        </div>
        <div className="hero-product" data-reveal>
          <div className="hero-image"><Image src="/images/product/hero-greenhouse.png" alt="딸기 온실에 놓인 올리브색 아워비 스마트벌통" fill priority sizes="(max-width: 850px) 100vw, 56vw" /></div>
        </div>
        <a className="scroll-cue" href="#ecosystem">SCROLL TO EXPLORE <ArrowDown size={14} /></a>
      </section>

      <section className="ecosystem-section" id="ecosystem">
        <div className="section-wrap">
          <div className="ecosystem-heading" data-reveal>
            <div><span className="eyebrow">OURBEE ECOSYSTEM</span><h2>벌통부터 앱까지,<br /><em>하나의 흐름으로.</em></h2></div>
            <p>스마트벌통, 모바일 앱, 스마트개폐기를 연결해<br />온도와 출입의 기록을 한 화면에서 봅니다.</p>
          </div>
          <div className="ecosystem-track">
            <Link className="ecosystem-item" href="/products/smart-hive" data-reveal>
              <div className="ecosystem-media ecosystem-hive"><Image src="/images/product/hive-studio.png" alt="아워비 스마트벌통 제품 이미지" fill sizes="(max-width: 760px) 80vw, 390px" /></div>
              <div className="ecosystem-node"><span>01</span></div>
              <h3>스마트벌통 정온제어</h3><p>농가가 정한 목표 온도를 따라 벌통 안의 환경을 관리합니다.</p>
            </Link>
            <Link className="ecosystem-item" href="/app" data-reveal>
              <div className="ecosystem-media ecosystem-app"><div className="ecosystem-phone"><Image src="/images/product/app-control.png" alt="목표 온도와 벌통 안팎의 온습도를 보여주는 아워비 앱" fill sizes="(max-width: 760px) 60vw, 250px" /></div></div>
              <div className="ecosystem-node"><span>02</span></div>
              <h3>아워비 모바일 앱</h3><p>내외부 온습도, 시간별 기록, 목표 온도와 출입 데이터를 확인합니다.</p>
            </Link>
            <Link className="ecosystem-item" href="/products/gate" data-reveal>
              <div className="ecosystem-media ecosystem-gate"><Image src="/images/product/gate-studio.png" alt="아워비 스마트개폐기 제품 이미지" fill sizes="(max-width: 760px) 80vw, 310px" /></div>
              <div className="ecosystem-node"><span>03</span></div>
              <h3>스마트개폐기 출입 관리</h3><p>출입구를 즉시 또는 예약 시간에 관리하고 출입량을 기록합니다.</p>
            </Link>
          </div>
          <Link className="ecosystem-more" href="/app">앱과 데이터 자세히 보기 <ArrowUpRight size={18} /></Link>
        </div>
      </section>

      <section className="pain-section" id="farm-story">
        <div className="section-wrap">
          <div className="pain-intro" data-reveal><span className="eyebrow eyebrow-light">WE KNOW THE FIELD</span><h2>농가에서 정말 번거로운 것들.</h2><p>벌통을 보러 가는 일이 아니라, 옮기고 다시 사고 온도를 걱정하는 일.</p></div>
          <div className="pain-list">
            <article data-reveal><span>01</span><h3>농약 칠 때마다<br />벌통을 옮기는 수고.</h3><p>출입구 관리를 더 편하게.</p></article>
            <article data-reveal><span>02</span><h3>짧아지는 여름 사용기간,<br />반복되는 벌 구매.</h3><p>벌이 머무는 온도를 더 세심하게.</p></article>
            <article data-reveal><span>03</span><h3>날씨가 흔들리면<br />걱정되는 벌의 활동.</h3><p>환경과 활동의 변화를 기록으로.</p></article>
          </div>
        </div>
      </section>

      <section className="shop-section" id="products">
        <div className="section-wrap">
          <div className="shop-heading" data-reveal><div><span className="eyebrow">OUR PRODUCTS</span><h2>농가의 하루에 맞춘<br />아워비의 제품.</h2></div><Link className="button-text" href="/products">모든 제품 보기 <ArrowUpRight size={18} /></Link></div>
          <div className="shop-grid"><ProductCard slug="smart-hive" /><ProductCard slug="gate" index={1} /></div>
          <p className="shop-note">제품별 구성과 가격은 상세페이지에서 문의할 수 있습니다.</p>
        </div>
      </section>

      <section className="heritage-preview" id="heritage">
        <div className="heritage-photo"><Image src="/images/strawberry-greenhouse.png" alt="딸기꽃이 피어 있는 시설하우스" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
        <div className="heritage-copy" data-reveal><span className="eyebrow eyebrow-light">OUR HERITAGE</span><h2>농가의 불편에서 시작해,<br /><em>현장으로 걸어온 아워비.</em></h2><p>수정벌을 한 철의 소모품으로만 보지 않고, 벌이 머무는 환경과 농가의 작업을 함께 살폈습니다.</p><div className="heritage-stats"><div><strong>2025</strong><span>현장의 문제에서 출발</span></div><div><strong>1<span>건</span></strong><span>특허 출원</span></div><div><strong>2<span>종</span></strong><span>스마트벌통·개폐기</span></div></div><Link className="button-outline-light" href="/about">수상과 발자취 보기 <ArrowUpRight size={18} /></Link></div>
      </section>

      <section className="faq-section section-wrap" id="faq"><div className="faq-heading" data-reveal><span className="pill-label">FAQ</span><h2>농가에서 많이 묻는 질문.</h2></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question} data-reveal><summary>{question}<span>⌄</span></summary><p>{answer}</p></details>)}</div></section>
      <section className="last-cta section-wrap"><div data-reveal><span className="eyebrow eyebrow-light">START WITH OURBEE</span><h2>우리 농장에도<br />맞을까요?</h2><p>작물, 벌통 수량과 설치 환경을 알려주세요.</p><Link className="button-orange glow-cta" href="/contact">도입 문의하기 <ArrowUpRight size={19} /></Link></div></section>
    </main>
  );
}
