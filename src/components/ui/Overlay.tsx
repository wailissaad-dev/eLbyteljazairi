"use client";

import { useEffect, useRef } from "react";

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  variant?: "center" | "drawer";
  label?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Overlay({ open, onClose, children, variant = "center", label }: OverlayProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    const returnTo = document.activeElement as HTMLElement | null;

    const focusables = () =>
      root
        ? Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
            (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement
          )
        : [];

    // move focus inside the dialog (next frame so children are mounted)
    const focusTimer = requestAnimationFrame(() => {
      const els = focusables();
      (els[0] ?? root)?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const els = focusables();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === root)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      returnTo?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`animate-overlay fixed inset-0 z-[100] flex bg-black/75 backdrop-blur-sm ${
        variant === "center" ? "items-center justify-center p-4" : "justify-end"
      }`}
    >
      {children}
    </div>
  );
}
