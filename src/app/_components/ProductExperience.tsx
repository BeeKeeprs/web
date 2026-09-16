"use client";

import { useState } from "react";
import { MousePointer2 } from "lucide-react";

export function GateExperience() {
  const [open, setOpen] = useState(true);
  return (
    <div className="experience-panel gate-experience" data-open={open}>
      <div className="experience-label">
        <span>BEE GATE</span>
        <span>체험용 시뮬레이션</span>
      </div>
      <div className="gate-stage">
        <div className="gate-model" aria-hidden="true">
          <div className="gate-model-top" />
          <div className="gate-window-row">
            {Array.from({ length: 7 }, (_, i) => (
              <span className="gate-window" key={i}>
                <span className="gate-shutter" />
              </span>
            ))}
          </div>
          <div className="gate-model-base" />
        </div>
        <div className="gate-state">
          <span className="state-dot" />
          <span role="status">출입구 {open ? "열림" : "닫힘"}</span>
        </div>
      </div>
      <div
        className="gate-controls"
        role="group"
        aria-label="출입구 시뮬레이션"
      >
        <button
          type="button"
          aria-pressed={!open}
          onClick={() => setOpen(false)}
        >
          닫아보기
        </button>
        <button type="button" aria-pressed={open} onClick={() => setOpen(true)}>
          열어보기
        </button>
      </div>
      <p className="experience-note">
        <MousePointer2 size={14} />
        {open
          ? "닫아보기를 눌러 움직임을 확인하세요."
          : "다시 열어 출입구의 변화를 살펴보세요."}
      </p>
    </div>
  );
}
