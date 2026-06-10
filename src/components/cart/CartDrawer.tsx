"use client";

import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { useStore } from "@/store/useStore";
import { useT } from "@/lib/useT";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { t, L, locale } = useT();
  const open = useStore((s) => s.cartOpen);
  const cart = useStore((s) => s.cart);
  const closeCart = useStore((s) => s.closeCart);
  const incQty = useStore((s) => s.incQty);
  const decQty = useStore((s) => s.decQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const checkoutCart = useStore((s) => s.checkoutCart);

  const count = cart.reduce((n, i) => n + i.qty, 0);
  const total = cart.reduce((sum, i) => sum + (i.price ?? 0) * i.qty, 0);
  const hasUnpriced = cart.some((i) => !i.price);

  return (
    <Overlay open={open} onClose={closeCart} variant="drawer" label={t("cart_title")}>
      <aside className="animate-drawer glass flex h-full w-full max-w-md flex-col">
        <header className="flex items-center justify-between border-b border-gold/15 p-5">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-gold">
            <ShoppingBag size={20} />
            {t("cart_title")}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label={t("close")}
            className="grid h-9 w-9 place-items-center rounded-full border border-gold/20 text-ink-secondary transition-colors hover:text-gold"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-ink-secondary">
              <ShoppingBag size={48} className="opacity-30" />
              <p className="mt-3 font-body">{t("cart_empty")}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {cart.map((it) => (
                <li key={it.id} className="flex gap-3 rounded-xl border border-gold/10 bg-bg-card p-3">
                  {it.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.image} alt={L(it.name)} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-body text-sm font-bold leading-snug text-ink-primary">{L(it.name)}</div>
                    {it.color && <div className="mt-0.5 font-body text-xs text-ink-secondary">{L(it.color)}</div>}
                    {it.price ? (
                      <div className="mt-0.5 font-label text-xs font-bold text-gold">{formatPrice(it.price, locale)}</div>
                    ) : null}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => decQty(it.id)}
                        aria-label={t("qty_dec")}
                        className="grid h-9 w-9 place-items-center rounded-md border border-gold/25 text-ink-primary transition-colors hover:border-gold/60"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="min-w-[24px] text-center font-label text-sm" aria-live="polite">
                        {it.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => incQty(it.id)}
                        aria-label={t("qty_inc")}
                        className="grid h-9 w-9 place-items-center rounded-md border border-gold/25 text-ink-primary transition-colors hover:border-gold/60"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(it.id)}
                    aria-label={t("item_remove")}
                    className="-m-2 self-start p-2 text-ink-secondary transition-colors hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="border-t border-gold/15 p-5">
          <div className="mb-1.5 flex items-center justify-between font-body text-sm text-ink-secondary">
            <span>{t("cart_count")}</span>
            <span className="font-bold text-gold">{count}</span>
          </div>
          {total > 0 && (
            <div className="mb-1.5 flex items-center justify-between font-body text-sm text-ink-secondary">
              <span>{t("cart_total")}</span>
              <span className="font-display text-lg font-bold text-gold">{formatPrice(total, locale)}</span>
            </div>
          )}
          {total > 0 && hasUnpriced && (
            <p className="text-end font-body text-xs text-ink-muted">{t("cart_total_note")}</p>
          )}
          <button
            type="button"
            onClick={checkoutCart}
            disabled={cart.length === 0}
            className="btn-gold mb-2 mt-3 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-label text-sm disabled:opacity-50"
          >
            {t("cart_checkout")}
          </button>
          <button
            type="button"
            onClick={closeCart}
            className="btn-soft inline-flex min-h-[44px] w-full items-center justify-center rounded-lg px-4 py-2.5 font-label text-sm"
          >
            {t("cart_continue")}
          </button>
          <p className="mt-3 text-center font-body text-xs text-ink-secondary">{t("cart_note")}</p>
        </footer>
      </aside>
    </Overlay>
  );
}
