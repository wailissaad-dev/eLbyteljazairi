import { getServiceClient } from "@/lib/supabase/server";
import { defaultSettings, staticSiteData } from "@/data/site-default";
import type { CategoryId, Localized, Pack, Product, RoomItem, SiteData, SiteSettings, TableProduct } from "@/lib/types";

const loc = (ar?: string | null, fr?: string | null, en?: string | null): Localized => ({
  ar: ar ?? "",
  fr: fr ?? ar ?? "",
  en: en ?? ar ?? "",
});

const PACK_ICON: Record<string, string> = {
  "pack-essentiel": "Sofa",
  "pack-famille": "Armchair",
  "pack-premium": "Gem",
};

/** WhatsApp receiving number from settings (falls back to the static default). */
export async function getWhatsappPhone(): Promise<string> {
  const sb = getServiceClient();
  if (!sb) return defaultSettings.whatsappPhone;
  try {
    const { data } = await sb.from("settings").select("value").eq("key", "business").maybeSingle();
    const phone = (data?.value as { whatsappPhone?: string } | null)?.whatsappPhone;
    return phone || defaultSettings.whatsappPhone;
  } catch {
    return defaultSettings.whatsappPhone;
  }
}

/**
 * Reads the catalog + settings from Supabase. Returns null when Supabase isn't
 * configured or has no catalog, so callers fall back to the static site data.
 */
export async function getSiteData(): Promise<SiteData | null> {
  const sb = getServiceClient();
  if (!sb) return null;

  try {
    const [prodsRes, imgsRes, packsRes, itemsRes, settingsRes] = await Promise.all([
      sb.from("products").select("*").eq("active", true).order("sort_order", { ascending: true }),
      sb.from("product_images").select("*").order("sort_order", { ascending: true }),
      sb.from("packs").select("*").eq("active", true).order("sort_order", { ascending: true }),
      sb.from("pack_items").select("*").order("sort_order", { ascending: true }),
      sb.from("settings").select("*"),
    ]);

    const prods = prodsRes.data;
    if (!prods || prods.length === 0) return null;

    const imgByProduct = new Map<string, string[]>();
    for (const im of imgsRes.data ?? []) {
      const arr = imgByProduct.get(im.product_id) ?? [];
      arr.push(im.image_path);
      imgByProduct.set(im.product_id, arr);
    }

    const salons: Product[] = [];
    const tables: TableProduct[] = [];
    const rooms: RoomItem[] = [];
    const swatch: Record<string, string> = {};

    for (const r of prods) {
      const id: string = r.slug;
      const base: Product = {
        id,
        ref: r.ref_code ?? id,
        slug: r.slug,
        category: r.category as CategoryId,
        name: loc(r.name_ar, r.name_fr, r.name_en),
        color: loc(r.color_ar, r.color_fr, r.color_en),
        images: (imgByProduct.get(r.id) ?? []).map((src) => ({ src })),
        price: r.price != null ? Number(r.price) : undefined,
        status: r.status === "coming_soon" ? "coming_soon" : "available",
      };
      if (r.category === "tables") {
        tables.push({
          ...base,
          icon: r.icon ?? "Sofa",
          swatchHex: r.swatch_hex ?? "#c9973a",
          badge: r.badge_ar ? loc(r.badge_ar, r.badge_fr, r.badge_en) : undefined,
        });
      } else if (r.category === "rooms") {
        rooms.push({
          id,
          icon: r.icon ?? "BedDouble",
          name: base.name,
          desc: loc(r.description_ar, r.description_fr, r.description_en),
        });
      } else {
        salons.push(base);
        if (r.swatch_hex) swatch[id] = r.swatch_hex;
      }
    }

    const itemsByPack = new Map<string, { label_ar?: string; label_fr?: string; label_en?: string }[]>();
    for (const it of itemsRes.data ?? []) {
      const arr = itemsByPack.get(it.pack_id) ?? [];
      arr.push(it);
      itemsByPack.set(it.pack_id, arr);
    }

    const packs: Pack[] = (packsRes.data ?? []).map((p) => {
      const items = (itemsByPack.get(p.id) ?? []).map((it) => ({ label: loc(it.label_ar, it.label_fr, it.label_en) }));
      const name = loc(p.name_ar, p.name_fr, p.name_en);
      const join = (k: keyof Localized) => items.map((i) => i.label[k]).join(" + ");
      return {
        id: p.slug,
        name,
        subtitle: { ar: p.subtitle ?? "", fr: p.subtitle ?? "", en: p.subtitle ?? "" },
        icon: PACK_ICON[p.slug] ?? "Gem",
        items,
        highlight: loc(p.highlight_ar, p.highlight_fr, p.highlight_en),
        featured: Boolean(p.featured),
        badge: p.badge_ar ? loc(p.badge_ar, p.badge_fr, p.badge_en) : undefined,
        orderLabel: {
          ar: `${name.ar} (${join("ar")})`,
          fr: `${name.fr} (${join("fr")})`,
          en: `${name.en} (${join("en")})`,
        },
      };
    });

    const bizRow = (settingsRes.data ?? []).find((s) => s.key === "business")?.value as Partial<SiteSettings> | undefined;
    const settings: SiteSettings = bizRow ? { ...defaultSettings, ...bizRow } : defaultSettings;

    return {
      salons: salons.length ? salons : staticSiteData.salons,
      tables: tables.length ? tables : staticSiteData.tables,
      rooms: rooms.length ? rooms : staticSiteData.rooms,
      swatch: Object.keys(swatch).length ? swatch : staticSiteData.swatch,
      packs: packs.length ? packs : staticSiteData.packs,
      settings,
    };
  } catch {
    return null;
  }
}
