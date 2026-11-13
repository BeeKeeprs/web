"use client";

import { useEffect, useRef, useState } from "react";
import { runFrameDemo } from "./frameDemos";

type Feature = {
  key: string;
  title: string;
  kicker: string;
  route: string;
  facts: string[];
};

// Each screen is the real app (web build, dummy data) running inside the phone frame.
const features: Feature[] = [
  {
    key: "hive", title: "벌통 제어", kicker: "스마트벌통", route: "/hive-control",
    facts: ["10초 단위로 수신하는 실시간 센서값", "목표 온도 16~36°C, 0.5°C 단위 설정", "오늘의 요약으로 온도, 벌 활동량 체크", "일간·주간·월간 리포트로 환경 및 개선사항 확인"],
  },
  {
    key: "gate", title: "개폐기 제어", kicker: "스마트개폐기", route: "/iot-home",
    facts: ["오프라인(NFC)·온라인 2가지 모드", "기본 카드 6종: ON, OFF, 농약방제(닫고 72시간 뒤 열기), 개화 3단계별 카드", "시간·벌 마릿수 기준 카드 직접 추가"],
  },
  {
    key: "chat", title: "AI 상담", kicker: "AI", route: "/bee-chat",
    facts: ["작업 중 질문을 입력하면 AI가 답변", "수정벌 정량·정성 데이터와 전문가 암묵지 학습"],
  },
  {
    key: "recommend", title: "수정벌 추천", kicker: "영농 정보", route: "/recommend",
    facts: ["작물별 가이드: 투입 시기, 방사량, 설치 방법을 단계별로 안내", "농지 기반 AI 추천: 작물 11종, 시설재배·노지, 지역, 면적, 정식일 입력"],
  },
  {
    key: "pesticide", title: "농약 찾기", kicker: "영농 정보", route: "/pesticide",
    facts: ["작물·용도·곤충 3개 필터 조합 검색", "상표명·병해충명으로 직접 검색"],
  },
  {
    key: "price", title: "시세", kicker: "영농 정보", route: "/fruit-price",
    facts: ["도매시장을 골라 최근 7일 이내 날짜별 조회", "최신순·최고가·최저가·거래량 정렬", "자주 보는 시장·작물을 내 맞춤 시세로 등록, 딸기·사과·배·포도·토마토 빠른 검색"],
  },
  {
    key: "profit", title: "수익 판단", kicker: "농장 리포트", route: "/report",
    facts: ["농장 크기·위치·생육단계·최근 7일 온습도·출하 흐름을 범위로 입력", "같은 생육단계 농가와 비교해 개선할 환경 확인", "생육단계별 환경 개선 항목, 예상 추가 수확량, 이번 주 실행안 제시", "스마트팜 혁신밸리 데이터 513,545건 학습, 5개 농가 실측 데이터 42,466건으로 5단계 비교 가이드 제시"],
  },
];

const headings = {
  device: ["온도 하나에서,", "환경·출입·관리 이력으로."],
  software: ["H/W 없이도 가능한", "수정벌 관리."],
};

const APP_BUILD = "20261025b"; // bump when public/app-demo is rebuilt so browsers drop the cached app
const DEVICE_W = 300; // width of the frame image's transparent screen opening (79% of a 380px phone)
const SCREEN_H = 620; // opening height (650px of a 698px phone) minus the 30px status strip
const APP_W = 335; // the app is laid out narrower than a phone so its text reads larger
const WIDE_APP_W = 395; // 수익 판단 keeps a roomier layout

function hideFrameScrollbar(frame: HTMLIFrameElement) {
  try {
    const doc = frame.contentDocument;
    if (!doc || doc.getElementById("app-demo-scrollbar-style")) return;
    const style = doc.createElement("style");
    style.id = "app-demo-scrollbar-style";
    style.textContent = "html, body, * { scrollbar-width: none !important; } html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar { display: none !important; width: 0 !important; }";
    doc.head.appendChild(style);
  } catch {}
}

function watchScroll(frame: HTMLIFrameElement, onScroll: () => void) {
  try {
    const win = frame.contentWindow;
    win?.addEventListener("scroll", onScroll, { capture: true, once: true });
    win?.addEventListener("wheel", onScroll, { once: true });
    win?.addEventListener("touchmove", onScroll, { once: true });
  } catch {}
}

// In the web build the chat avatar picture (1024px) ignores its 42px box and floods the screen; pin it to its box (same-origin iframe).
function pinChatAvatar(frame: HTMLIFrameElement, route: string) {
  if (route !== "/bee-chat") return;
  try {
    const doc = frame.contentDocument;
    if (!doc?.body) return;
    const fix = () => doc.querySelectorAll("img").forEach((img) => {
      if (img.naturalWidth < 900 && img.getBoundingClientRect().width < 900) return;
      const box = img.parentElement;
      if (box) { box.style.width = "100%"; box.style.height = "100%"; }
      img.style.width = "100%"; img.style.height = "100%"; img.style.objectFit = "contain";
    });
    new MutationObserver(fix).observe(doc.body, { childList: true, subtree: true });
    doc.addEventListener("load", fix, true);
    const timer = window.setInterval(fix, 400);
    window.setTimeout(() => window.clearInterval(timer), 8000);
    fix();
  } catch {}
}

export default function AppShowcase() {
  const [active, setActive] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false); // hides the scroll hint once the visitor scrolls the app
  const [shown, setShown] = useState(0); // the phone keeps its last screen when every item is closed
  const [armed, setArmed] = useState(false);
  const [inView, setInView] = useState(false);
  const [touched, setTouched] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [frameLoads, setFrameLoads] = useState(0); // bumps on every iframe load so effects can wait for the app
  const current = features[shown];
  useEffect(() => { setScrolled(false); }, [shown]);

  // On a phone the list sits below the device, so a tap scrolls the device back into view.
  const revealPhone = () => {
    if (!window.matchMedia("(max-width:760px)").matches) return;
    const device = root.current?.querySelector(".aps-device");
    if (!device) return;
    const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
    const { top, bottom } = device.getBoundingClientRect();
    if (top >= headerHeight && bottom <= window.innerHeight) return;
    // Instant writes per frame keep the page's CSS smooth-scroll from fighting the glide.
    const from = window.scrollY;
    const distance = top - headerHeight - 12;
    const started = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - started) / 520);
      window.scrollTo({ top: from + distance * (1 - Math.pow(1 - progress, 3)), behavior: "instant" });
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const headingKey = current.key === "hive" || current.key === "gate" ? "device" : "software";
  const appW = current?.key === "profit" ? WIDE_APP_W : APP_W;
  const appH = Math.round(SCREEN_H * appW / DEVICE_W);

  // While the phone is on screen the hive and gate screens play themselves; see frameDemos.ts.
  const demoName = current.key === "hive" || current.key === "gate" ? current.key : null;
  useEffect(() => {
    const frame = frameRef.current;
    if (!inView || !demoName || !frame || !frameLoads) return;
    return runFrameDemo(frame, demoName, () => setScrolled(true));
  }, [inView, demoName, frameLoads]);

  // The app bundle is large, so it loads only once this block approaches the screen.
  useEffect(() => {
    const node = root.current;
    if (!node || typeof IntersectionObserver === "undefined") { setArmed(true); return; }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { setArmed(true); observer.disconnect(); }
    }, { rootMargin: "600px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = root.current;
    if (!node || typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) { setActive(0); setShown(0); }
    }, { threshold: 0.45 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`aps is-open${inView ? " is-in-view" : ""}`} ref={root}>
      <div className="aps-device">
        <div className="aps-screen" style={{ ["--aps-scale" as string]: DEVICE_W / appW }}>
          <div className="aps-status" aria-hidden="true">
            <b>9:41</b>
            <span>
              <svg width="17" height="11" viewBox="0 0 17 11" fill="#111"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>
              <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round"><path d="M1.5 4.2a9.5 9.5 0 0 1 13 0" /><path d="M4 6.8a6 6 0 0 1 8 0" /><circle cx="8" cy="9.4" r="1" fill="#111" stroke="none" /></svg>
              <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#111" opacity=".4" /><rect x="2" y="2" width="18" height="8" rx="2.2" fill="#111" /><rect x="22.5" y="4" width="2" height="4" rx="1" fill="#111" opacity=".4" /></svg>
            </span>
          </div>
          {(armed || touched) && (
            <iframe
              ref={frameRef}
              key={current.key}
              className="aps-frame"
              src={`/app-demo${current.route}?v=${APP_BUILD}`}
              title={`${current.title} 앱 화면`}
              width={appW}
              height={appH}
              onLoad={(event) => { setFrameLoads((count) => count + 1); hideFrameScrollbar(event.currentTarget); watchScroll(event.currentTarget, () => setScrolled(true)); pinChatAvatar(event.currentTarget, current.route); }}
            />
          )}
          {current.key !== "profit" && (
            <div className={`aps-hint${scrolled ? " is-gone" : ""}`} aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3.5 5 6.5 8 3.5" /></svg>
              화면을 스크롤해 보세요
            </div>
          )}
        </div>
        <img className="aps-phone-frame" src="/images/phone-frame-9x18.png" alt="" aria-hidden="true" />
      </div>

      <div className="aps-side">
      <div className="aps-head">
        <h2 key={headingKey}>
          {headings[headingKey].map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
        </h2>
      </div>
      <div className="aps-list" role="tablist" aria-label="앱 기능">
        {features.map((feature, index) => {
          const open = index === active;
          return (
            <div key={feature.key} className={`aps-item${open ? " is-open" : ""}`}>
              <button type="button" role="tab" id={`aps-tab-${feature.key}`} aria-selected={open} aria-controls={`aps-panel-${feature.key}`} onClick={() => { setTouched(true); setActive(open ? null : index); if (!open) { setShown(index); revealPhone(); } }}>
                <span className="aps-num">{String(index + 1).padStart(2, "0")}</span>
                <span className="aps-name">{feature.title}</span>
                <span className="aps-kicker">{feature.kicker}</span>
              </button>
              <div className="aps-panel" aria-hidden={!open} inert={!open}>
                <ul role="tabpanel" id={`aps-panel-${feature.key}`} aria-labelledby={`aps-tab-${feature.key}`}>
                  {feature.facts.map(fact => <li key={fact}>{fact}</li>)}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}




