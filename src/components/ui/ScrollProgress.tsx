"use client";

import { useEffect, useRef } from "react";

/** Slim gold bar at the very top that tracks page scroll progress. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0;
      el.style.setProperty("--p", String(p));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return <div ref={ref} className="scroll-progress" aria-hidden />;
}
