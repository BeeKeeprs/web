import type { Metadata } from "next";
import Image from "next/image";
import AboutStats from "../_components/AboutStats";
import HomeSnap from "../_components/HomeSnap";

export const metadata: Metadata = { title: "아워비 이야기 | OurBee", description: "농가의 현실에서 시작한 아워비의 이야기와 2025~2026년 발자취를 소개합니다." };

// Each month lists its items as single lines: [headline, optional result].
const milestones: [string, [string, string?][]][] = [
  ["2025.08", [["농림축산식품 공공데이터 창업경진대회", "농어촌공사장상"]]],
  ["2025.11", [["대구경북 AI 창업경진대회", "최우수상"]]],
  ["2025.12", [["멋쟁이사자처럼 창업대회", "특별상"]]],
  ["2026.01", [["부울경 창업대회", "3위"]]],
  ["2026.02", [["교내 시제품 제작 최우수 팀 선정"], ["대구농업기술센터 테스트 진행"]]],
  ["2026.04", [["신한스퀘어브릿지 ESG", "선정"]]],
  ["2026.05", [["크립톤 × 경남 로컬창업 사업비 확보"]]],
  ["2026.06", [["NH애그테크 청년창업캠퍼스"]]],
  ["2026.08", [["공공데이터 창업경진대회", "농정원장상"], ["특허 출원 1건"]]],
  ["2026.09", [["밀양 스마트팜밸리 농가 실증 진행"], ["기술이전 2건 추진"], ["경북창경 G-STAR 피칭", "2위"]]],
];

// Agency awards stand out in green.
const accentResults = ["농어촌공사장상", "농정원장상"];

const years = Object.entries(milestones.reduce<Record<string, typeof milestones>>((groups, item) => {
  (groups[item[0].slice(0, 4)] ??= []).push(item);
  return groups;
}, {})).sort(([a], [b]) => Number(a) - Number(b));

export default function AboutPage() {
  return <main className="subpage about-page">
    <HomeSnap />
    <section className="about-hero section-wrap"><div data-reveal><span className="eyebrow">OUR HERITAGE</span><h1>벌과 농가의 내일을<br /><em>연결합니다.</em></h1><p>수정벌은 관리와 기록 없이 일회용으로 소모됩니다.<br />아워비는 벌통 환경과 농가의 경험을 데이터로 쌓아, 농가 수익 증대까지 이어갑니다.</p></div><div className="about-hero-visual" data-reveal><div className="about-hero-image"><Image src="/images/strawberry-greenhouse.png" alt="딸기꽃이 피어 있는 시설하우스" fill priority sizes="(max-width: 760px) 100vw, 50vw" /></div><AboutStats /></div></section>
    <section className="timeline-section section-wrap" data-snap-stop><div className="timeline-intro" data-reveal><span className="eyebrow">OUR JOURNEY</span><h2>한 걸음씩,<br />현장으로.</h2><p>2026년 10월 아워비 브랜드 소개서에 기록된 발자취입니다.</p></div><div className="timeline">{years.map(([year, items]) => <div className="timeline-year" key={year} data-reveal><div className="timeline-year-label"><strong>{year}</strong><span>{items.length}건</span></div><div className="timeline-year-rows">{items.map(([date, lines]) => <div className="timeline-row" key={date}><time>{date.slice(5)}월</time><ul>{lines.map(([headline, result]) => <li key={headline}><strong>{headline}</strong>{result && <span className={accentResults.includes(result) ? "is-accent" : undefined}>{result}</span>}</li>)}</ul></div>)}</div></div>)}</div></section>
  </main>;
}
