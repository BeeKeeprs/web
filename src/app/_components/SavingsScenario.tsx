"use client";

import { useState } from "react";

const formatWon = (value: number) => new Intl.NumberFormat("ko-KR").format(value) + "원";

export default function SavingsScenario() {
  const [beePrice, setBeePrice] = useState("");
  const [fewerColonies, setFewerColonies] = useState("");
  const [extraYield, setExtraYield] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const beeEstimate = beePrice !== "" && fewerColonies !== "";
  const salesEstimate = extraYield !== "" && salePrice !== "";

  return (
    <section className="economics-section section-pad" id="economics" aria-labelledby="economics-title">
      <div className="section-heading scroll-reveal">
        <div>
          <span className="section-number">가정으로 계산해 보기</span>
          <h2 id="economics-title">우리 농장에서는<br />얼마가 달라질까?</h2>
        </div>
        <p>농가의 실제 단가를 넣어 보는 계산입니다.<br />아워비 도입 후 절감·증가를 관찰한 POC 결과는 아닙니다.</p>
      </div>
      <div className="economics-grid">
        <div className="economics-card scroll-reveal reveal-delay-0">
          <span className="evidence-tag">가정 계산 · 벌 구입비</span>
          <h3>구입 횟수가 줄어든다면</h3>
          <p>봉군 구입 단가 × 실제로 줄어든 구입 수</p>
          <div className="economics-inputs">
            <label>봉군 1개 구입 단가 <span>원</span><input type="number" min="0" inputMode="numeric" value={beePrice} onChange={(event) => setBeePrice(event.target.value)} placeholder="직접 입력" /></label>
            <label>줄어든 구입 수 <span>개</span><input type="number" min="0" inputMode="numeric" value={fewerColonies} onChange={(event) => setFewerColonies(event.target.value)} placeholder="직접 입력" /></label>
          </div>
          <div className="economics-result"><span>구입비 감소 가정</span><strong>{beeEstimate ? formatWon(Number(beePrice) * Number(fewerColonies)) : "값을 입력해 주세요"}</strong></div>
        </div>
        <div className="economics-card scroll-reveal reveal-delay-1">
          <span className="evidence-tag">가정 계산 · 추가 매출</span>
          <h3>상품과 수확량이 늘어난다면</h3>
          <p>추가 상품과 수확량 × 실제 판매 단가</p>
          <div className="economics-inputs">
            <label>추가 상품과 수확량 <span>kg</span><input type="number" min="0" inputMode="decimal" value={extraYield} onChange={(event) => setExtraYield(event.target.value)} placeholder="직접 입력" /></label>
            <label>상품과 판매 단가 <span>원/kg</span><input type="number" min="0" inputMode="numeric" value={salePrice} onChange={(event) => setSalePrice(event.target.value)} placeholder="직접 입력" /></label>
          </div>
          <div className="economics-result"><span>추가 매출 가정</span><strong>{salesEstimate ? formatWon(Number(extraYield) * Number(salePrice)) : "값을 입력해 주세요"}</strong></div>
        </div>
      </div>
      <p className="economics-note scroll-reveal">두 계산의 구입 감소·추가 수확량은 아직 입증되지 않았습니다. 실제 순이익을 보려면 제품 구입비, 전기료, 설치·유지 비용과 판매 비용도 함께 계산해야 합니다. POC에서 사용기간, 활동성, 상품과 수확량을 확인하고 있습니다.</p>
    </section>
  );
}
