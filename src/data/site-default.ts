import { products, tables, rooms, swatch, packs } from "./catalog";
import { business } from "@/lib/config";
import type { SiteData, SiteSettings, TableProduct } from "@/lib/types";

/** Business settings used when Supabase isn't configured. */
export const defaultSettings: SiteSettings = {
  whatsappPhone: business.whatsappPhone,
  phones: business.phones.map((p) => ({ display: p.display, tel: p.tel })),
  email: business.email,
  instagram: business.social.instagram,
  facebook: business.social.facebook,
  tiktok: business.social.tiktok,
  addressLocality: business.address.locality,
  addressRegion: business.address.region,
  mapsUrl: business.address.mapsUrl,
};

/** The built-in catalog, shaped exactly like what the provider serves. */
export const staticSiteData: SiteData = {
  salons: products,
  tables: tables as TableProduct[],
  rooms,
  swatch,
  packs,
  settings: defaultSettings,
};
