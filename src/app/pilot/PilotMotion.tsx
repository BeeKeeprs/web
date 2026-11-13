"use client";

import { useEffect } from "react";

// Soft one-time reveal for blocks marked data-pilot-reveal.
export default function PilotMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".pilot-page");
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    root.classList.add("pilot-motion-ready");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("pilot-in-view");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    root.querySelectorAll<HTMLElement>("[data-pilot-reveal]").forEach((element) => observer.observe(element));
    return () => { observer.disconnect(); root.classList.remove("pilot-motion-ready"); };
  }, []);
  return null;
}
