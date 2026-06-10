"use client";

import { useRef } from "react";

interface Props {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

/** Subtle cursor-follow ("magnetic") effect; disabled on touch and reduced-motion. */
export function Magnetic({ children, strength = 0.25, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <span ref={ref} onMouseMove={onMove} onMouseLeave={reset} className={`magnetic ${className}`}>
      {children}
    </span>
  );
}
