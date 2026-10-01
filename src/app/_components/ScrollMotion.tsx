"use client";

import { useEffect } from "react";

export default function ScrollMotion() {
  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches || !('IntersectionObserver' in window)) return;
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    for (const item of items) {
      if (item.getBoundingClientRect().top > innerHeight * .85) {
        item.classList.add("reveal-ready");
        observer.observe(item);
      }
    }
    const ecosystem = document.querySelector<HTMLElement>(".ecosystem-section");
    const connectObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        ecosystem?.classList.add("is-connected");
        connectObserver.disconnect();
      }
    }, { threshold: 0.15 });
    if (ecosystem) connectObserver.observe(ecosystem);
    return () => { observer.disconnect(); connectObserver.disconnect(); items.forEach((item) => item.classList.remove("reveal-ready")); };
  }, []);
  return null;
}
