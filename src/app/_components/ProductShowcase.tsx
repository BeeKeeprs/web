"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Expand,
  Minus,
  Pause,
  Play,
  Plus,
  Thermometer,
  X,
} from "lucide-react";
import { hiveRecords, recordTarget } from "./hiveRecord";

const photos = [
  {
    src: "/images/product/controller.png",
    label: "핵심 본체",
    caption: "벌통의 환경을 조절하는, 작은 본체.",
    alt: "올리브색 외장과 흰 전면 패널을 가진 스마트벌통 제어 본체",
  },
  {
    src: "/images/product/installed-front.png",
    label: "현장 설치",
    caption: "벌통 위에 설치하고, 현장과 연결합니다.",
    alt: "하우스 안 흰색 벌통 위에 설치된 제어 본체와 전원선",
  },
  {
    src: "/images/product/installed-side.png",
    label: "다른 각도",
    caption: "현장에서 작동하는 스마트벌통의 모습.",
    alt: "다른 각도에서 촬영한 스마트벌통 본체의 현장 설치 모습",
  },
];

export default function ProductShowcase() {
  const [photo, setPhoto] = useState(0);
  const [tab, setTab] = useState<"control" | "records">("control");
  const [target, setTarget] = useState(recordTarget);
  const [applied, setApplied] = useState(recordTarget);
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState(hiveRecords.length - 1);
  const [playing, setPlaying] = useState(false);
  const [modal, setModal] = useState<"product" | "control" | "records" | null>(
    null,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const record = hiveRecords[selected];
  const source =
    modal === "control"
      ? "/images/product/app-control.png"
      : modal === "records"
        ? "/images/product/app-records.png"
        : photos[photo].src;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setSelected((index) => Math.min(index + 1, hiveRecords.length - 1)),
      1400,
    );
    return () => window.clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    if (selected === hiveRecords.length - 1) setPlaying(false);
  }, [selected]);
  useEffect(() => {
    if (modal) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [modal]);

  function adjust(value: number) {
    setTarget(Math.max(16, Math.min(36, Math.round(value * 2) / 2)));
    setNotice("");
  }

  return (
    <section className="product-showcase" aria-labelledby="hero-title">
      <div className="showcase-heading">
        <div>
          <h1 id="hero-title">
            바깥 온도는 달라도,
            <br />
            <span>벌통 안은 26.5°C.</span>
          </h1>
          <p>
            온도를 지키는 본체와, 내 손안의 관리.
            <br />
            실제 제품과 앱 기록으로 webee를 만나보세요.
          </p>
        </div>
        <div className="performance-summary">
          <span className="performance-source">제공된 현장 테스트 사례</span>
          <div className="performance-numbers">
            <div>
              <strong>
                ±0.2<small>°C</small>
              </strong>
              <span>목표 대비 온도 편차</span>
            </div>
            <div>
              <strong>
                10–20<small>°C</small>
              </strong>
              <span>테스트 당시 외부 온도</span>
            </div>
          </div>
          <p>
            목표 26.5°C 설정 시 관찰한 사례입니다.
            <br />
            아래 앱 캡처의 측정 구간과는 별도입니다.
          </p>
        </div>
      </div>

      <div className="showcase-stage">
        <div className="hardware-column">
          <div className="hardware-heading">
            <span>01 / SMART HIVE</span>
            <span>실제 제품 사진</span>
          </div>
          <div
            className="hardware-photo"
            onPointerMove={(event) => {
              if (
                event.pointerType !== "mouse" ||
                window.matchMedia("(prefers-reduced-motion: reduce)").matches
              )
                return;
              const bounds = event.currentTarget.getBoundingClientRect();
              event.currentTarget.style.setProperty(
                "--photo-x",
                `${((event.clientX - bounds.left - bounds.width / 2) / bounds.width) * 8}px`,
              );
              event.currentTarget.style.setProperty(
                "--photo-y",
                `${((event.clientY - bounds.top - bounds.height / 2) / bounds.height) * 6}px`,
              );
            }}
            onPointerLeave={(event) => {
              event.currentTarget.style.setProperty("--photo-x", "0px");
              event.currentTarget.style.setProperty("--photo-y", "0px");
            }}
          >
            <Image
              key={photos[photo].src}
              src={photos[photo].src}
              alt={photos[photo].alt}
              fill
              priority={photo === 0}
              sizes="(max-width: 750px) 100vw, 60vw"
              className={photo === 0 ? "core-photo" : "installed-photo"}
            />
            <button
              className="photo-expand"
              type="button"
              onClick={() => setModal("product")}
              aria-label="제품 사진 크게 보기"
            >
              <Expand size={17} />
            </button>
            <div className="photo-pagination">
              <button
                type="button"
                aria-label="이전 제품 사진"
                onClick={() => setPhoto((photo + 2) % 3)}
              >
                <ChevronLeft size={18} />
              </button>
              <span>0{photo + 1} / 03</span>
              <button
                type="button"
                aria-label="다음 제품 사진"
                onClick={() => setPhoto((photo + 1) % 3)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="hardware-footer">
            <div
              className="photo-tabs"
              role="group"
              aria-label="제품 사진 선택"
            >
              {photos.map((item, i) => (
                <button
                  type="button"
                  aria-pressed={photo === i}
                  onClick={() => setPhoto(i)}
                  key={item.src}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p>{photos[photo].caption}</p>
          </div>
          <a className="hardware-link" href="#performance">
            실제 측정 기록 살펴보기 <ArrowDown size={16} />
          </a>
        </div>

        <div className="phone-column" id="app-experience">
          <div className="phone-intro">
            <span>02 / APP EXPERIENCE</span>
            <span>
              직접 눌러보세요 <ArrowDown size={13} />
            </span>
          </div>
          <div className="phone-frame">
            <div className="phone-status">
              <span>9:41</span>
              <span className="phone-island" />
              <span>체험 화면</span>
            </div>
            <div className="phone-screen">
              <div
                className="phone-tabs"
                role="group"
                aria-label="앱 체험 화면"
              >
                <button
                  type="button"
                  aria-pressed={tab === "control"}
                  onClick={() => {
                    setTab("control");
                    setPlaying(false);
                  }}
                >
                  스마트벌통
                </button>
                <button
                  type="button"
                  aria-pressed={tab === "records"}
                  onClick={() => setTab("records")}
                >
                  측정 기록
                </button>
              </div>
              {tab === "control" ? (
                <>
                  <div className="phone-hive-name">
                    <h2>A402-M01</h2>
                    <span>앱 화면 재현</span>
                  </div>
                  <div className="phone-reading">
                    <span>9/14 {record.time} · 첨부 기록</span>
                    <div>
                      <p>
                        내부{" "}
                        <strong>
                          {record.inside.toFixed(1)}
                          <small>°C</small>
                        </strong>
                        <b>{record.humidity}%</b>
                      </p>
                      <p>
                        외부{" "}
                        <strong>
                          {record.outside.toFixed(1)}
                          <small>°C</small>
                        </strong>
                        <b>{record.outsideHumidity}%</b>
                      </p>
                    </div>
                  </div>
                  <button
                    className="phone-record-button"
                    type="button"
                    onClick={() => setTab("records")}
                  >
                    <Activity size={17} />
                    실제 센서 기록 보기
                  </button>
                  <div className="phone-temperature">
                    <h3>
                      <Thermometer size={19} />
                      목표 온도 설정
                    </h3>
                    <div className="temperature-stepper">
                      <button
                        type="button"
                        aria-label="목표 온도 0.5도 낮추기"
                        disabled={target <= 16}
                        onClick={() => adjust(target - 0.5)}
                      >
                        <Minus size={20} />
                      </button>
                      <output htmlFor="target-temperature">
                        {target.toFixed(1)}
                        <small>°C</small>
                      </output>
                      <button
                        type="button"
                        aria-label="목표 온도 0.5도 높이기"
                        disabled={target >= 36}
                        onClick={() => adjust(target + 0.5)}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <input
                      type="range"
                      id="target-temperature"
                      aria-label="체험 목표 온도"
                      min="16"
                      max="36"
                      step="0.5"
                      value={target}
                      onChange={(event) => adjust(Number(event.target.value))}
                      aria-valuetext={`${target.toFixed(1)}도`}
                    />
                    <div className="temperature-range">
                      <span>16°C</span>
                      <span>0.5°C씩 조절</span>
                      <span>36°C</span>
                    </div>
                    <button
                      className="phone-apply"
                      type="button"
                      disabled={target === applied}
                      onClick={() => {
                        setApplied(target);
                        setNotice(
                          `${target.toFixed(1)}°C로 체험 설정을 변경했어요.`,
                        );
                      }}
                    >
                      <Check size={15} />
                      {target.toFixed(1)}°C로{" "}
                      {target === applied ? "설정됨" : "체험하기"}
                    </button>
                    <p role="status" className="phone-notice">
                      {notice || "설정 동작을 체험해 보세요."}
                    </p>
                  </div>
                  <p className="phone-disclaimer">
                    체험 설정은 실제 기기로 전송되지 않으며,
                    <br />
                    측정 기록은 목표 26.5°C 설정 사례입니다.
                  </p>
                </>
              ) : (
                <>
                  <div className="phone-record-heading">
                    <h2>실시간 확인</h2>
                    <span>실제 앱 기록 재현</span>
                  </div>
                  <div className="record-filter">
                    <span>9/14(월)</span>
                    <span>05시</span>
                    <span>5분 간격</span>
                  </div>
                  <div className="record-playback">
                    <div>
                      <span>선택한 기록</span>
                      <strong>{record.time}</strong>
                    </div>
                    <button
                      type="button"
                      aria-label={
                        playing ? "기록 재생 일시정지" : "기록 순서대로 재생"
                      }
                      onClick={() => {
                        if (!playing && selected === hiveRecords.length - 1)
                          setSelected(0);
                        setPlaying(!playing);
                      }}
                    >
                      {playing ? <Pause size={16} /> : <Play size={16} />}
                      {playing ? "일시정지" : "기록 재생"}
                    </button>
                  </div>
                  <table className="phone-table">
                    <caption className="sr-only">
                      첨부 앱 캡처의 실제 측정 기록
                    </caption>
                    <thead>
                      <tr>
                        <th>시각</th>
                        <th>내부 °C</th>
                        <th>외부 °C</th>
                        <th>내부 %</th>
                        <th>외부 %</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="missing-row">
                        <th>06:00</th>
                        <td>—</td>
                        <td>—</td>
                        <td>—</td>
                        <td>—</td>
                      </tr>
                      {hiveRecords
                        .slice()
                        .reverse()
                        .map((row, reverseIndex) => {
                          const index = hiveRecords.length - 1 - reverseIndex;
                          return (
                            <tr
                              key={row.time}
                              data-selected={selected === index}
                            >
                              <th>
                                <button
                                  type="button"
                                  aria-label={`${row.time} 기록 선택`}
                                  aria-pressed={selected === index}
                                  onClick={() => {
                                    setSelected(index);
                                    setPlaying(false);
                                  }}
                                >
                                  {row.time}
                                </button>
                              </th>
                              <td>{row.inside.toFixed(1)}</td>
                              <td>{row.outside.toFixed(1)}</td>
                              <td>{row.humidity}</td>
                              <td>{row.outsideHumidity}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  <p className="phone-disclaimer">
                    시간을 눌러 기록을 선택해 보세요.
                    <br />빈 측정값은 원본과 동일하게 표시했습니다.
                  </p>
                </>
              )}
            </div>
            <div className="phone-home-indicator" />
          </div>
          <button
            type="button"
            className="original-screen-link"
            onClick={() => setModal(tab)}
          >
            <Expand size={14} />
            첨부된 실제 앱 화면 보기 <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
      <dialog
        ref={dialogRef}
        className="source-dialog"
        onCancel={() => setModal(null)}
        onClose={() => setModal(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setModal(null);
        }}
      >
        <div className="source-dialog-content">
          <div className="source-dialog-heading">
            <h2>
              {modal === "product"
                ? photos[photo].label
                : "제공된 실제 앱 화면"}
            </h2>
            <button
              type="button"
              onClick={() => setModal(null)}
              aria-label="원본 사진 닫기"
            >
              <X size={22} />
            </button>
          </div>
          {modal && (
            <Image
              src={source}
              alt={
                modal === "product"
                  ? photos[photo].alt
                  : "사용자가 제공한 원본 앱 캡처"
              }
              width={modal === "product" ? 1448 : 1080}
              height={modal === "product" ? 1086 : 2200}
              sizes="90vw"
              style={{ width: "auto", height: "auto" } as CSSProperties}
            />
          )}
        </div>
      </dialog>
    </section>
  );
}
