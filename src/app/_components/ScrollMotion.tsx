"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const textItems = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-text]:not(.hero-story-title)"));
    const storyTrack = document.querySelector<HTMLElement>("[data-scroll-story]");
    const storyStage = storyTrack?.querySelector<HTMLElement>(".hero-story-stage");
    const pilotBanner = storyStage?.querySelector<HTMLElement>(".home-pilot-banner");
    const storyShade = storyStage?.querySelector<HTMLElement>(".hero-story-shade");
    let shadeOpacity = -1;
    let pilotBannerExpanded = false;
    let pilotExpandTimer: number | null = null;
    let previousScrollY = window.scrollY;
    let scrollingUp = false;
    let storyFrame = 0;
    const updateStory = () => {
      storyFrame = 0;
      if (!storyTrack || !storyStage) return;
      const scrollDistance = Math.max(1, storyTrack.offsetHeight - storyStage.offsetHeight);
      const trackRect = storyTrack.getBoundingClientRect();
      const rawProgress = -trackRect.top / scrollDistance;
      const progress = Math.min(1, Math.max(0, rawProgress));
      const scrollDelta = window.scrollY - previousScrollY;
      if (Math.abs(scrollDelta) > 1) scrollingUp = scrollDelta < 0;
      previousScrollY = window.scrollY;
      const isMobile = window.matchMedia("(max-width: 760px)").matches;
      const stageRect = storyStage.getBoundingClientRect();
      const heroVisible = stageRect.bottom > 0 && stageRect.top < window.innerHeight;
      // Desktop: the banner opens 20% into the pinned story and folds back only near the top,
      // so the stop just under the hero looks the same whichever way you arrive.
      const shouldCollapse = isMobile
        ? (scrollingUp && heroVisible) || window.scrollY <= 8
        : progress < 0.15;
      if (shouldCollapse) {
        pilotBannerExpanded = false;
        if (pilotExpandTimer !== null) window.clearTimeout(pilotExpandTimer);
        pilotExpandTimer = null;
        pilotBanner?.classList.remove("is-expanded");
      } else {
        const expansionPoint = !scrollingUp && (isMobile ? window.scrollY >= 48 : progress >= 0.2);
        if (expansionPoint && !pilotBannerExpanded && pilotExpandTimer === null) {
          pilotExpandTimer = window.setTimeout(() => {
            pilotBannerExpanded = true;
            pilotBanner?.classList.add("is-expanded");
            pilotExpandTimer = null;
          }, 30);
        } else if (!expansionPoint && !pilotBannerExpanded && pilotExpandTimer !== null) {
          window.clearTimeout(pilotExpandTimer);
          pilotExpandTimer = null;
        }
      }
      pilotBanner?.classList.toggle("is-expanded", pilotBannerExpanded);
      // One element's opacity instead of a custom property on the track: no subtree-wide style recalculation per scroll frame.
      const nextShade = Math.round(Math.min(1, progress * 2) * 200) / 200;
      if (storyShade && nextShade !== shadeOpacity) { shadeOpacity = nextShade; storyShade.style.opacity = String(nextShade); }

    };
    const requestStoryUpdate = () => {
      if (!storyFrame) storyFrame = requestAnimationFrame(updateStory);
    };
    if (motionPreference.matches) {
      textItems.forEach((item) => item.classList.add("is-text-visible"));
      storyStage?.querySelector<HTMLElement>(".hero-story-title")?.classList.add("is-text-visible");
      updateStory();
      window.addEventListener("scroll", requestStoryUpdate, { passive: true });
      window.addEventListener("resize", requestStoryUpdate);
      return () => { window.removeEventListener("scroll", requestStoryUpdate); window.removeEventListener("resize", requestStoryUpdate); if (storyFrame) cancelAnimationFrame(storyFrame); if (pilotExpandTimer !== null) window.clearTimeout(pilotExpandTimer); };
    }
    const supportsIntersectionObserver = typeof IntersectionObserver !== "undefined";
    if (!supportsIntersectionObserver) {
      textItems.forEach((item) => item.classList.add("is-text-visible"));
      storyStage?.querySelector<HTMLElement>(".hero-story-title")?.classList.add("is-text-visible");
      updateStory();
      window.addEventListener("scroll", requestStoryUpdate, { passive: true });
      window.addEventListener("resize", requestStoryUpdate);
      return () => { window.removeEventListener("scroll", requestStoryUpdate); window.removeEventListener("resize", requestStoryUpdate); if (storyFrame) cancelAnimationFrame(storyFrame); if (pilotExpandTimer !== null) window.clearTimeout(pilotExpandTimer); };
    }
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
    const textObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-text-visible");
        textObserver.unobserve(entry.target);
      }
    }, { threshold: 0.25, rootMargin: "0px 0px -10% 0px" });
    textItems.forEach((item) => textObserver.observe(item));
    storyStage?.querySelector<HTMLElement>(".hero-story-title")?.classList.add("is-text-visible");
    updateStory();
    window.addEventListener("scroll", requestStoryUpdate, { passive: true });
    window.addEventListener("resize", requestStoryUpdate);
    const ecosystem = document.querySelector<HTMLElement>(".ecosystem-section");
    const connectObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        ecosystem?.classList.add("is-connected");
        connectObserver.disconnect();
      }
    }, { threshold: 0.15 });
    if (ecosystem) connectObserver.observe(ecosystem);
    return () => { observer.disconnect(); textObserver.disconnect(); connectObserver.disconnect(); window.removeEventListener("scroll", requestStoryUpdate); window.removeEventListener("resize", requestStoryUpdate); if (storyFrame) cancelAnimationFrame(storyFrame); if (pilotExpandTimer !== null) window.clearTimeout(pilotExpandTimer); items.forEach((item) => item.classList.remove("reveal-ready")); };
  }, [pathname]);
  return null;
}
