"use client";

import { useEffect, useRef } from "react";

export default function AirRipple() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const surface = host?.parentElement;
    if (!host || !surface) return;
    let controller: { dispose: () => void } | undefined, cancelled = false;
    import("./air-ripple-scene").then(({ createAirRippleScene }) => {
      if (!cancelled) controller = createAirRippleScene(host, surface);
    });
    return () => { cancelled = true; controller?.dispose(); };
  }, []);

  return <div className="air-ripple" ref={hostRef} aria-hidden="true" />;
}
