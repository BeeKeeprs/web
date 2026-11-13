"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Leaf } from "lucide-react";
import styles from "./FarmInquiryPreview.module.css";

const crops = ["딸기", "토마토", "블루베리", "기타"];
const problems = ["더위", "추위", "습기", "벌 활동 저하", "벌 이탈", "수정불량", "잦은 교체·비용", "농약 작업 중 관리", "기타"];
const months = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);

function Choice({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return <fieldset className={styles.choice}><legend>{label}</legend><div className={styles.chips}>
    {options.map(option => <label key={option} className={styles.chip}><input type="radio" name={label} value={option} checked={value === option} onChange={() => onChange(option)} /><span>{option}</span></label>)}
  </div></fieldset>;
}

export default function FarmInquiryPreview({ pilot = false }: { pilot?: boolean }) {
  const [step, setStep] = useState<"contact" | "details" | "done">("contact");
  const [contact, setContact] = useState({ name: "", phone: "", region: "", crop: "", otherCrop: "" });
  const [detail, setDetail] = useState({ area: "", hives: "", currentTotal: "", weeks: "", bee: "", wifi: "", power: "", other: "", start: "", end: "", total: "", memo: "" });
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (step !== "contact") { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
  }, [step]);
  const changeDetail = (key: keyof typeof detail, value: string) => setDetail(current => ({ ...current, [key]: value }));
  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contact.name.trim() || !contact.region.trim()) { setError("성함과 농장 지역을 입력해 주세요."); return; }
    if (contact.phone.replace(/\D/g, "").length < 9) { setError("연락 가능한 전화번호를 확인해 주세요."); return; }
    if (!contact.crop || (contact.crop === "기타" && !contact.otherCrop.trim())) { setError("재배 작물을 알려주세요."); return; }
    setError(""); setStep("details");
  }
  return <section className={styles.card} aria-label={pilot ? "실증 참여 상담" : "도입 상담"}>
    <div className={styles.preview}>개발 미리보기 · 입력 내용은 전송·저장되지 않습니다.</div>
    <div className={styles.progress} aria-label="화면 순서"><span data-active={step === "contact"}>01 상담 신청</span><i /><span data-active={step === "details"}>02 농장 조건 <small>선택</small></span></div>

    {step === "contact" && <form onSubmit={submitContact}>
      <div className={styles.eyebrow}><Leaf size={15} aria-hidden="true" /> {pilot ? "100일 실증 참여 상담" : "우리 농장 도입 상담"}</div>
      <h3 ref={heading} tabIndex={-1}>먼저, 연락처만 남겨주세요.</h3>
      <p className={styles.sub}>어디서 어떤 작물을 키우시는지 알려주세요.<br />자세한 농장 조건은 다음 화면에서 선택할 수 있어요.</p>
      <div className={styles.pair}>
        <label className={styles.field}>성함<input autoComplete="name" name="name" placeholder="홍길동" maxLength={80} required value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} /></label>
        <label className={styles.field}>연락처<input autoComplete="tel" type="tel" name="phone" placeholder="010-0000-0000" maxLength={40} required value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} /></label>
      </div>
      <label className={styles.field}>농장 지역 <small>시·군까지만 알려주세요</small><input name="region" placeholder="예: 경북 경산" maxLength={120} required value={contact.region} onChange={e => setContact({ ...contact, region: e.target.value })} /></label>
      <Choice label="재배 작물" options={crops} value={contact.crop} onChange={crop => setContact({ ...contact, crop })} />
      {contact.crop === "기타" && <label className={styles.field}>재배 작물명<input placeholder="작물 이름" required maxLength={120} value={contact.otherCrop} onChange={e => setContact({ ...contact, otherCrop: e.target.value })} /></label>}
      <div className={styles.scope}><strong>벌은 농가에서 직접 준비해 주세요.</strong><p>아워비는 하드웨어와 사용 데이터 추적·기록을 제공합니다.<br />벌의 구매·교체·보충은 농가에서 진행합니다.</p></div>
      <label className={styles.confirm}><input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} required /><span>수정벌은 농가에서 직접 준비하는 점을 확인했습니다.</span></label>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <button className={styles.primary} type="submit">참여 상담 신청 <ArrowRight size={18} aria-hidden="true" /></button>
      <p className={styles.footnote}>미리보기에서는 신청 후 화면으로만 이동합니다.</p>
    </form>}

    {step === "details" && <form onSubmit={e => { e.preventDefault(); setStep("done"); }}>
      <div className={styles.receipt}><CheckCircle2 size={19} aria-hidden="true" /><span>{contact.name} 님의 농장 조건을 살펴볼게요.</span></div>
      <h3 ref={heading} tabIndex={-1}>우리 농장은 이래요.</h3>
      <p className={styles.sub}>아는 것만 답해주세요. 대략적인 숫자도 괜찮아요.<br />답하기 어려운 내용은 상담할 때 이야기해요.</p>
      <div className={styles.block}>
        <div className={styles.blockTitle}><span>01</span><h4>평소 벌통을 어떻게 쓰시나요?</h4></div>
        <div className={styles.sentence}>
          <span>농장 전체에서 현재 총 <label><input aria-label="농장 전체 현재 사용 벌통 수(통)" type="number" inputMode="numeric" min="1" step="1" placeholder="10" value={detail.currentTotal} onChange={e => changeDetail("currentTotal", e.target.value)} />통</label>을 쓰고 있어요.</span>
          <span>설치할 하우스 <label><input aria-label="실증 하우스 면적(평)" type="number" inputMode="decimal" min="0.1" step="any" placeholder="600" value={detail.area} onChange={e => changeDetail("area", e.target.value)} />평</label>에</span>
          <span>한 번에 <label><input aria-label="동시에 사용하는 벌통 수(통)" type="number" inputMode="numeric" min="1" step="1" placeholder="3" value={detail.hives} onChange={e => changeDetail("hives", e.target.value)} />통</label>을 놓고,</span>
          <span>보통 <label><input aria-label="벌통 교체 주기(주)" type="number" inputMode="decimal" min="0.1" step="any" placeholder="4" value={detail.weeks} onChange={e => changeDetail("weeks", e.target.value)} />주</label>마다 교체해요.</span>
        </div>
        <p className={styles.hint}>현재 총 사용량은 농장 전체 기준, 면적과 동시 사용량은 장비를 설치할 하우스 기준이에요.</p>
        <Choice label="사용하는 벌" options={["뒤영벌(호박벌)", "꿀벌", "둘 다", "잘 모르겠어요"]} value={detail.bee} onChange={v => changeDetail("bee", v)} />
      </div>
      <fieldset className={styles.block}><legend className={styles.problemLegend}>02 벌을 쓸 때 무엇이 불편한가요?</legend><p className={styles.hint}>여러 개 골라도 괜찮아요.</p><div className={styles.chips}>
        {problems.map(problem => <label key={problem} className={styles.chip}><input type="checkbox" value={problem} checked={selectedProblems.includes(problem)} onChange={e => setSelectedProblems(current => e.target.checked ? [...current, problem] : current.filter(p => p !== problem))} /><span>{selectedProblems.includes(problem) && <Check size={13} aria-hidden="true" />}{problem}</span></label>)}
      </div>{selectedProblems.includes("기타") && <label className={styles.field}>어떤 점이 불편하세요?<input maxLength={1000} placeholder="짧게 적어주세요" value={detail.other} onChange={e => changeDetail("other", e.target.value)} /></label>}</fieldset>
      <div className={styles.block}><div className={styles.blockTitle}><span>03</span><h4>설치 위치에서 사용할 수 있나요?</h4></div><p className={styles.hint}>농장 사무실이 아닌, 벌통을 놓을 자리 기준이에요.</p>
        <Choice label="Wi-Fi" options={["가능", "불가", "모름"]} value={detail.wifi} onChange={v => changeDetail("wifi", v)} />
        <Choice label="상시 전원" options={["가능", "불가", "모름"]} value={detail.power} onChange={v => changeDetail("power", v)} />
      </div>
      <div className={styles.optional}>
        <details className={styles.season}><summary>한 작기 구매량 <span>선택</span></summary><div className={styles.seasonInputs}>
          <label>시작 월<select aria-label="작기 시작 월" value={detail.start} onChange={e => changeDetail("start", e.target.value)}><option value="">선택</option>{months.map(m => <option key={m}>{m}</option>)}</select></label>
          <label>종료 월<select aria-label="작기 종료 월" value={detail.end} onChange={e => changeDetail("end", e.target.value)}><option value="">선택</option>{months.map(m => <option key={m}>{m}</option>)}</select></label>
          <label>총 구매량<div><input aria-label="한 작기 총 구매 벌통 수" type="number" min="1" step="1" inputMode="numeric" placeholder="18" value={detail.total} onChange={e => changeDetail("total", e.target.value)} />통</div></label>
        </div><p className={styles.hint}>예: 10월부터 다음 해 3월까지 총 18통. 현재 사용하는 통수와는 별개예요.</p></details>
        <details className={styles.season}><summary>더 하실 말씀 있으세요? <span>선택 · 메모</span></summary><label className={styles.memo}>메모<textarea rows={3} maxLength={4000} placeholder="궁금한 점이나 농장 상황을 편하게 남겨주세요." value={detail.memo} onChange={e => changeDetail("memo", e.target.value)} /></label></details>
      </div>
      <button className={styles.primary} type="submit">이 내용으로 마무리 <ArrowRight size={18} aria-hidden="true" /></button>
      <div className={styles.actions}><button type="button" onClick={() => setStep("contact")}><ArrowLeft size={14} />신청 정보 수정</button><button type="button" onClick={() => setStep("done")}>나중에 상담으로 답할게요</button></div>
    </form>}

    {step === "done" && <div className={styles.done}>
      <CheckCircle2 size={42} strokeWidth={1.4} aria-hidden="true" /><h3 ref={heading} tabIndex={-1}>입력 흐름을 확인했어요.</h3><p>실제 서비스에서는 이 화면에서<br />상담 접수 완료를 안내합니다.</p>
      <dl><div><dt>농장</dt><dd>{contact.region} · {contact.crop === "기타" ? contact.otherCrop : contact.crop}</dd></div><div><dt>농장 전체 현재 사용</dt><dd>{detail.currentTotal ? `${detail.currentTotal}통` : "미입력"}</dd></div><div><dt>설치 면적 / 동시 사용</dt><dd>{detail.area ? `${detail.area}평` : "미입력"} / {detail.hives ? `${detail.hives}통` : "미입력"}</dd></div><div><dt>현재 문제</dt><dd>{selectedProblems.join(", ") || "상담 시 확인"}</dd></div><div><dt>Wi-Fi / 전원</dt><dd>{detail.wifi || "미입력"} / {detail.power || "미입력"}</dd></div>{detail.total && <div><dt>한 작기 구매량</dt><dd>{detail.start || "시작 월 미입력"}~{detail.end || "종료 월 미입력"} / {detail.total}통</dd></div>}{detail.memo.trim() && <div><dt>메모</dt><dd className={styles.memoValue}>{detail.memo}</dd></div>}</dl>
      <button type="button" className={styles.primary} onClick={() => setStep("details")}>농장 조건 다시 보기 <ArrowLeft size={18} /></button><p className={styles.footnote}>미리보기입니다. 실제 접수와 메일 전송은 이루어지지 않았습니다.</p>
    </div>}
  </section>;
}
