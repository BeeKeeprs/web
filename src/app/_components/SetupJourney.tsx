"use client";

import { useState } from "react";
import { ArrowRight, Check, Plug, Wifi, Smartphone } from "lucide-react";

const steps = [
  {
    title: "설치",
    subtitle: "우리 농장에 맞는 자리부터",
    text: "벌통의 형태, 출입구의 크기, 전원을 연결할 수 있는 위치를 확인하세요. 현장 조건에 맞춰 제품과 설치 위치를 정합니다.",
    checks: ["벌통 형태와 출입구 확인", "전원 공급 위치 확인"],
    icon: Plug,
  },
  {
    title: "연결",
    subtitle: "벌통과 휴대폰을 이어주세요",
    text: "기기에 전원을 공급하고 현장의 Wi-Fi에 연결합니다. 휴대폰 앱에서 기기를 등록하면 관리할 벌통과 연결할 수 있습니다.",
    checks: ["설치 위치의 Wi-Fi 확인", "휴대폰 앱에 기기 등록"],
    icon: Wifi,
  },
  {
    title: "확인",
    subtitle: "이제, 일상 속에서 살펴보세요",
    text: "앱에서 벌통의 상태와 변화 기록을 확인하세요. 현장을 점검할 때 참고하고, 필요한 순간에 출입구를 관리합니다.",
    checks: ["벌통의 환경과 기록 확인", "현장 상황에 맞춘 출입구 관리"],
    icon: Smartphone,
  },
];

export default function SetupJourney() {
  const [active, setActive] = useState(0);
  const current = steps[active];
  const Icon = current.icon;
  return (
    <div className="setup-journey">
      <div
        className="journey-controls"
        role="group"
        aria-label="설치 과정 탐색"
      >
        {steps.map((step, i) => (
          <button
            type="button"
            key={step.title}
            aria-pressed={active === i}
            aria-controls="journey-detail"
            onClick={() => setActive(i)}
          >
            <span>0{i + 1}</span>
            <strong>{step.title}</strong>
            <ArrowRight size={19} />
          </button>
        ))}
      </div>
      <div
        className="journey-detail"
        id="journey-detail"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="journey-icon">
          <Icon size={44} strokeWidth={1} />
        </div>
        <div className="journey-text" key={active}>
          <span className="journey-count">0{active + 1} / 03</span>
          <h3>{current.subtitle}</h3>
          <p>{current.text}</p>
          <ul>
            {current.checks.map((check) => (
              <li key={check}>
                <Check size={15} />
                {check}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="journey-bottom">
        <span>순서대로 눌러 준비 과정을 알아보세요.</span>
        {active < 2 ? (
          <button type="button" onClick={() => setActive(active + 1)}>
            다음 단계 <ArrowRight size={15} />
          </button>
        ) : (
          <a href="#contact">
            도입 문의하기 <ArrowRight size={15} />
          </a>
        )}
      </div>
    </div>
  );
}
