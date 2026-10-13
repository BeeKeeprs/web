"use client";

import { useEffect } from "react";

export default function PilotMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".pilot-page");
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    root.classList.add("pilot-motion-ready");
    const animated = Array.from(root.querySelectorAll<HTMLElement>("[data-pilot-reveal]"));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("pilot-in-view");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    animated.forEach((element) => observer.observe(element));

    let frame = 0;
    const updateScroll = () => {
      frame = 0;
      const pageTop = root.getBoundingClientRect().top + window.scrollY;
      const maxScroll = Math.max(root.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, (window.scrollY - pageTop) / maxScroll));
      root.style.setProperty("--pilot-scroll-progress", `${progress * 100}%`);

      const hero = root.querySelector<HTMLElement>(".pilot-hero-visual");
      const flower = root.querySelector<HTMLElement>(".pilot-flower-photo");
      if (hero) {
        const y = Math.min(65, Math.max(0, window.scrollY - pageTop) * 0.12);
        hero.style.setProperty("--pilot-hero-shift", `${y}px`);
      }
      if (flower) {
        const position = flower.getBoundingClientRect();
        const offset = Math.min(55, Math.max(-55, (window.innerHeight / 2 - position.top - position.height / 2) * 0.08));
        flower.style.setProperty("--pilot-flower-shift", `${offset}px`);
      }
    };
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(updateScroll); };
    updateScroll();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove("pilot-motion-ready");
      root.style.removeProperty("--pilot-scroll-progress");
    };
  }, []);
  return null;
}
