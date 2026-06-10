"use client";

import { create } from "zustand";
import type { Locale, Localized, Product } from "@/lib/types";
import { dirFor } from "@/lib/i18n";

export type ThemePref = "system" | "light" | "dark";

/** Toggles the `.dark` class on <html> for a given preference; returns the resolved theme. */
export function applyThemeClass(pref: ThemePref): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = pref === "dark" || (pref === "system" && sysDark);
  document.documentElement.classList.toggle("dark", dark);
  return dark ? "dark" : "light";
}

export interface CartItem {
  id: string;
  ref?: string;
  name: Localized;
  color?: Localized;
  image?: string;
  qty: number;
  price?: number;
}

/** A line in the order form — products, packs, or custom entries all reduce to this. */
export interface OrderEntry {
  name: Localized;
  color?: Localized;
  ref?: string;
  slug?: string;
  qty: number;
  price?: number;
}

interface LightboxState {
  open: boolean;
  src: string;
  caption: string;
}

interface GalleryState {
  open: boolean;
  productId: string | null;
  index: number;
}

interface ToastState {
  id: number;
  msg: string;
}

interface StoreState {
  locale: Locale;
  setLocale: (l: Locale) => void;

  theme: ThemePref;
  resolvedTheme: "light" | "dark";
  setTheme: (t: ThemePref) => void;
  toggleTheme: () => void;

  cart: CartItem[];
  addToCart: (p: Product) => void;
  incQty: (id: string) => void;
  decQty: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: () => number;

  currentOrderItems: OrderEntry[];

  // UI flags
  cartOpen: boolean;
  orderFormOpen: boolean;
  customOpen: boolean;
  successOpen: boolean;

  openCart: () => void;
  closeCart: () => void;
  checkoutCart: () => void;
  orderDirect: (entry: OrderEntry) => void;
  closeOrderForm: () => void;
  openCustom: () => void;
  closeCustom: () => void;
  openSuccess: () => void;
  closeSuccess: () => void;
  orderSucceeded: () => void;

  lightbox: LightboxState;
  openLightbox: (src: string, caption: string) => void;
  closeLightbox: () => void;

  gallery: GalleryState;
  openGallery: (productId: string) => void;
  closeGallery: () => void;
  galleryStep: (delta: number) => void;
  setGalleryIndex: (i: number) => void;

  toast: ToastState | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  locale: "ar",
  setLocale: (l) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("site_lang", l);
      } catch {
        /* ignore */
      }
      document.documentElement.lang = l;
      document.documentElement.dir = dirFor(l);
    }
    set({ locale: l });
  },

  theme: "system",
  resolvedTheme: "dark",
  setTheme: (t) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("theme", t);
      } catch {
        /* ignore */
      }
    }
    set({ theme: t, resolvedTheme: applyThemeClass(t) });
  },
  toggleTheme: () => {
    const next = get().resolvedTheme === "dark" ? "light" : "dark";
    get().setTheme(next);
  },

  cart: [],
  addToCart: (p) =>
    set((s) => {
      const existing = s.cart.find((it) => it.id === p.id);
      if (existing) {
        return { cart: s.cart.map((it) => (it.id === p.id ? { ...it, qty: it.qty + 1 } : it)) };
      }
      const item: CartItem = {
        id: p.id,
        ref: p.ref,
        name: p.name,
        color: p.color,
        image: p.images[0]?.src,
        qty: 1,
        price: p.price,
      };
      return { cart: [...s.cart, item] };
    }),
  incQty: (id) => set((s) => ({ cart: s.cart.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it)) })),
  decQty: (id) =>
    set((s) => ({
      cart: s.cart
        .map((it) => (it.id === id ? { ...it, qty: it.qty - 1 } : it))
        .filter((it) => it.qty > 0),
    })),
  removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((it) => it.id !== id) })),
  clearCart: () => set({ cart: [] }),
  cartCount: () => get().cart.reduce((sum, it) => sum + it.qty, 0),

  currentOrderItems: [],

  cartOpen: false,
  orderFormOpen: false,
  customOpen: false,
  successOpen: false,

  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  checkoutCart: () => {
    const { cart } = get();
    if (cart.length === 0) {
      get().showToast(get().locale === "ar" ? "سلتك فارغة — أضف منتجات أولاً" : "Your cart is empty");
      return;
    }
    const items: OrderEntry[] = cart.map((it) => ({
      name: it.name,
      color: it.color,
      ref: it.ref,
      slug: it.id,
      qty: it.qty,
      price: it.price,
    }));
    set({ currentOrderItems: items, cartOpen: false, orderFormOpen: true });
  },
  orderDirect: (entry) => set({ currentOrderItems: [entry], orderFormOpen: true, cartOpen: false }),
  closeOrderForm: () => set({ orderFormOpen: false }),
  openCustom: () => set({ customOpen: true }),
  closeCustom: () => set({ customOpen: false }),
  openSuccess: () => set({ successOpen: true }),
  closeSuccess: () => set({ successOpen: false }),
  orderSucceeded: () => set({ orderFormOpen: false, customOpen: false, cart: [], successOpen: true }),

  lightbox: { open: false, src: "", caption: "" },
  openLightbox: (src, caption) => set({ lightbox: { open: true, src, caption } }),
  closeLightbox: () => set((s) => ({ lightbox: { ...s.lightbox, open: false } })),

  gallery: { open: false, productId: null, index: 0 },
  openGallery: (productId) => set({ gallery: { open: true, productId, index: 0 } }),
  closeGallery: () => set((s) => ({ gallery: { ...s.gallery, open: false } })),
  galleryStep: (delta) => set((s) => ({ gallery: { ...s.gallery, index: s.gallery.index + delta } })),
  setGalleryIndex: (i) => set((s) => ({ gallery: { ...s.gallery, index: i } })),

  toast: null,
  showToast: (msg) => set({ toast: { id: Date.now(), msg } }),
  clearToast: () => set({ toast: null }),
}));
