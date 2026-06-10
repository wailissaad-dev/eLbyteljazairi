"use client";

import { Sun, Moon } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useT } from "@/lib/useT";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const resolved = useStore((s) => s.resolvedTheme);
  const toggle = useStore((s) => s.toggleTheme);
  const { locale } = useT();
  const label =
    locale === "fr" ? "Changer le thème" : locale === "en" ? "Toggle theme" : "تبديل المظهر";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-ink-primary transition-colors hover:border-gold/60 hover:text-gold ${className}`}
    >
      {resolved === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
