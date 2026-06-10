"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

/** Counts up to `value` once it scrolls into view (respects reduced motion). */
export function CountUp({ value, prefix = "", suffix = "", duration = 1400, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            const start = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - start) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setN(Math.round(value * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {n}
      {suffix}
    </span>
  );
}
