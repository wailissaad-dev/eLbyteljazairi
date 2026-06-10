"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useStore } from "@/store/useStore";
import { LOCALES, LOCALE_LABEL } from "@/lib/i18n";

export function LanguageSwitcher() {
  const locale = useStore((s) => s.locale);
  const setLocale = useStore((s) => s.setLocale);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1.5 text-sm text-ink-secondary transition-colors hover:text-gold-light hover:border-gold/60"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe size={16} />
        <span className="font-label">{LOCALE_LABEL[locale]}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          className="glass absolute end-0 mt-2 w-40 overflow-hidden rounded-xl py-1 text-sm shadow-2xl z-50"
          role="listbox"
        >
          {LOCALES.map((l) => (
            <li key={l}>
              <button
                type="button"
                onClick={() => {
                  setLocale(l);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2 text-start transition-colors hover:bg-gold/10 ${
                  l === locale ? "text-gold-light" : "text-ink-secondary"
                }`}
                role="option"
                aria-selected={l === locale}
              >
                <span className="font-label">{LOCALE_LABEL[l]}</span>
                {l === locale && <Check size={15} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
