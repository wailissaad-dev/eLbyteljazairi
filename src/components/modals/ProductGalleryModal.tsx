"use client";

import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Zap, Tag } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { useStore } from "@/store/useStore";
import { useT } from "@/lib/useT";
import { submitPriceRequest } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useSiteData } from "@/components/providers/SiteDataProvider";

export function ProductGalleryModal() {
  const { t, L, locale, dir } = useT();
  const { salons, tables } = useSiteData();
  const gallery = useStore((s) => s.gallery);
  const close = useStore((s) => s.closeGallery);
  const step = useStore((s) => s.galleryStep);
  const setIndex = useStore((s) => s.setGalleryIndex);
  const orderDirect = useStore((s) => s.orderDirect);
  const [pricing, setPricing] = useState(false);

  const product = [...salons, ...tables].find((p) => p.id === gallery.productId);
  const total = product?.images.length ?? 0;

  useEffect(() => {
    if (!gallery.open || total <= 1) return;
    // arrow keys follow reading direction: "forward" is left in RTL, right in LTR
    const forwardKey = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const backKey = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === forwardKey) step(1);
      if (e.key === backKey) step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [gallery.open, total, step, dir]);

  if (!product || total === 0) return null;

  const idx = ((gallery.index % total) + total) % total;
  const current = product.images[idx];
  const multi = total > 1;

  const handlePrice = async () => {
    setPricing(true);
    const res = await submitPriceRequest({
      name: L(product.name),
      color: L(product.color),
      ref: product.ref,
      productSlug: product.slug,
      locale,
    });
    setPricing(false);
    window.open(res.whatsappUrl, "_blank", "noopener");
  };

  return (
    <Overlay open={gallery.open} onClose={close} label={L(product.name)}>
      <div className="animate-panel glass flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl">
        <header className="flex items-center justify-between gap-3 border-b border-gold/15 px-5 py-3">
          <div className="min-w-0">
            <h2 className="truncate font-display text-lg font-bold text-gold">{L(product.name)}</h2>
            <p className="font-label text-xs text-ink-secondary">
              {multi ? `${product.ref} · ${idx + 1} ${t("of")} ${total}` : product.ref}
              {product.color ? ` • ${L(product.color)}` : ""}
            </p>
            {product.price ? (
              <p className="mt-0.5 font-display text-lg font-bold text-gold">{formatPrice(product.price, locale)}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={t("close")}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/20 text-ink-secondary transition-colors hover:text-gold"
          >
            <X size={18} />
          </button>
        </header>

        <div className="relative bg-black/40">
          <div className="aspect-[4/3] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.src} alt={current.caption ? L(current.caption) : L(product.name)} className="h-full w-full object-contain" />
          </div>
          {multi && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={t("img_prev")}
                className="absolute end-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:text-gold-light"
              >
                <ChevronRight size={20} />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={t("img_next")}
                className="absolute start-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:text-gold-light"
              >
                <ChevronLeft size={20} />
              </button>
            </>
          )}
        </div>

        {multi && (
          <div className="flex gap-2 overflow-x-auto px-5 py-3">
            {product.images.map((im, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`${i + 1} ${t("of")} ${total}`}
                aria-current={i === idx || undefined}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-opacity ${
                  i === idx ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <footer className="flex flex-wrap gap-2 border-t border-gold/15 p-4">
          <button
            type="button"
            onClick={() => {
              close();
              orderDirect({ name: product.name, color: product.color, ref: product.ref, slug: product.slug, qty: 1 });
            }}
            className="btn-gold inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-label text-sm"
            style={{ flexBasis: "180px" }}
          >
            <Zap size={18} />
            {t("btn_order")}
          </button>
          <button
            type="button"
            onClick={handlePrice}
            disabled={pricing}
            className="btn-ghost inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-label text-sm disabled:opacity-60"
            style={{ flexBasis: "180px" }}
          >
            <Tag size={18} />
            {pricing ? t("f_sending") : t("btn_price")}
          </button>
        </footer>
      </div>
    </Overlay>
  );
}
