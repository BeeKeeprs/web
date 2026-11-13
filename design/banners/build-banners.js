// OurBee ad banners A / B / C as PNG: 1080x1080 and 1080x1920.
// Standalone art, not part of the website. Run from a folder that has puppeteer-core:
//   PUPPETEER_PATH=/path/to/node_modules/puppeteer-core node build-banners.js [A|B|C]
// Photos come from public/images (renders as placeholders until real field photos exist); app screens are drawn here as examples.
// Text stays inside the platform safe zones: 1:1 -> y 108..972; 9:16 -> y 288..1536.

const path = require("path");
const fs = require("fs");
const puppeteer = require(process.env.PUPPETEER_PATH || "puppeteer-core");

const ROOT = "D:/webeeweb";
const OUT = path.join(ROOT, "design/banners/out");
const FONT = "file:///" + ROOT + "/public/font/PretendardVariable.woff2";
const img = (name) => "file:///" + ROOT + "/public/images/" + name;

const C = { bg: "#22382F", deep: "#18281F", cream: "#F3F0E4", lime: "#D5DEB4", ink: "#1E2F27", mute: "#E4ECD8" };
const TAGLINE = "구매비 ↓ 수익 ↑ · AIoT 반도체 스마트벌통";
const LEGAL = "신청 후 설치 가능 여부를 확인합니다. 실증 진행 중, 효과는 농장·작물·계절에 따라 다릅니다";
const RECRUIT = "겨울 실증 · 수익 변화 기록을 함께할 농가를 찾습니다";

// ---------------------------------------------------------------------------------------------------------------------
const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const baseCss = (W, H) => `
@font-face{font-family:P;src:url("${FONT}") format("woff2");font-weight:100 900}
*{box-sizing:border-box;margin:0;padding:0;word-break:keep-all}
body{width:${W}px;height:${H}px;position:relative;overflow:hidden;font-family:P,sans-serif;color:#fff;-webkit-font-smoothing:antialiased;
  background:radial-gradient(900px 760px at 92% 4%,rgba(228,236,200,.42),transparent 62%),radial-gradient(800px 720px at -6% 102%,rgba(110,175,135,.40),transparent 60%),linear-gradient(160deg,#5B8470 0%,#3F6350 42%,#2C4739 100%)}
.grain{position:absolute;inset:0;background-image:${NOISE};opacity:.085;mix-blend-mode:overlay;pointer-events:none;z-index:50}
.abs{position:absolute}
.hair{position:absolute;inset:22px;border:1.5px solid rgba(213,222,180,.22);border-radius:34px;pointer-events:none;z-index:40}
.glass{background:linear-gradient(160deg,rgba(255,255,255,.20),rgba(255,255,255,.07));border:1.5px solid rgba(255,255,255,.28);backdrop-filter:blur(18px);box-shadow:0 24px 60px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.35);border-radius:28px}
.glass.dk{background:linear-gradient(160deg,rgba(28,45,37,.88),rgba(28,45,37,.76));border-color:rgba(213,222,180,.35)}
.pill{display:inline-flex;align-items:center;gap:12px;border-radius:999px;font-weight:800}
.eyebrow{font-size:27px;letter-spacing:.2px;color:${C.lime};padding:11px 24px 11px 20px;border:1.5px solid rgba(213,222,180,.5);background:rgba(213,222,180,.08)}
.eyebrow i{width:12px;height:12px;border-radius:50%;background:${C.lime};box-shadow:0 0 0 6px rgba(213,222,180,.18)}
.medal{position:absolute;border-radius:50%;background:radial-gradient(circle at 32% 26%,#E9F0CB,#D5DEB4 62%,#C3CE9C);color:#1E2F27;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;box-shadow:0 0 0 7px rgba(213,222,180,.30),0 22px 48px rgba(0,0,0,.45);z-index:20;transform:rotate(8deg)}.medal::after{content:"";position:absolute;inset:11px;border-radius:50%;border:2px solid rgba(30,47,39,.32)}.medal b{font-weight:800;letter-spacing:-2px;line-height:1}.medal span{font-weight:800;letter-spacing:-.5px;margin-top:6px}
.offer{background:${C.lime};color:${C.ink};font-size:36px;padding:16px 38px;box-shadow:0 0 0 6px rgba(213,222,180,.28),0 18px 40px rgba(0,0,0,.4)}
.h1{font-weight:800;letter-spacing:-2.4px;line-height:1.12;text-shadow:0 4px 30px rgba(0,0,0,.25)}
.h1 em{font-style:normal;color:${C.lime}}
.sub{font-weight:600;color:${C.mute};letter-spacing:-.6px;line-height:1.38;text-shadow:0 2px 14px rgba(20,36,28,.5)}
.cta{display:flex;align-items:center;justify-content:space-between;background:${C.lime};color:${C.ink};font-weight:800;border-radius:26px;box-shadow:0 18px 44px rgba(0,0,0,.42),0 0 0 6px rgba(213,222,180,.16)}
.cta svg{flex:none}
.logo{font-weight:800;letter-spacing:-1px}
.tag{font-weight:700;color:${C.lime};letter-spacing:-.4px}
.legal{color:${C.mute};opacity:.95;line-height:1.35;text-shadow:0 1px 8px rgba(20,36,28,.55)}
.chain{display:flex;align-items:center;gap:10px}
.chain span{font-weight:800;color:${C.cream};border:1.5px solid rgba(243,240,228,.45);border-radius:999px;background:rgba(255,255,255,.07)}
.chain b{color:${C.lime};font-weight:700}
`;

const arrowSvg = (s = 34) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

// ---- the app drawn as an example (390 wide design) ---------------------------------------------------------------------
const gaugeCard = () => `
  <div class="card">
    <div class="ct"><b>토마토 1호</b><span><i></i>실시간 · 방금</span></div>
    <svg viewBox="0 0 240 150" class="gz">
      <circle cx="120" cy="104" r="78" fill="none" stroke="#E3E7E8" stroke-width="15" stroke-linecap="round" pathLength="100" stroke-dasharray="72 28" transform="rotate(144 120 104)"/>
      <circle cx="120" cy="104" r="78" fill="none" stroke="#8FBCA4" stroke-width="15" stroke-linecap="round" pathLength="100" stroke-dasharray="26 74" transform="rotate(144 120 104)"/>
      <circle cx="68" cy="52" r="9" fill="#fff" stroke="#16813F" stroke-width="5"/>
    </svg>
    <div class="gl">내부 온도</div><div class="gv">24.1<small>°C</small></div><div class="gt">목표 27.0°C</div>
    <div class="gp">수정벌이 활동하기 좋은 온도예요</div>
  </div>`;

const controlCard = () => `
  <div class="card ctl">
    <div class="ct"><b>목표 온도</b><span>지금 설정 26.5°C</span></div>
    <div class="st"><div class="c"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#24352D" stroke-width="2.6" stroke-linecap="round"><path d="M5 12h14"/></svg></div><div class="sv">27.0<small>°C</small></div><div class="c"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#24352D" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></div></div>
    <div class="sr">16~36°C · 권장 24~27°C</div>
    <div class="sa">27.0°C로 적용</div>
  </div>`;


const summaryCard = () => `
  <div class="card sumcard">
    <div class="ct"><b>오늘의 요약</b></div>
    <div class="sm-row"><div><div class="sm-t">권장 온도 유지</div><div class="sm-s">12시간 중 11시간 30분</div></div><div class="sm-v">96<small>%</small></div></div>
    <div class="sm-line"></div>
    <div class="sm-foot">벌 출입 <b>32회</b><i></i>전날보다 <em>↑ 24%</em></div>
  </div>`;

// Outside temperature is the orange curve, the inside temperature the dark line, the recommended band is green.
const reportCard = () => `
  <div class="card repcard">
    <div class="ct"><b>오늘의 벌통 리포트</b><span class="more">자세히 ›</span></div>
    <div class="legend"><span><u class="l-in"></u>내부</span><span><u class="l-out"></u>외부</span><span><u class="l-band"></u>권장 24~27°</span></div>
    <svg viewBox="0 0 340 130" class="chart">
      <rect x="0" y="22" width="340" height="22" fill="#E8F3EA"/>
      <g stroke="#E6E9EC" stroke-width="1.4"><path d="M0 12H340"/><path d="M0 62H340"/><path d="M0 112H340"/></g>
      <path d="M0 112 L14 108 L28 110 L48 99 L68 87 L86 82 L104 72 L124 66 L146 62 L166 52 L186 46 L204 36 L216 30 L230 34 L246 40 L262 56 L282 66 L298 84 L312 96 L326 102 L340 112" fill="none" stroke="#E08A2B" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M0 34H340" stroke="#1B2530" stroke-width="3.6"/>
      <g fill="#9AA3AE" font-size="10.5"><text x="2" y="58">19°</text><text x="2" y="108">9°</text></g>
    </svg>
    <div class="axis"><span>0시</span><span>23시</span></div>
    <div class="rstats"><div><span>내부 평균</span><b>26.5°</b></div><div><span>외부 최저</span><b class="o">9.2°</b></div><div><span>외부 최고</span><b class="o">28.0°</b></div></div>
  </div>`;

const appScreen = () => `<div class="app"><div class="status"><b>9:41</b><span>●●● ◔ ▮</span></div>${summaryCard()}${reportCard()}${controlCard()}</div>`;

const appCss = `
.sumcard{padding:16px 18px 14px}
.sm-row{display:flex;justify-content:space-between;align-items:center;margin-top:12px}
.sm-t{font-size:15px;font-weight:800}.sm-s{font-size:12px;color:#7B8794;margin-top:2px}
.sm-v{font-size:46px;font-weight:800;line-height:1}.sm-v small{font-size:22px;font-weight:700}
.sm-line{height:1px;background:#E8EBEE;margin:12px 0 10px}
.sm-foot{font-size:12.5px;color:#6B7684;display:flex;align-items:center;gap:6px}.sm-foot b{color:#1B2530}.sm-foot i{width:4px;height:4px;border-radius:50%;background:#C3C9D0}.sm-foot em{font-style:normal;color:#16813F;font-weight:800}
.repcard{padding:16px 18px 14px}
.repcard .more{font-size:12.5px;color:#6B7684}
.legend{display:flex;gap:14px;margin-top:10px;font-size:12px;color:#5B6572;font-weight:700}
.legend span{display:flex;align-items:center;gap:6px}.legend u{display:inline-block;width:14px;height:4px;border-radius:3px}
.l-in{background:#1B2530}.l-out{background:#E08A2B}.l-band{background:#D7EBDD;height:10px!important;width:16px!important;border-radius:3px}
.chart{width:100%;margin-top:6px;display:block}
.axis{display:flex;justify-content:space-between;font-size:11.5px;color:#9AA3AE;margin-top:2px}
.rstats{display:flex;margin-top:10px;border-top:1px solid #E8EBEE;padding-top:10px}
.rstats div{flex:1;text-align:center;border-right:1px solid #E8EBEE}.rstats div:last-child{border-right:0}
.rstats span{display:block;font-size:11.5px;color:#8B95A1}.rstats b{font-size:18px;font-weight:800}.rstats b.o{color:#E08A2B}

.app{position:absolute;left:0;top:0;width:390px;height:860px;background:#EEF0F3;color:#1B2530;padding:0 18px;font-family:P,sans-serif}
.status{height:62px;display:flex;justify-content:space-between;align-items:center;padding:14px 8px 0;font-size:15px}
.status span{letter-spacing:2px;font-size:11px}
.card{background:#fff;border-radius:26px;margin-top:14px;padding:16px 18px;box-shadow:0 2px 10px rgba(20,30,40,.05);color:#1B2530;font-family:P,sans-serif}
.mini .card{margin-top:0;box-shadow:0 30px 70px rgba(0,0,0,.45)}
.ct{display:flex;justify-content:space-between;align-items:center}.ct b{font-size:17px;font-weight:800}.ct span{font-size:12.5px;color:#7B8794;display:flex;align-items:center;gap:6px}.ct i{width:7px;height:7px;border-radius:50%;background:#16813F}
.gz{width:100%;margin-top:-4px}
.gl{text-align:center;color:#8B95A1;font-size:13px;margin-top:-76px}
.gv{text-align:center;font-size:56px;font-weight:800;line-height:1.05}.gv small{font-size:22px;color:#8B95A1;font-weight:600;margin-left:2px}
.gt{text-align:center;color:#8B95A1;font-size:13px;margin-top:2px}
.gp{margin:16px auto 4px;width:max-content;background:#E7F3EA;color:#16813F;font-weight:800;font-size:13.5px;border-radius:30px;padding:8px 16px}
.ctl{padding-bottom:18px}
.st{display:flex;justify-content:space-between;align-items:center;margin-top:18px}
.st .c{width:56px;height:56px;border-radius:50%;background:#F2F4F6;display:flex;align-items:center;justify-content:center}
.sv{font-size:54px;font-weight:800;line-height:1}.sv small{font-size:20px;color:#8B95A1;font-weight:600}
.sr{text-align:center;color:#8B95A1;font-size:12.5px;margin-top:10px}
.sa{margin-top:16px;background:#1E2F27;color:#D5DEB4;border-radius:16px;text-align:center;font-weight:800;font-size:17px;padding:15px 0}
`;

// CSS phone: bezel, island, screen scaled from the 390 x 860 design.
const phone = (w, extra = "") => {
  const bez = Math.round(w * 0.028), r = Math.round(w * 0.15), sw = w - bez * 2, scale = sw / 390;
  const h = Math.round(sw * (860 / 390) + bez * 2);
  return `<div class="phone" style="width:${w}px;height:${h}px;border-radius:${r}px;${extra}">
    <div class="screen" style="left:${bez}px;top:${bez}px;width:${sw}px;height:${h - bez * 2}px;border-radius:${r - bez}px"><div style="transform:scale(${scale});transform-origin:0 0;width:390px;height:860px;position:absolute;left:0;top:0">${appScreen()}</div></div>
    <div class="island" style="width:${w * 0.27}px;height:${w * 0.075}px;top:${bez + w * 0.022}px"></div>
  </div>`;
};
const phoneCss = `
.phone{position:absolute;background:linear-gradient(145deg,#4A5650,#0E1612 40%,#2A332E);box-shadow:0 60px 120px rgba(0,0,0,.55),0 0 0 2px rgba(255,255,255,.08) inset,0 0 0 1.5px rgba(0,0,0,.6)}
.screen{position:absolute;overflow:hidden;background:#EEF0F3}
.island{position:absolute;left:50%;transform:translateX(-50%);background:#05090A;border-radius:99px;z-index:5}
${appCss}`;

const scaled = (html, w) => `<div class="mini" style="width:390px;transform:scale(${w / 390});transform-origin:0 0">${html}</div>`;
const numDot = (n, extra = "") => `<div class="abs" style="width:62px;height:62px;border-radius:50%;background:${C.lime};color:${C.ink};font-size:32px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 24px rgba(0,0,0,.4);z-index:12;${extra}">${n}</div>`;

// ---------------------------------------------------------------------------------------------------------------------
const SPEC = {
  A: { eyebrow: "이번 겨울 실증농가 모집", offer: "100일 무료 실증", cta: "무료 실증 신청하기", sub: "AIoT 반도체가 자동 조정하고, AI 앱이 추적합니다.", foot: "*앱 화면·수치는 예시입니다. 스마트벌통·스마트개폐기·아워비 앱 연동 기준" },
  B: { eyebrow: "이번 겨울 실증농가 모집", offer: "100일 무료 실증", cta: "무료 실증 신청하기", sub: "정온 제어로 다시 사는 벌을 줄이는 것이 목표입니다.", foot: "*입력값 기준 가정 계산이며 농가·작물·계절에 따라 다릅니다." },
  C: { eyebrow: "이번 겨울 실증농가 모집", offer: "100일 무료 실증", cta: "무료 실증 신청하기", sub: "이번 겨울, 수익 변화를 함께 기록할 농가를 찾습니다.", foot: "밀양 스마트팜밸리 농가 실증 진행 중(2026.09~)" },
};

// shared 9:16 footer: CTA, logo + tagline, legal
const tallFooter = (s) => `
    <div class="abs cta" style="left:64px;right:64px;top:1292px;height:112px;font-size:44px;padding:0 44px;z-index:9">${s.cta}${arrowSvg(44)}</div>`;
// shared 1:1 left column footer
const squareFooter = (s, w, top) => `
    <div class="abs logo" style="left:64px;top:${top}px;font-size:42px">ourbee.</div>
    <div class="abs tag" style="left:64px;top:${top + 52}px;font-size:23px;width:${w}px">${TAGLINE}</div>
    <div class="abs legal" style="left:64px;top:${top + 86}px;font-size:18px;width:${w + 70}px">${s.foot}<br/>${LEGAL}</div>`;

function bannerA(r) {
  const s = SPEC.A;
  if (r === "1x1") {
    return `
    <div class="hair"></div>
    <div class="abs h1" style="left:64px;top:262px;font-size:84px;width:560px">수정벌,<br/>이제 <em>휴대폰</em>으로<br/>관리하세요.</div>
    <div class="abs sub" style="left:64px;top:568px;font-size:32px;width:500px">${s.sub}</div>
    <div class="abs cta" style="left:64px;top:694px;width:470px;height:92px;font-size:36px;padding:0 34px">${s.cta}${arrowSvg(36)}</div>
    ${phone(430, "left:640px;top:156px;transform:rotate(-4deg)")}
    <div class="abs glass dk" style="left:358px;top:846px;padding:14px 22px;font-size:27px;font-weight:800;z-index:8"><span style="color:${C.lime}">●</span> AI·빅데이터 후처리</div>
    <div class="abs glass dk" style="left:64px;top:846px;padding:14px 22px;font-size:27px;font-weight:800;z-index:8"><span style="color:${C.lime}">●</span> 반도체 온도관리</div>
    <div class="medal" style="right:34px;top:48px;width:176px;height:176px"><b style="font-size:50px">100일</b><span style="font-size:27px">무료 실증</span></div>`;
  }
  return `
    <div class="abs h1" style="left:64px;top:376px;font-size:84px;width:960px">수정벌, 이제 <em>휴대폰</em>으로<br/>관리하세요.</div>
    <div class="abs sub" style="left:64px;top:588px;font-size:36px;width:960px">${s.sub}</div>
    <div class="medal" style="right:50px;top:476px;width:206px;height:206px"><b style="font-size:58px">100일</b><span style="font-size:31px">무료 실증</span></div>
    <div class="abs" style="left:28px;top:668px;width:1024px;height:596px;border-radius:48px;background:linear-gradient(160deg,rgba(24,40,31,.80),rgba(24,40,31,.62));border:1.5px solid rgba(213,222,180,.30);box-shadow:0 30px 80px rgba(0,0,0,.45)"></div>
    <div class="abs" style="left:52px;top:696px;transform:rotate(-1.4deg);filter:drop-shadow(0 18px 26px rgba(0,0,0,.45))">${scaled(summaryCard(), 468)}</div>
    <div class="abs" style="left:52px;top:888px;transform:rotate(-1.4deg);filter:drop-shadow(0 18px 26px rgba(0,0,0,.45))">${scaled(reportCard(), 468)}</div>
    <div class="abs" style="left:552px;top:716px;transform:rotate(1.6deg);filter:drop-shadow(0 18px 26px rgba(0,0,0,.45))">${scaled(controlCard(), 476)}</div>
    <div class="abs glass dk" style="left:560px;top:1040px;padding:18px 26px;font-size:34px;font-weight:800;transform:rotate(1.6deg);z-index:8"><span style="color:${C.lime}">●</span> 반도체 온도관리</div>
    <div class="abs glass dk" style="left:560px;top:1130px;padding:18px 26px;font-size:34px;font-weight:800;transform:rotate(1.6deg);z-index:8"><span style="color:${C.lime}">●</span> AI·빅데이터 후처리</div>
    ${tallFooter(s)}`;
}

function calcCard(w, big) {
  const f = big ? 1 : 0.84;
  return `<div class="glass" style="width:${w}px;padding:${34 * f}px ${38 * f}px;background:linear-gradient(160deg,rgba(243,240,228,.98),rgba(243,240,228,.92));color:${C.ink};border-color:rgba(255,255,255,.75)">
    <div style="font-size:${34 * f}px;font-weight:800;letter-spacing:-1px">우리 농가 벌 구입비</div>
    <div style="margin-top:${20 * f}px;border-top:2px solid rgba(30,47,39,.14)"></div>
    ${[["봉군 단가", "65,000원", false], ["다시 산 횟수", "△ 회", false], ["줄어든 구입비", "?? 원", true], ["아워비 도입 시 수익 변화", "?? 원", true]].map(([a, b, hi]) => `
      <div style="display:flex;justify-content:space-between;align-items:baseline;padding:${20 * f}px 0;border-bottom:2px solid rgba(30,47,39,.12)">
        <span style="font-size:${29 * f}px;font-weight:600;color:#566259">${a}</span><b style="font-size:${42 * f}px;font-weight:800;color:${hi ? "#2A7A4B" : C.ink}">${b}</b></div>`).join("")}
  </div>`;
}

const photoCard = (src, w, h, extra = "", pos = "50% 50%") => `<div class="abs" style="width:${w}px;height:${h}px;border-radius:40px;overflow:hidden;border:2px solid rgba(255,255,255,.4);box-shadow:0 40px 90px rgba(0,0,0,.5);${extra}"><img src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:${pos}"/></div>`;

function bannerB(r) {
  const s = SPEC.B;
  if (r === "1x1") {
    return `
    <div class="hair"></div>
    <div class="abs h1" style="left:64px;top:240px;font-size:90px;width:480px">한 철에 벌,<br/><em>몇 번</em> 다시<br/>사셨나요?</div>
    <div class="abs sub" style="left:64px;top:576px;font-size:32px;width:440px">${s.sub}</div>
    <div class="abs cta" style="left:64px;top:710px;width:440px;height:92px;font-size:36px;padding:0 32px">${s.cta}${arrowSvg(36)}</div>
    ${photoCard(img("product/controller.png"), 470, 430, "left:556px;top:190px;transform:rotate(2deg)", "55% 50%")}
    <div class="abs" style="left:552px;top:470px;transform:rotate(-2.5deg);z-index:6">${calcCard(450, false)}</div>
    <div class="medal" style="right:46px;top:92px;width:200px;height:200px"><b style="font-size:56px">100일</b><span style="font-size:30px">무료 실증</span></div>`;
  }
  return `
    <div class="abs h1" style="left:64px;top:376px;font-size:92px;width:960px">한 철에 벌,<br/><em>몇 번</em> 다시 사셨나요?</div>
    <div class="abs sub" style="left:64px;top:592px;font-size:36px;width:960px">${s.sub}</div>
    <div class="medal" style="right:50px;top:476px;width:206px;height:206px"><b style="font-size:58px">100일</b><span style="font-size:31px">무료 실증</span></div>
    ${photoCard(img("product/controller.png"), 520, 500, "left:538px;top:712px;transform:rotate(2deg)", "50% 50%")}
    <div class="abs" style="left:56px;top:748px;transform:rotate(-2.5deg);z-index:6">${calcCard(540, true)}</div>
    ${tallFooter(s)}`;
}

const check = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${C.lime}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
const chips = (sz, cols = 1) => ["농어촌공사장상", "농정원장상", "특허 출원", "혁신제품 준비중", "국립농업과학원 기술이전 준비중"].map((t) => `<div class="glass" style="display:flex;align-items:center;gap:12px;padding:${sz * 0.4}px ${sz * 0.62}px;font-size:${sz}px;font-weight:800;border-radius:20px;${cols === 2 ? (t.length > 9 ? "width:100%" : "width:calc(50% - 8px)") : ""}">${check}${t}</div>`).join("");

function bannerC(r) {
  const s = SPEC.C;
  const photo = (h, pos) => `<img class="abs" src="${img("product/hero-greenhouse.png")}" style="left:0;top:0;width:100%;height:${h}px;object-fit:cover;object-position:${pos} 50%"/>`;
  if (r === "1x1") {
    return `${photo(1080, "72%")}
    <div class="abs" style="inset:0;background:linear-gradient(90deg,rgba(24,40,31,.95) 0%,rgba(24,40,31,.80) 36%,rgba(24,40,31,.10) 70%),linear-gradient(0deg,rgba(24,40,31,.97) 0%,rgba(24,40,31,0) 48%)"></div>
    <div class="hair"></div>
    <div class="abs" style="left:64px;top:150px;display:flex;flex-direction:column;align-items:flex-start;gap:12px">${chips(28)}</div>
    <div class="abs h1" style="left:64px;top:590px;font-size:78px;width:940px">밀양 딸기 하우스에서<br/>먼저 <em>써보고</em> 있습니다.</div>
    <div class="abs sub" style="left:64px;top:772px;font-size:32px;width:960px">${s.sub}</div>
    <div class="abs cta" style="left:64px;top:854px;width:470px;height:92px;font-size:36px;padding:0 34px">${s.cta}${arrowSvg(36)}</div>
    <div class="medal" style="right:46px;top:92px;width:200px;height:200px"><b style="font-size:56px">100일</b><span style="font-size:30px">무료 실증</span></div>`;
  }
  return `${photo(1240, "64%")}
    <div class="abs" style="inset:0;background:linear-gradient(180deg,rgba(24,40,31,.92) 0%,rgba(24,40,31,.55) 24%,rgba(24,40,31,0) 44%),linear-gradient(0deg,rgba(32,54,43,.92) 0%,rgba(32,54,43,.80) 30%,rgba(32,54,43,0) 66%)"></div>
    <div class="abs h1" style="left:64px;top:376px;font-size:88px;width:960px">밀양 딸기 하우스에서<br/>먼저 <em>써보고</em> 있습니다.</div>
    <div class="medal" style="right:50px;top:476px;width:206px;height:206px"><b style="font-size:58px">100일</b><span style="font-size:31px">무료 실증</span></div>
    <div class="abs" style="left:64px;top:890px;width:952px;display:flex;flex-wrap:wrap;gap:16px">${chips(34, 2)}</div>
    <div class="abs sub" style="left:64px;top:1190px;font-size:36px;width:960px">${s.sub}</div>
    ${tallFooter(s)}`;
}

const BUILD = { A: bannerA, B: bannerB, C: bannerC };

// Ring art for the empty platform-UI zones of the 9:16 format (top 15%, bottom 20%).
const deco = () => `<svg class="abs" style="left:0;top:0;z-index:0" width="1080" height="1920" viewBox="0 0 1080 1920" fill="none">
  ${[260, 400, 540, 680, 820].map((r, i) => `<circle cx="540" cy="1930" r="${r}" stroke="rgba(213,222,180,${0.16 - i * 0.025})" stroke-width="2"/>`).join("")}
  ${[180, 320, 460].map((r, i) => `<circle cx="1080" cy="-20" r="${r}" stroke="rgba(213,222,180,${0.14 - i * 0.035})" stroke-width="2"/>`).join("")}
  <circle cx="540" cy="1930" r="150" fill="rgba(213,222,180,.10)"/>
</svg>`;

// A soft, blurred greenhouse behind everything so the green does not feel heavy.
const bgLayer = (tall) => `<img class="abs" src="${img("product/greenhouse-background-v1.png")}" style="left:0;top:0;width:100%;height:100%;object-fit:cover;opacity:.55;filter:blur(9px) saturate(1.2) brightness(1.15);z-index:0"/>
  <div class="abs" style="inset:0;background:linear-gradient(100deg,rgba(32,54,43,.70) 0%,rgba(32,54,43,.34) 56%,rgba(90,140,112,.06) 100%);z-index:0"></div>${tall ? `<div class="abs" style="inset:0;background:linear-gradient(180deg,rgba(28,48,38,.46) 0%,rgba(28,48,38,.30) 38%,rgba(28,48,38,0) 64%);z-index:0"></div>` : ""}`;

const html = (key, ratio) => {
  const W = 1080, H = ratio === "1x1" ? 1080 : 1920;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseCss(W, H)}${phoneCss}</style></head><body>${key === "C" && ratio === "1x1" ? "" : bgLayer(ratio === "9x16")}${ratio === "9x16" ? deco() : ""}${BUILD[key](ratio)}<div class="grain"></div></body></html>`;
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--allow-file-access-from-files"] });
  const only = process.argv[2];
  for (const key of Object.keys(BUILD)) {
    if (only && only !== key) continue;
    for (const ratio of ["1x1", "9x16"]) {
      const file = path.join(OUT, `_${key}_${ratio}.html`);
      fs.writeFileSync(file, html(key, ratio));
      const p = await browser.newPage();
      await p.setViewport({ width: 1080, height: ratio === "1x1" ? 1080 : 1920, deviceScaleFactor: 1 });
      await p.goto("file:///" + file.replace(/\\/g, "/"), { waitUntil: "networkidle0" });
      await p.evaluate(() => document.fonts.ready);
      await p.screenshot({ path: path.join(OUT, `OB_Banner${key}_${ratio}.png`) });
      await p.close();
      console.log("wrote", `OB_Banner${key}_${ratio}.png`);
    }
  }
  await browser.close();
})();
