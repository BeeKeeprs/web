"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HeaderAppearance() {
  const pathname = usePathname();
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = document.querySelector<HTMLElement>(".hero-story-stage");
      const rect = hero?.getBoundingClientRect();
      // The opened recruitment banner is paper-coloured; once it sits under the header, the header follows it instead of the dark photo.
      const banner = hero?.querySelector<HTMLElement>(".home-pilot-banner") ?? null;
      const bannerBox = banner?.getBoundingClientRect();
      const overBanner = !!banner && !!bannerBox && banner.classList.contains("is-expanded") &&
        bannerBox.top <= header.offsetHeight + 1 && bannerBox.bottom > header.offsetHeight;
      const atHero = !!rect && rect.top <= header.offsetHeight + 1 && rect.bottom > header.offsetHeight && !overBanner;
      const atBottom = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      const background = atHero && hero
        ? getComputedStyle(hero).getPropertyValue("--hero-bg-top").trim() || "#263d34"
        : getComputedStyle(document.querySelector(".site-footer") || document.body).backgroundColor;
      // Dark sections marked data-header-dark tint the header to match while they sit under it.
      const line = header.offsetHeight;
      const darkSection = !atHero && Array.from(document.querySelectorAll<HTMLElement>("[data-header-dark]")).find(section => {
        const box = section.getBoundingClientRect();
        return box.top <= line + 1 && box.bottom > line;
      });
      header.classList.toggle("is-blended", atHero || atBottom || !!darkSection || overBanner);
      header.classList.toggle("is-on-dark", (atHero && !hero?.classList.contains("is-light-backdrop")) || !!darkSection);
      const surface = overBanner && banner ? getComputedStyle(banner).backgroundColor
        : darkSection ? getComputedStyle(darkSection).backgroundColor : background;
      header.style.setProperty("--header-surface", surface);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new MutationObserver(schedule);
    const track = document.querySelector("[data-scroll-story]");
    if (track) observer.observe(track, { attributes: true, attributeFilter: ["style"] });
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      header.classList.remove("is-blended", "is-on-dark");
      header.style.removeProperty("--header-surface");
    };
  }, [pathname]);
  return null;
}
