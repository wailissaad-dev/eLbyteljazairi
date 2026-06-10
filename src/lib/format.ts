import type { Locale } from "./types";

/** Formats a DZD amount like "83.000 دج" (ar) / "83 000 DA" (fr/en). */
export function formatPrice(value: number, locale: Locale): string {
  const grouped = Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, locale === "ar" ? "." : " ");
  return locale === "ar" ? `${grouped} دج` : `${grouped} DA`;
}

/** Plain Arabic price for WhatsApp messages (read by the shop). */
export function formatPriceAr(value: number): string {
  const grouped = Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${grouped} دج`;
}
