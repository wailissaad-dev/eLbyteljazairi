"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useT } from "@/lib/useT";
import { waGreeting, waLink } from "@/lib/config";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LiveClock } from "@/components/ui/LiveClock";
import { WhatsAppIcon } from "@/components/ui/brands";
import { DynIcon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/ui/Magnetic";
import { useScrollSpy } from "@/lib/useScrollSpy";
import { useSiteData } from "@/components/providers/SiteDataProvider";

const NAV = [
  { href: "#home", key: "nav_home" },
  { href: "#gallery", key: "nav_gallery" },
  { href: "#fabrics", key: "nav_fabrics" },
  { href: "#features", key: "nav_why" },
  { href: "#about", key: "nav_about" },
  { href: "#contact", key: "nav_contact" },
];

const SECTION_IDS = ["home", "products", "gallery", "fabrics", "features", "about", "contact"];

export function SiteHeader() {
  const { t, locale } = useT();
  const count = useStore((s) => s.cart.reduce((n, i) => n + i.qty, 0));
  const openCart = useStore((s) => s.openCart);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  const prodRef = useRef<HTMLLIElement>(null);
  const active = useScrollSpy(SECTION_IDS);
  const { settings } = useSiteData();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the products dropdown on outside click
  useEffect(() => {
    if (!prodOpen) return;
    const onClick = (e: MouseEvent) => {
      if (prodRef.current && !prodRef.current.contains(e.target as Node)) setProdOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [prodOpen]);

  const wa = waLink(waGreeting[locale] || waGreeting.ar, settings.whatsappPhone);

  const catLinks = [
    { href: "#cat-salons", label: t("cat_salons"), icon: "Sofa" },
    { href: "#cat-tables", label: t("cat_tables"), icon: "Table" },
    { href: "#cat-rooms", label: t("cat_rooms"), icon: "BedDouble" },
    { href: "#packs", label: t("nav_packs"), icon: "Gem" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)]">
      {/* announcement bar */}
      <div className="hidden border-b border-gold/10 bg-bg-secondary/80 text-ink-secondary md:block">
        <div className="mx-auto flex max-w-container items-center justify-between gap-4 px-6 py-1.5 text-xs">
          <span className="flex items-center gap-2 truncate">
            <span className="text-gold">◈</span>
            {t("topbar_msg")}
          </span>
          <span className="flex shrink-0 items-center gap-4">
            <LiveClock className="font-label tabular-nums text-ink-secondary/80" />
            <span className="text-gold">{t("topbar_ship")}</span>
          </span>
        </div>
      </div>

      {/* main nav */}
      <nav
        className={`transition-all duration-300 ${
          scrolled ? "glass" : "bg-bg-primary/70 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-container items-center justify-between gap-4 px-4 py-3 md:px-6">
          <a href="#home" className="flex items-center gap-2 shrink-0">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-gold/40 font-display text-lg font-bold text-gold">
              ب
            </span>
            <span className="font-display text-lg font-bold leading-none text-ink-primary">
              البيت الجزائري
            </span>
          </a>

          {/* desktop links */}
          <ul className="hidden items-center gap-6 lg:flex">
            <li>
              <a
                href="#home"
                data-active={active === "home"}
                className="nav-link text-sm text-ink-secondary transition-colors hover:text-gold"
              >
                {t("nav_home")}
              </a>
            </li>
            <li
              ref={prodRef}
              className="relative"
              onMouseEnter={() => setProdOpen(true)}
              onMouseLeave={() => setProdOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setProdOpen(false);
              }}
            >
              <button
                type="button"
                data-active={active === "products"}
                aria-haspopup="true"
                aria-expanded={prodOpen}
                onClick={() => setProdOpen((v) => !v)}
                className="nav-link flex items-center gap-1 text-sm text-ink-secondary transition-colors hover:text-gold"
              >
                {t("nav_products")}
                <ChevronDown size={14} className={`transition-transform ${prodOpen ? "rotate-180" : ""}`} />
              </button>
              {prodOpen && (
                <div className="absolute start-0 top-full pt-2">
                  <div className="glass w-52 overflow-hidden rounded-xl py-1.5">
                    {catLinks.map((c) => (
                      <a
                        key={c.href}
                        href={c.href}
                        onClick={() => setProdOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-ink-secondary transition-colors hover:bg-gold/10 hover:text-gold-light"
                      >
                        <DynIcon name={c.icon} size={18} className="text-gold" />
                        {c.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </li>
            {NAV.slice(1).map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  data-active={active === n.href.slice(1)}
                  className="nav-link text-sm text-ink-secondary transition-colors hover:text-gold"
                >
                  {t(n.key)}
                </a>
              </li>
            ))}
          </ul>

          {/* actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <ThemeToggle />
            <button
              type="button"
              onClick={openCart}
              aria-label={t("cart_open")}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-ink-primary transition-colors hover:border-gold/60 hover:text-gold"
            >
              <ShoppingCart size={19} />
              {count > 0 && (
                <span className="absolute -top-1 -end-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-black">
                  {count}
                </span>
              )}
            </button>
            <Magnetic className="hidden md:inline-flex">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span className="hidden md:inline">{t("nav_wa")}</span>
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={locale === "fr" ? "Menu" : locale === "en" ? "Menu" : "القائمة"}
              aria-expanded={mobileOpen}
              className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-ink-primary lg:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {mobileOpen && (
          <div className="glass max-h-[calc(100dvh-88px)] overflow-y-auto border-t border-gold/10 lg:hidden">
            <ul className="mx-auto flex max-w-container flex-col gap-1 px-4 py-3">
              {[...NAV].map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-ink-secondary transition-colors hover:bg-gold/10 hover:text-gold"
                  >
                    {t(n.key)}
                  </a>
                </li>
              ))}
              <li className="grid grid-cols-2 gap-2 px-3 pt-2">
                {catLinks.map((c) => (
                  <a
                    key={c.href}
                    href={c.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg border border-gold/20 px-3 py-2 text-sm text-ink-secondary"
                  >
                    <DynIcon name={c.icon} size={16} className="text-gold" />
                    {c.label}
                  </a>
                ))}
              </li>
              <li className="flex items-center justify-between gap-3 px-3 pt-3">
                <div className="flex items-center gap-2">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {t("nav_wa")}
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
