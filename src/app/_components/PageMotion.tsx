"use client";

import { useEffect, useRef } from "react";

export default function PageMotion() {
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - innerHeight;
      progressRef.current?.style.setProperty(
        "transform",
        `scaleX(${available > 0 ? Math.min(1, Math.max(0, scrollY / available)) : 0})`,
      );
      frame = 0;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);
    schedule();
    const targets = document.querySelectorAll<HTMLElement>(
      ".product-row, .section-heading, .faq-section, .contact-section",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-pending");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => {
        if (target.getBoundingClientRect().top > innerHeight) {
          target.classList.add("reveal-target", "reveal-pending");
          observer.observe(target);
        }
      });
    }
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      targets.forEach((target) =>
        target.classList.remove("reveal-pending", "reveal-target"),
      );
    };
  }, []);
  return (
    <div className="reading-progress" ref={progressRef} aria-hidden="true" />
  );
}
