"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 1, unit: "건", label: "특허" },
  { value: 3, unit: "라운드", label: "모창 1기" },
];

export default function AboutStats() {
  const root = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setProgress(1); return; }
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / 1100, 1);
        setProgress(1 - Math.pow(1 - t, 3));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  return (
    <div className="about-stats" ref={root}>
      {stats.map((stat) => (
        <div className="about-stat" key={stat.label}>
          <span className="about-stat-label">{stat.label}</span>
          <strong aria-label={`${stat.value}${stat.unit}`}>
            <span aria-hidden="true">{Math.round(stat.value * progress)}</span>
            <small aria-hidden="true">{stat.unit}</small>
          </strong>
        </div>
      ))}
    </div>
  );
}
