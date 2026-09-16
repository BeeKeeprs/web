"use client";

import { useState } from "react";
import { hiveRecords, recordTarget } from "./hiveRecord";

const x = (i: number) => 40 + i * 80;
const y = (temperature: number) => 215 - (temperature - 22) * 32;
const insidePoints = hiveRecords
  .map((r, i) => `${x(i)},${y(r.inside)}`)
  .join(" ");
const outsidePoints = hiveRecords
  .map((r, i) => `${x(i)},${y(r.outside)}`)
  .join(" ");

export default function PerformanceRecord() {
  const [index, setIndex] = useState(0);
  const record = hiveRecords[index];
  return (
    <section
      className="performance-section section-pad"
      id="performance"
      aria-labelledby="performance-title"
    >
      <div className="section-heading">
        <div>
          <span className="section-number">실제 앱에 남은 기록</span>
          <h2 id="performance-title">
            숫자로 확인하는
            <br />
            온도 유지.
          </h2>
        </div>
        <p>
          첨부된 9월 14일, 05:20–05:55 기록입니다.
          <br />
          시간을 움직여 내부와 외부 온도를 비교해 보세요.
        </p>
      </div>
      <div className="performance-record-grid">
        <div className="record-chart">
          <div className="chart-legend">
            <span>
              <i />
              내부 온도
            </span>
            <span>
              <i />
              외부 온도
            </span>
            <span>목표 26.5°C</span>
          </div>
          <svg
            viewBox="0 0 640 260"
            role="img"
            aria-label="9월 14일 측정 기록. 내부 26.3에서 26.6도, 외부 22.6에서 24.4도."
          >
            {[22, 24, 26, 28].map((t) => (
              <g key={t}>
                <line x1="40" x2="600" y1={y(t)} y2={y(t)} stroke="#d4dbc9" />
                <text x="2" y={y(t) + 4}>
                  {t}°
                </text>
              </g>
            ))}
            <line
              x1="40"
              x2="600"
              y1={y(recordTarget)}
              y2={y(recordTarget)}
              stroke="#7d925b"
              strokeDasharray="5 5"
            />
            <polyline
              points={outsidePoints}
              fill="none"
              stroke="#a08360"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <polyline
              points={insidePoints}
              fill="none"
              stroke="#435c37"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <line
              x1={x(index)}
              x2={x(index)}
              y1="20"
              y2="220"
              stroke="#919e7d"
              strokeDasharray="3 4"
            />
            <circle cx={x(index)} cy={y(record.inside)} r="5" fill="#435c37" />
            <circle cx={x(index)} cy={y(record.outside)} r="4" fill="#a08360" />
            <text x="40" y="251">
              05:20
            </text>
            <text x="565" y="251">
              05:55
            </text>
          </svg>
          <label htmlFor="actual-record">
            측정 시각 <output htmlFor="actual-record">{record.time}</output>
          </label>
          <input
            id="actual-record"
            type="range"
            min="0"
            max="7"
            step="1"
            value={index}
            onChange={(event) => setIndex(Number(event.target.value))}
            aria-valuetext={`${record.time}, 내부 ${record.inside}도, 외부 ${record.outside}도`}
          />
        </div>
        <div className="record-detail">
          <span>9/14 · {record.time}</span>
          <div>
            <span>벌통 내부</span>
            <strong>
              {record.inside.toFixed(1)}
              <small>°C</small>
            </strong>
          </div>
          <div>
            <span>벌통 외부</span>
            <strong>
              {record.outside.toFixed(1)}
              <small>°C</small>
            </strong>
          </div>
          <p>
            이 구간의 내부 온도
            <br />
            <b>26.3–26.6°C</b>
          </p>
        </div>
      </div>
      <p className="performance-footnote">
        출처: 제공된 앱 캡처의 5분 간격 기록 8개. 외부 10–20°C 조건의 테스트
        사례와는 다른 측정 구간입니다. 원본에 보이지 않는 측정값은 추가하지
        않았습니다.
      </p>
    </section>
  );
}
