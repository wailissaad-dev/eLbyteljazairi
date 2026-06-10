"use client";

import { useState } from "react";
import { Zap, Plus, Tag, ZoomIn, Check } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useT } from "@/lib/useT";
import { submitPriceRequest } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useTilt } from "@/lib/useTilt";
import { DynIcon } from "@/components/ui/Icon";
import type { Localized, Product } from "@/lib/types";

interface Props {
  product: Product;
  swatchHex?: string;
  icon?: string;
  tileBg?: string;
  badge?: Localized;
}

export function ProductCard({ product, swatchHex, icon, badge }: Props) {
  const { t, L, locale } = useT();
  const addToCart = useStore((s) => s.addToCart);
  const orderDirect = useStore((s) => s.orderDirect);
  const showToast = useStore((s) => s.showToast);
  const openGallery = useStore((s) => s.openGallery);
  const [added, setAdded] = useState(false);
  const [pricing, setPricing] = useState(false);
  const tilt = useTilt();

  const img = product.images[0]?.src;

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1300);
    const name = L(product.name);
    const msg =
      locale === "fr" ? `« ${name} » ajouté au panier` : locale === "en" ? `"${name}" added to cart` : `تمت إضافة "${name}" للسلة`;
    showToast(msg);
  };

  const handleOrder = () =>
    orderDirect({ name: product.name, color: product.color, ref: product.ref, slug: product.slug, qty: 1, price: product.price });

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
    <article
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="tilt-card relative flex h-full flex-col overflow-hidden rounded-xl border border-gold/15 border-t-[3px] border-t-gold bg-bg-card"
    >
      {/* media */}
      {img ? (
        <button
          type="button"
          onClick={() => openGallery(product.id)}
          className="zoomable group relative block aspect-[4/3] overflow-hidden bg-bg-secondary text-start"
          aria-label={L(product.name)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt={L(product.name)} loading="lazy" className="h-full w-full object-cover" />
          <span className="sheen" aria-hidden />
          <span className="absolute bottom-3 start-3 rounded-md bg-black/55 px-2 py-0.5 font-label text-xs text-gold-light backdrop-blur">
            {product.ref}
          </span>
          <span className="absolute end-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            <ZoomIn size={16} />
          </span>
          {badge && (
            <span className="btn-gold absolute start-3 top-3 rounded-full px-3 py-1 font-label text-xs font-bold">
              {L(badge)}
            </span>
          )}
        </button>
      ) : (
        <div className="tile-bg relative grid aspect-[4/3] place-items-center">
          <DynIcon name={icon || "Sofa"} size={66} className="text-gold opacity-50" strokeWidth={1.25} />
          {badge && (
            <span className="btn-gold absolute end-3 top-3 rounded-full px-3 py-1 font-label text-xs font-bold">
              {L(badge)}
            </span>
          )}
        </div>
      )}

      {/* body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-body text-lg font-bold text-ink-primary">{L(product.name)}</h3>
        <div className="flex items-center gap-2 text-sm text-ink-secondary">
          <span
            className="inline-block h-3 w-3 rounded-full border border-gold/40"
            style={{ background: swatchHex || "#c9973a" }}
          />
          {L(product.color)}
        </div>

        {product.price ? (
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold text-gold">{formatPrice(product.price, locale)}</span>
          </div>
        ) : null}

        <div className="mt-auto grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleOrder}
            className="btn-gold inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 font-label text-sm"
          >
            <Zap size={17} />
            {t("btn_order")}
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className={`btn-soft inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 font-label text-sm ${
              added ? "added" : ""
            }`}
          >
            {added ? <Check size={17} /> : <Plus size={17} />}
            {added ? t("btn_added") : t("btn_add")}
          </button>
          {!product.price && (
            <button
              type="button"
              onClick={handlePrice}
              disabled={pricing}
              className="btn-ghost col-span-2 inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 font-label text-sm disabled:opacity-60"
            >
              <Tag size={17} />
              {pricing ? t("f_sending") : t("btn_price")}
            </button>
          )}
        </div>
      </div>
      <span className="card-glow" aria-hidden />
    </article>
  );
}
