"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import type { Locale } from "@/lib/types";

/** Reads the saved language once on mount and applies dir/lang on <html>. */
export function LocaleBoot() {
  const setLocale = useStore((s) => s.setLocale);
  useEffect(() => {
    let saved: Locale = "ar";
    try {
      const v = localStorage.getItem("site_lang");
      if (v === "ar" || v === "fr" || v === "en") saved = v;
    } catch {
      /* ignore */
    }
    setLocale(saved);
  }, [setLocale]);
  return null;
}
