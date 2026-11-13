import Link from "next/link";
import { ArrowDown, ArrowRight, Flower2, Snowflake, Sun } from "lucide-react";
import AirRipple from "./_components/AirRipple";
import HomeSnap from "./_components/HomeSnap";
import AppShowcase from "./_components/AppShowcase";
import ProductCard from "./_components/ProductCard";
import RowList from "./_components/RowList";
import CtaBanner from "./_components/CtaBanner";
import ProductMotion from "./_components/ProductMotion";

// Figures follow the pilot plan (to be verified in the PoC).
const seasons = [
  {
    key: "mild", name: "봄 · 가을", Icon: Flower2, crops: "",
    line: "일교차에도 한결같은 벌통 온도. 농약 치는 날엔, 앱에서 출입구를 닫으면 끝.",
    stats: [["24시간 정온제어", "반도체 통한 설정온도 유지 및 AI관리"], ["출입문 제어", "벌 마릿수 · 시간 · 과수분 · 미수분 제어"]],
  },
  {
    key: "summer", name: "여름", Icon: Sun, crops: "멜론 · 토마토 · 참외",
    line: "무더위 속 벌 사용일 2주. 시원한 벌통으로 45일까지.",
    stats: [["2주 → 45일", "벌 사용 기간"], ["65만 → 약 10만 원", "벌 구매비 · 150평 3개월 기준"]],
  },
  {
    key: "winter", name: "겨울", Icon: Snowflake, crops: "딸기", badge: "100일 무료 체험",
    line: "추위에 줄어드는 벌 활동. 따뜻한 벌통으로 더 오래, 더 활발하게.",
    stats: [["+68일", "벌 사용 기간"], ["+20%", "벌 활동량"]],
  },
];

const faqs = [
  ["벌통 온도는 직접 정할 수 있나요?", "네. 앱에서 목표 온도를 직접 설정하고, 벌통 안팎의 온도와 습도를 확인할 수 있습니다."],
  ["농약을 칠 때 벌통을 옮기지 않아도 되나요?", "스마트개폐기로 출입구를 관리할 수 있습니다. 농약 살포 시 필요한 이동·안전 조치는 살포 조건에 따라 달라지므로 문의 부탁드립니다."],
  ["벌 구입비는 얼마나 아낄 수 있나요?", "벌 사용 기간과 교체 횟수, 봉군 구입 단가에 따라 달라집니다. 겨울·여름 실증에서 실제 구매비 변화를 확인할 계획입니다."],
  ["AI가 벌통을 알아서 조작하나요?", "온도와 개폐기는 정해둔 기준에 따라 작동합니다. AI는 기록의 이상과 변화를 분석해 알림과 리포트로 보여드립니다."],
  ["우리 농장에도 설치할 수 있나요? 가격은요?", "벌통 형태, 수량, 설치 환경에 맞춰 안내합니다. 제품 가격과 설치 가능 여부는 문의하기로 상담해 주세요."],
];

export default function HomePage() {
  const revealLetters = (text: string, offset = 0) => Array.from(text).map((letter, index) => (
    <span className="hero-title-char" aria-hidden="true" key={`${offset}-${index}`} style={{ animationDelay: `${(offset + index) * 45}ms` }}>
      {letter === " " ? "\u00a0" : letter}
    </span>
  ));

  return (
    <main className="home">
      <HomeSnap />
      <section className="hero hero-story" id="top">
        <div className="hero-story-track" data-scroll-story>
          <div className="hero-story-stage">
            <AirRipple />
            <div className="hero-story-shade" aria-hidden="true" />
            <ProductMotion />
            <div className="hero-story-text">
              <h1 className="hero-story-title" data-scroll-text aria-label="반도체 AIoT 수정벌 관리 시스템, 농사의 결실을 더 크게.">
                <span className="hero-story-line">{revealLetters("반도체 AIoT")}</span>
                <span className="hero-story-line">{revealLetters("수정벌 관리 시스템,", 8)}</span>
                <span className="hero-story-line hero-story-line-accent"><em>{revealLetters("농사의 결실을 더 크게.", 19)}</em></span>
              </h1>
              <div className="hero-story-copy">
                <p>스마트벌통은 설정 온도를 유지하고,<br />스마트개폐기는 벌의 출입을 기록합니다.<br />현장 기록을 자동으로 모아 비용과 수확의 변화를 살펴봅니다.</p>
                <Link className="ob-btn hero-story-products-link" href="/products">아워비 제품 둘러보기 <ArrowRight size={18} /></Link>
              </div>
            </div>
            <div className="hero-story-bottom">
              <a className="hero-story-scroll" href="#ecosystem">아워비 기술 보기 <ArrowDown size={16} /></a>
              <section className="home-pilot-banner section-wrap" aria-label="100일 실증농가 모집">
                <div><span>100일 무상 사용 · 실증농가 모집</span><h2>수정벌 사용 농가를 찾습니다.</h2><p>스마트벌통을 직접 써보고, 농장의 변화를 함께 확인해요.</p></div>
                <Link className="ob-btn" href="/pilot">실증 참여 알아보기 <ArrowRight size={18} /></Link>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="ecosystem-section" id="ecosystem" data-snap-stop>
        <div className="section-wrap">
          <div className="ecosystem-heading" data-reveal>
            <div className="ecosystem-heading-main">
              <h2>수정벌 관리는 처음부터 끝까지, 아워비가.</h2>
            </div>
          </div>
          <div className="shop-grid">
            <ProductCard slug="smart-hive" index={0} describe />
            <ProductCard slug="gate" index={1} describe />
          </div>
        </div>
      </section>

      <section className="app-showcase-section" id="app" data-snap-stop>
        <div className="section-wrap">
          <AppShowcase />
        </div>
      </section>

      <section className="season-section" id="seasons" data-snap-stop>
        <div className="section-wrap">
          <div className="season-heading" data-reveal>
            <h2>벌 구매비는 줄이고 상품 수확은 늘려,<br />농가 수익을 더 크게 만듭니다.</h2>
            <p>벌통을 옮기고, 다시 사고, 온도를 걱정하는 일. 이제 그만.</p>
          </div>
          <div className="season-grid">
            {seasons.map(({ key, name, Icon, crops, badge, line, stats }) => (
              <article className={`season-card season-${key}`} key={key} data-reveal>
                {badge && <span className="season-badge"><i aria-hidden="true" />{badge}</span>}
                <div className="season-top"><div className="season-name"><Icon size={18} aria-hidden="true" />{name}</div>{crops && <span className="season-crops">{crops}</span>}</div>
                <p className="season-line">{line.split(/(?<=\.) /).map((sentence, index) => <span key={index}>{sentence}</span>)}</p>
                <dl>{stats.map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
                {badge && <Link className="season-cta season-cta-primary" href="/pilot">스마트벌통 100일 무료 체험 <ArrowRight size={18} aria-hidden="true" /></Link>}
              </article>
            ))}
          </div>
        </div>
      </section>



      <section className="faq-section section-wrap" id="faq"><div className="faq-heading" data-reveal><h2>농가에서 많이 묻는 질문.</h2></div><div data-reveal><RowList items={faqs.map(([question, answer]) => ({ title: question, body: answer }))} /></div></section>
      <CtaBanner title={<>우리 농장에도<br />맞을까요?</>} description="작물, 벌통 수량과 설치 환경을 알려주세요." href="/contact" label="도입 문의하기" />
    </main>
  );
}
