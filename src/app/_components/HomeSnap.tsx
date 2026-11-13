"use client";

import { useEffect } from "react";

const SNAP = {
  minMs: 240,
  maxMs: 420,
  msPerPx: 0.16,
  tolerancePx: 3,
  bannerOverlapPx: 2,
  bannerRiseProgress: 0.26,
  exitZonePx: 100,
  gestureGapMs: 140,
  tailMs: 700,
  tailLongMs: 1500,
  tailDeltaPx: 12,
};
// Any section marked data-snap-stop becomes a stop, in page order (centred in the screen unless data-snap-align is "start" or "end"); the first one lands under the recruitment banner.
const STOP_SELECTOR = "[data-snap-stop]";

/**
 * Home only. The stops are: top of the page, then sections 1, 2 and 3.
 * Between them, the slightest wheel or key press glides to the next stop in that direction.
 * Past the last stop the page scrolls normally.
 */
export default function HomeSnap() {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 761px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let animating = false;
    let snapDir = 0;
    let snapStartAt = 0;
    let lastWheelAt = 0;
    let lastAbs = 0;
    let bannerCache = { key: "", height: 0 };

    const enabled = () => desktop.matches && !reducedMotion.matches;
    const root = document.documentElement;
    let guardTimer = 0;
    const cancel = () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(guardTimer);
      frame = 0;
      animating = false;
      root.classList.remove("is-snapping");
    };

    // Height of the recruitment banner once opened, measured from a hidden clone so it is right even while the banner is folded.
    const openBannerHeight = () => {
      const key = `${window.innerWidth}x${window.innerHeight}`;
      if (bannerCache.key === key) return bannerCache.height;
      const banner = document.querySelector<HTMLElement>(".home-pilot-banner");
      if (!banner?.parentElement) return 0;
      const clone = banner.cloneNode(true) as HTMLElement;
      clone.classList.add("is-expanded");
      clone.setAttribute("aria-hidden", "true");
      clone.style.cssText = "position:absolute;left:0;right:0;top:0;visibility:hidden;pointer-events:none;transition:none";
      clone.querySelectorAll<HTMLElement>("*").forEach(element => { element.style.transition = "none"; });
      banner.parentElement.appendChild(clone);
      const height = clone.getBoundingClientRect().height;
      clone.remove();
      bannerCache = { key, height };
      return height;
    };

    // CSS sizes section 1 to the screen minus this banner, so publish the measured height as a variable.
    const syncBannerVar = (fresh = false) => {
      if (fresh) bannerCache = { key: "", height: 0 };
      const height = openBannerHeight();
      if (height) root.style.setProperty("--home-banner-open", `${Math.round(height)}px`);
    };
    syncBannerVar();
    void document.fonts?.ready.then(() => syncBannerVar(true));

    const stops = () => {
      const header = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 58;
      const available = window.innerHeight - header;
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const list = [0];
      // Stop just under the top: the hero stays pinned and the recruitment banner has risen.
      const track = document.querySelector<HTMLElement>("[data-scroll-story]");
      const stage = track?.querySelector<HTMLElement>(".hero-story-stage");
      if (track && stage) {
        const distance = Math.max(1, track.offsetHeight - stage.offsetHeight);
        list.push(track.getBoundingClientRect().top + window.scrollY + distance * SNAP.bannerRiseProgress);
      }
      document.querySelectorAll<HTMLElement>(STOP_SELECTOR).forEach(section => {
        const box = section.getBoundingClientRect();
        const align = section.dataset.snapAlign;
        const alignment = align === "start" ? Number(section.dataset.snapGap ?? 0) : align === "end" ? available - box.height : Math.max(0, (available - box.height) / 2);
        list.push(Math.max(0, Math.min(maxY, box.top + window.scrollY - header - alignment)));
      });
      return list.sort((a, b) => a - b).filter((value, index, all) => index === 0 || value - all[index - 1] > 8);
    };

    const nextStop = (direction: number) => {
      const list = stops();
      const y = window.scrollY;
      if (y > list[list.length - 1] + SNAP.exitZonePx) return undefined;
      return direction > 0
        ? list.find(stop => stop > y + SNAP.tolerancePx)
        : [...list].reverse().find(stop => stop < y - SNAP.tolerancePx);
    };

    const glide = (target: number) => {
      const from = window.scrollY;
      const distance = target - from;
      const duration = Math.min(SNAP.maxMs, SNAP.minMs + Math.abs(distance) * SNAP.msPerPx);
      const started = performance.now();
      animating = true;
      root.classList.add("is-snapping");
      const finish = () => {
        window.clearTimeout(guard);
        window.scrollTo({ top: target, behavior: "instant" });
        animating = false;
        frame = 0;
        root.classList.remove("is-snapping");
      };
      // If frames stall (busy page, background tab) the glide still ends on time at the exact stop.
      const guard = window.setTimeout(() => { if (animating) { cancelAnimationFrame(frame); finish(); } }, duration + 250);
      guardTimer = guard;
      const tick = (now: number) => {
        // rAF timestamps can precede `started` by a few ms; a negative progress would push the first frame backwards.
        const progress = Math.min(1, Math.max(0, (now - started) / duration));
        // Fast pull-in, soft settle. Instant writes keep the document's CSS smooth-scroll out of the way.
        window.scrollTo({ top: from + distance * (1 - Math.pow(1 - progress, 4)), behavior: "instant" });
        if (progress < 1) frame = requestAnimationFrame(tick);
        else finish();
      };
      frame = requestAnimationFrame(tick);
    };

    const trigger = (direction: number, now: number) => {
      cancel();
      const target = nextStop(direction);
      if (target === undefined) { snapDir = 0; return false; }
      snapDir = direction;
      snapStartAt = now;
      glide(target);
      return true;
    };

    const onWheel = (event: WheelEvent) => {
      if (!enabled() || event.ctrlKey || event.deltaY === 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const direction = Math.sign(event.deltaY);
      const abs = Math.abs(event.deltaY);
      const now = performance.now();
      const continuing = now - lastWheelAt < SNAP.gestureGapMs;
      const surge = abs > lastAbs * 1.6 + 6;
      lastWheelAt = now;
      lastAbs = abs;
      const since = now - snapStartAt;
      // The same flick's fading inertia is absorbed, so one swipe moves exactly one stop.
      const inertia = snapDir === direction && continuing && !surge &&
        (since < SNAP.tailMs || (abs < SNAP.tailDeltaPx && since < SNAP.tailLongMs));
      if (inertia) { event.preventDefault(); return; }
      if (trigger(direction, now)) event.preventDefault();
    };

    const onKey = (event: KeyboardEvent) => {
      if (!enabled() || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target?.closest("input,textarea,select,[contenteditable]")) return;
      if (event.key === "Home" || event.key === "End") { cancel(); return; }
      let direction = 0;
      if (event.key === "ArrowDown" || event.key === "PageDown") direction = 1;
      else if (event.key === "ArrowUp" || event.key === "PageUp") direction = -1;
      else if (event.key === " " && !target?.closest("button,a,summary")) direction = event.shiftKey ? -1 : 1;
      if (!direction) return;
      const now = performance.now();
      if (event.repeat && (animating || now - snapStartAt < SNAP.tailMs)) { event.preventDefault(); return; }
      if (trigger(direction, now)) event.preventDefault();
    };

    const release = () => cancel();
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", release, { passive: true });
    window.addEventListener("pointerdown", release, { passive: true });
    window.addEventListener("resize", release);
    const onResize = () => syncBannerVar();
    window.addEventListener("resize", onResize);
    return () => {
      cancel();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", release);
      window.removeEventListener("pointerdown", release);
      window.removeEventListener("resize", release);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return null;
}
