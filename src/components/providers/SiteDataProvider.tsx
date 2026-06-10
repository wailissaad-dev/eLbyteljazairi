"use client";

import { createContext, useContext } from "react";
import type { SiteData } from "@/lib/types";
import { staticSiteData } from "@/data/site-default";

const SiteDataContext = createContext<SiteData>(staticSiteData);

/** Seeds the public UI with catalog + settings (from Supabase or the static fallback). */
export function SiteDataProvider({ data, children }: { data: SiteData | null; children: React.ReactNode }) {
  return <SiteDataContext.Provider value={data ?? staticSiteData}>{children}</SiteDataContext.Provider>;
}

export const useSiteData = (): SiteData => useContext(SiteDataContext);
