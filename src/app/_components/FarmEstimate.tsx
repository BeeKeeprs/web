"use client";

import { useState } from "react";

const won = (value: number) => `${new Intl.NumberFormat("ko-KR").format(value)}원`;

export default function FarmEstimate() {
  const [beePrice, setBeePrice] = useState("");
  const [fewerBeeBoxes, setFewerBeeBoxes] = useState("");
  const [extraGradeYield, setExtraGradeYield] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const beeSaving = beePrice !== "" && fewerBeeBoxes !== "" ? Number(beePrice) * Number(fewerBeeBoxes) : null;
  const addedSales = extraGradeYield !== "" && salePrice !== "" ? Number(extraGradeYield) * Number(salePrice) : null;

  return <div className="farm-estimate">
    <div className="estimate-card">
      <span className="estimate-kicker">01 · 벌 구입비</span>
      <h3>다시 사는 벌이 줄어든다면</h3>
      <p>농가의 실제 구입 단가와 예상 감소 수량을 넣어 보세요.</p>
      <div className="estimate-fields">
        <label>봉군 1개 구입 단가 <span>원</span><input type="number" min="0" inputMode="numeric" value={beePrice} onChange={(event) => setBeePrice(event.target.value)} placeholder="직접 입력" /></label>
        <label>줄어들 것으로 가정한 구입 수 <span>개</span><input type="number" min="0" inputMode="numeric" value={fewerBeeBoxes} onChange={(event) => setFewerBeeBoxes(event.target.value)} placeholder="직접 입력" /></label>
      </div>
      <div className="estimate-result"><span>구입비 변화 가정</span><strong aria-live="polite">{beeSaving === null ? "숫자를 입력해 주세요" : won(beeSaving)}</strong></div>
      <small>봉군 단가 × 줄어든 구입 수</small>
    </div>
    <div className="estimate-card">
      <span className="estimate-kicker">02 · 상품과 추가 매출</span>
      <h3>판매할 상품과가 늘어난다면</h3>
      <p>상품과 증가량은 농가가 가정해 직접 입력합니다.</p>
      <div className="estimate-fields">
        <label>추가 상품과 수확량 <span>kg</span><input type="number" min="0" step="any" inputMode="decimal" value={extraGradeYield} onChange={(event) => setExtraGradeYield(event.target.value)} placeholder="직접 입력" /></label>
        <label>실제 판매 단가 <span>원/kg</span><input type="number" min="0" inputMode="numeric" value={salePrice} onChange={(event) => setSalePrice(event.target.value)} placeholder="직접 입력" /></label>
      </div>
      <div className="estimate-result"><span>추가 매출 가정</span><strong aria-live="polite">{addedSales === null ? "숫자를 입력해 주세요" : won(addedSales)}</strong></div>
      <small>추가 상품과 kg × 판매 단가</small>
    </div>
  </div>;
}
