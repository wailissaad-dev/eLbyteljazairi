"use client";

import { useEffect } from "react";
import { useStore, type ThemePref } from "@/store/useStore";

/** Applies the saved theme on mount and live-tracks the OS setting while in "system" mode. */
export function ThemeBoot() {
  const setTheme = useStore((s) => s.setTheme);

  useEffect(() => {
    let pref: ThemePref = "system";
    try {
      const v = localStorage.getItem("theme");
      if (v === "light" || v === "dark" || v === "system") pref = v;
    } catch {
      /* ignore */
    }
    setTheme(pref);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (useStore.getState().theme === "system") setTheme("system");
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [setTheme]);

  return null;
}
