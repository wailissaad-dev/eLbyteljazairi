"use client";

import { useStore } from "@/store/useStore";
import { translator, dirFor } from "@/lib/i18n";
import type { Localized } from "@/lib/types";

export function useT() {
  const locale = useStore((s) => s.locale);
  return {
    t: translator(locale),
    locale,
    dir: dirFor(locale),
    /** resolve a Localized value to the current language */
    L: (v: Localized) => v[locale] ?? v.ar,
  };
}
