"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { dateLocale } from "@/lib/i18n";

export function LiveClock({ className = "" }: { className?: string }) {
  const locale = useStore((s) => s.locale);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null; // avoid SSR/client hydration mismatch

  const loc = dateLocale[locale] || "ar-DZ";
  let text = "";
  try {
    const d = now.toLocaleDateString(loc, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const t = now.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit", hour12: false });
    text = `${d} • ${t}`;
  } catch {
    text = now.toLocaleString();
  }

  return <span className={className}>{text}</span>;
}
