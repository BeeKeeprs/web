import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = { title: "아워비 이야기 | OurBee", description: "농가의 현실에서 시작한 아워비의 이야기와 2025~2026년 발자취를 소개합니다." };

const milestones = [
  ["2025.08", "농림축산식품 공공데이터 창업경진대회", "농어촌공사장상"],
  ["2025.11", "교내 시제품 지원사업 선정", "AI 창업경진대회 최우수상"],
  ["2025.12", "멋쟁이사자처럼 창업대회", "루트임팩트 특별상"],
  ["2026.01", "부울경 창업대회", "현대해상·인액터스 3위"],
  ["2026.02", "교내 시제품 제작 최우수 팀 선정", "기술지주 자회사 편입·투자확약서 작성"],
  ["2026.04", "신한스퀘어브릿지 ESG", "선정"],
  ["2026.05", "크립톤 × 경남 로컬창업 사업비 확보", "예비창업패키지 서류 합격"],
  ["2026.06", "모두의 창업·대구TP·NH애그테크 참여", "사무실 입주 · G-Star 피칭 2위"],
  ["2026.08", "공공데이터 창업경진대회", "농정원장상 · 특허 출원 1건"],
  ["2026.09", "밀양 스마트팜밸리 농가 실증 진행", "기술이전 2건 추진"],
];

export default function AboutPage() {
  return <main className="subpage about-page">
    <section className="about-hero section-wrap"><div data-reveal><span className="eyebrow">OUR HERITAGE</span><h1>벌과 농가의 내일을<br /><em>연결합니다.</em></h1><p>한 철 쓰고 버리던 벌통을, 농번기에 맞춰 관리하는 자산으로. 농가가 느끼는 부담에서 아워비의 기술이 시작됐습니다.</p></div><div className="about-hero-image" data-reveal><Image src="/images/strawberry-greenhouse.png" alt="딸기꽃이 피어 있는 시설하우스" fill priority sizes="(max-width: 760px) 100vw, 50vw" /></div></section>
    <section className="about-manifesto"><div className="section-wrap" data-reveal><span className="eyebrow eyebrow-light">WHY WE STARTED</span><h2>벌이 살아가는 환경을 돌보고,<br />농가의 경험을 <em>데이터로 잇는 것.</em></h2><p>수정벌이 충분한 관리와 기록 없이 소모되는 현실을 보았습니다. 온실의 계절에 맞춰 벌통 환경을 살피고, 필요한 순간에 농가가 직접 선택할 수 있도록 스마트벌통·개폐기·앱을 하나의 경험으로 연결합니다.</p></div></section>
    <section className="about-numbers section-wrap" data-reveal><div><strong>2025</strong><span>농가 문제에서 출발</span></div><div><strong>1<span>건</span></strong><span>특허 출원</span></div><div><strong>2<span>종</span></strong><span>스마트벌통·개폐기</span></div></section>
    <section className="timeline-section section-wrap"><div className="timeline-intro" data-reveal><span className="eyebrow">OUR JOURNEY</span><h2>한 걸음씩,<br />현장으로.</h2><p>2026년 10월 아워비 브랜드 소개서에 기록된 발자취입니다.</p></div><div className="timeline">{milestones.map(([date, title, result]) => <div className="timeline-row" key={date} data-reveal><time>{date}</time><div><strong>{title}</strong><p>{result}</p></div><span className="timeline-dot" /></div>)}</div></section>
    <section className="about-products section-wrap" data-reveal><div><span className="eyebrow">WHAT WE MAKE</span><h2>현장의 벌통과<br />손안의 관리를 잇습니다.</h2><p>내부 온습도 확인과 목표 온도 설정, 출입구 관리까지. 한 농가의 하루를 기준으로 제품을 만듭니다.</p><Link className="button-orange" href="/products">제품 살펴보기 <ArrowUpRight size={18} /></Link></div><div className="about-product-image"><Image src="/images/product/controller.png" alt="아워비 스마트벌통" fill sizes="(max-width: 760px) 100vw, 50vw" /></div></section>
  </main>;
}
