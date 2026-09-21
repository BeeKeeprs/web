import ProductShowcase from "./_components/ProductShowcase";
import PerformanceRecord from "./_components/PerformanceRecord";
import { GateExperience } from "./_components/ProductExperience";
import SetupJourney from "./_components/SetupJourney";
import PageMotion from "./_components/PageMotion";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
const questions = [
  [
    "어떤 일을 도와주는 제품인가요?",
    "스마트 벌통으로 내부 온도와 습도를 확인하고, 개폐기로 출입구를 관리하는 제품입니다. 현장에서 살펴봐야 할 변화를 파악하는 데 도움을 줍니다.",
  ],
  [
    "설치 전에 무엇을 확인해야 하나요?",
    "벌통의 형태와 설치 위치, 전원 공급, 현장의 Wi-Fi 연결 상태를 먼저 확인해야 합니다. 도입 문의 시 재배 작물과 사용 환경을 함께 알려주세요.",
  ],
  [
    "벌통 상태는 어디에서 확인하나요?",
    "벌통 조회와 기기 관리는 휴대폰 앱에서 이용합니다. 이 웹사이트에서는 제품과 사용 방법을 소개합니다.",
  ],
  [
    "기존에 쓰던 벌통에도 설치할 수 있나요?",
    "벌통과 출입구의 구조에 따라 설치 가능 여부가 달라집니다. 사용 중인 벌통의 사진과 크기를 보내주시면 적합한 구성을 확인할 수 있습니다.",
  ],
  [
    "가격과 도입 방법이 궁금해요.",
    "필요한 제품과 수량, 현장 조건에 따라 구성이 달라집니다. 아래 이메일로 사용 환경을 알려주시면 도입에 필요한 내용을 상담할 수 있습니다.",
  ],
];
export default function LandingPage() {
  return (
    <>
      <PageMotion />
      <a className="skip-link" href="#main">
        본문으로 바로가기
      </a>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="ourbee 홈">
          ourbee<span>.</span>
        </Link>
        <nav aria-label="주 메뉴">
          <a href="#app-experience">앱 체험</a>
          <a href="#performance">성능 기록</a>
          <a href="#how-it-works">사용 방법</a>
          <a href="#faq">자주 묻는 질문</a>
        </nav>
        <a className="button header-contact" href="#contact">
          도입 문의 <ArrowUpRight size={16} />
        </a>
      </header>
      <main id="main">
        <ProductShowcase />
        <PerformanceRecord />
        <section
          className="products section-pad"
          id="products"
          aria-labelledby="products-title"
        >
          <div className="section-heading">
            <h2 id="products-title">
              출입구 관리까지,
              <br />
              손안에서 간편하게.
            </h2>
            <p>
              버튼을 눌러 출입구를 열고 닫아보세요.
              <br />
              작은 조작으로 관리의 차이를 경험합니다.
            </p>
          </div>
          <article className="product-row">
            <GateExperience />
            <div className="product-copy">
              <span className="section-number">02 / 스마트 개폐기</span>
              <h3>한 번의 터치로, 열고 닫다.</h3>
              <p>
                벌통의 출입구를 기기와 연결해 관리합니다.
                <br />
                현장 상황에 맞춰 휴대폰에서 제어하고,
                <br />
                필요한 작업을 준비하세요.
              </p>
              <a className="text-link" href="#contact">
                우리 벌통에도 설치할 수 있나요? <ArrowUpRight size={17} />
              </a>
            </div>
          </article>
          <p className="product-footnote">
            위 체험은 예시 데이터와 개념도를 사용한 시뮬레이션입니다. 실제 기기
            제어는 휴대폰 앱에서 이용하며, 기기 설치와 전원·네트워크 연결이
            필요합니다.
          </p>
        </section>
        <section
          className="how-section section-pad"
          id="how-it-works"
          aria-labelledby="how-title"
        >
          <div className="section-heading">
            <h2 id="how-title">
              현장의 벌통과
              <br />
              손안의 관리가 이어지도록.
            </h2>
            <p>
              농장에 맞게 설치하고,
              <br />
              일상에 맞게 살펴보세요.
            </p>
          </div>
          <SetupJourney />
        </section>
        <section
          className="faq-section section-pad"
          id="faq"
          aria-labelledby="faq-title"
        >
          <div>
            <span className="section-number">알아두면 좋은 이야기</span>
            <h2 id="faq-title">자주 묻는 질문</h2>
          </div>
          <div className="faq-list">
            {questions.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <Plus size={20} aria-hidden="true" />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section
          className="contact-section section-pad"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div>
            <span className="section-number">함께 시작해 볼까요?</span>
            <h2 id="contact-title">
              우리 농장에 맞는
              <br />
              관리를 이야기해요.
            </h2>
            <p>재배 작물, 벌통 수량, 설치 환경을 알려주세요.</p>
          </div>
          <a
            className="contact-link"
            href="mailto:support@webee.kr?subject=ourbee%20%EB%8F%84%EC%9E%85%20%EB%AC%B8%EC%9D%98"
          >
            support@webee.kr <ArrowUpRight aria-hidden="true" />
          </a>
        </section>
      </main>
      <footer className="site-footer">
        <Link href="/" className="wordmark">
          ourbee<span>.</span>
        </Link>
        <span>더 건강한 수정 환경을 만드는 연결</span>
        <small>© {new Date().getFullYear()} ourbee</small>
        <a href="#main" className="back-top">
          맨 위로 <ArrowUpRight size={15} />
        </a>
      </footer>
    </>
  );
}
