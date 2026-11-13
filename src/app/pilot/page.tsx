import type { Metadata } from "next";
import Image from "next/image";
import HomeSnap from "../_components/HomeSnap";
import AppShowcase from "../_components/AppShowcase";
import PilotForm from "./PilotForm";
import PilotMotion from "./PilotMotion";
import RowList from "../_components/RowList";
import "./pilot.css";

export const metadata: Metadata = {
  title: "100일 실증농가 모집 | 아워비",
  description: "수정벌을 사용하는 시설재배 농가를 찾습니다. 아워비 스마트벌통을 100일간 무상으로 사용하고 겨울철 현장 경험을 함께 기록해 주세요.",
  openGraph: { images: ["/images/product/hero-greenhouse.png"] },
};

const guide = [
  { title: "참여 대상", body: "밀양 등 수정벌을 사용하는 시설재배 농가. 딸기 농가를 우선 살펴보며, 다른 작물도 문의할 수 있습니다." },
  { title: "제공 범위", body: "스마트벌통 100일 무상 사용과 설치·사용 안내. 장비 구성과 설치 방식은 현장 확인 후 협의합니다." },
  { title: "함께할 일", body: "평소처럼 농장을 관리하며 사용 경험과 불편을 공유해 주세요. 기록 항목과 방문 일정은 함께 정합니다." },
  { title: "신청 과정", body: "참여 문의 → 농장 확인 → 조건 협의 → 설치·사용 → 결과 정리" },
  { title: "종료 후", body: "장비 회수 또는 사용 연장 등 종료 조건은 참여 확정 전에 안내하고 협의합니다." },
];

export default function PilotPage() {
  return (
    <main className="pilot-page">
      <HomeSnap />
      <PilotMotion />

      <section className="pl-hero">
        <div className="pl-hero-copy" data-pilot-reveal>
          <span className="pl-tag">수정벌 사용 농가와 함께하는 겨울 현장 실험</span>
          <h1>이번 겨울,<br /><em>벌통을 함께</em><br />살펴볼 농가를<br />찾습니다.</h1>
          <p>수정벌을 쓰는 시설재배 농가에서 아워비 스마트벌통을 100일간 무상으로 사용해 보실 분을 모집합니다.</p>
        </div>
        <div className="pl-hero-photo">
          <Image src="/images/product/hero-greenhouse.png" alt="딸기 시설하우스에 놓인 아워비 스마트벌통" fill priority sizes="(max-width: 900px) 100vw, 50vw" />
          <div className="pl-day-badge" aria-label="스마트벌통 100일 무상 사용">
            <strong>100<small>일</small></strong>
            <span>스마트벌통<br />무상 사용</span>
          </div>
        </div>
      </section>
      <div className="pl-hero-strip" aria-label="실증 참여 안내">
        <span>수정벌 사용 시설재배 농가</span><i aria-hidden="true">·</i>
        <span>스마트벌통 100일 무상 사용</span><i aria-hidden="true">·</i>
        <span>현장 경험을 함께 기록</span>
      </div>

      <section className="pl-section pl-study" id="study">
        <div className="pl-wrap">
          <header className="pl-head" data-pilot-reveal>
            <h2>벌값은 줄고, 딸기 매출은 느는지<br />100일 동안 숫자로 확인합니다.</h2>
          </header>
          <div className="pl-metrics" data-pilot-reveal data-snap-stop data-snap-align="start" data-snap-gap="32">
            <div className="pl-numbers">
              <article><span>벌 사용 기간</span><strong>+68<small>일</small></strong><p>한 번 산 벌을 더 오래</p></article>
              <article><span>벌 활동량</span><strong>+20<small>%</small></strong><p>같은 조건, 더 활발한 수분</p></article>
              <article><span>농가 손익</span><strong className="is-pair"><em>비용 ↓</em><em>매출 ↑</em></strong><p>벌 구매·교체비와 상품 딸기 판매액</p></article>
            </div>
            <p className="pl-note">+68일·+20%는 이번 실증의 검증 목표이며, 아직 입증된 성과가 아닙니다.</p>
          </div>
        </div>
      </section>

      <section className="app-showcase-section" id="app">
        <div className="section-wrap">
          <AppShowcase />
        </div>
      </section>

      <section className="pl-section pl-roles" data-snap-stop data-snap-align="end">
        <div className="pl-wrap">
          <div data-pilot-reveal>
            <div className="pl-role-grid">
              <article>
                <span>농가가 할 일</span>
                <h4>평소처럼 관리하고,<br />사용 경험을 알려주세요.</h4>
                <p>아래 항목을 가능한 만큼 공유하고, 사용 중 불편했던 점을 알려주세요.</p>
                <p>기록 항목과 공유 방법은 농장 상황에 맞춰 정합니다.</p>
                <ul aria-label="농가가 확인할 항목"><li>벌 구입 수량</li><li>교체일</li><li>상품 수확량</li><li>판매액</li></ul>
              </article>
              <article className="is-ourbee">
                <span>아워비가 할 일</span>
                <h4>설치부터 기록·점검까지<br />아워비가 함께합니다.</h4>
                <p>설치와 사용법을 안내하고, 아래 항목을 기록하며 기기 상태를 살펴봅니다.</p>
                <p>기기 불편을 점검하고, 100일 후 달라진 점을 함께 정리합니다.</p>
                <ul aria-label="아워비가 확인할 항목"><li>하우스·벌통 온습도</li><li>작동 상태</li><li>벌 출입량 <small>개폐기 연동 시</small></li></ul>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="pl-section pl-guide" id="guide" data-snap-stop aria-labelledby="pilot-guide-title">
        <div className="pl-wrap pl-guide-inner">
          <header data-pilot-reveal>
            <span className="pl-tag">참여 안내</span>
            <h2 id="pilot-guide-title">우리 농장도<br />참여할 수 있을까요?</h2>
          </header>
          <div data-pilot-reveal>
            <RowList variant="term" label="참여 안내" items={guide} />
          </div>
        </div>
      </section>

      <section className="pl-section pl-apply" id="apply" data-snap-stop>
        <div className="pl-wrap pl-apply-inner">
          <div className="pl-apply-copy" data-pilot-reveal>
            <h2>이번 겨울,<br />우리 농장에서<br />함께 확인해요.</h2>
            <p>농장 위치, 재배 작물, 수정벌 사용 현황을 알려주세요. 참여 가능 여부와 구체적인 조건을 안내드리겠습니다.</p>
          </div>
          <div data-pilot-reveal><PilotForm /></div>
        </div>
      </section>
    </main>
  );
}
