"use client";

import { useRef } from "react";
import { ChevronDown, ArrowLeft, BadgeCheck, Truck, Hammer } from "lucide-react";
import { useT } from "@/lib/useT";
import { waGreeting, waLink } from "@/lib/config";
import { AlgeriaFlag, WhatsAppIcon } from "@/components/ui/brands";
import { Magnetic } from "@/components/ui/Magnetic";
import { useSiteData } from "@/components/providers/SiteDataProvider";
import { HERO_IMAGE } from "@/data/catalog";

export function Hero() {
  const { t, locale, dir } = useT();
  const { settings } = useSiteData();
  const wa = waLink(waGreeting[locale] || waGreeting.ar, settings.whatsappPhone);
  const spotRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = spotRef.current;
    if (!el) return;
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.classList.add("on");
  };
  const onLeave = () => spotRef.current?.classList.remove("on");

  const chips = [
    { Icon: BadgeCheck, label: locale === "fr" ? "Fabriqué en Algérie" : locale === "en" ? "Made in Algeria" : "صنع في الجزائر" },
    { Icon: Truck, label: locale === "fr" ? "Livraison 58 wilayas" : locale === "en" ? "Delivery to 58 provinces" : "توصيل لكل 58 ولاية" },
    { Icon: Hammer, label: locale === "fr" ? "Pose & installation" : locale === "en" ? "Delivery & install" : "توصيل وتركيب" },
  ];

  return (
    <header
      id="home"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-[120px]"
    >
      {/* backdrop */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_IMAGE} alt="" aria-hidden className="animate-kenburns h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/85 via-bg-primary/75 to-bg-primary" />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 38%, rgb(var(--c-gold) / 0.14) 0%, transparent 70%)" }}
        />
      </div>
      <div ref={spotRef} className="hero-spotlight" aria-hidden />
      <div className="aurora -end-24 -top-24 h-[420px] w-[420px]" />
      <div className="aurora -bottom-32 -start-24 h-[460px] w-[460px]" />
      <div className="pointer-events-none absolute -end-20 -top-20 h-[400px] w-[400px] rounded-full border border-gold/10 opacity-30" />

      <div className="hero-stagger relative z-10 mx-auto w-full max-w-container px-4 py-24 text-center md:px-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/[0.06] px-4 py-1.5 font-label text-xs uppercase tracking-[0.18em] text-gold">
          <AlgeriaFlag className="h-3 w-auto rounded-[2px]" />
          {t("hero_badge")}
        </span>
        <h1 className="mt-8 font-display text-hero text-ink-primary">
          {t("hero_t1")} <span className="gold-shimmer shimmer-sweep">{t("hero_t1b")}</span>
          <br />
          {t("hero_t2")}
        </h1>
        <p className="mt-4 font-display text-2xl font-bold text-gold-light md:text-3xl">
          <span className="gold-shimmer">{t("hero_sub")}</span>{" "}
          <AlgeriaFlag className="inline-block h-[1.05em] w-auto translate-y-[-0.08em] rounded-[3px] align-middle" />
        </p>
        <p className="mx-auto mt-6 max-w-2xl font-body text-base text-ink-secondary md:text-lg">{t("hero_line")}</p>
        <p className="mx-auto mt-2 max-w-xl font-body text-sm text-ink-secondary/80">{t("hero_desc")}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Magnetic className="inline-flex">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold inline-flex min-h-[52px] items-center gap-2 rounded-lg px-8 py-4 font-label"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t("hero_cta_wa")}
            </a>
          </Magnetic>
          <a
            href="#gallery"
            className="btn-ghost inline-flex min-h-[52px] items-center gap-2 rounded-lg px-8 py-4 font-label"
          >
            {t("hero_cta_gallery")}
            <ArrowLeft size={20} className={dir === "rtl" ? "" : "rotate-180"} />
          </a>
        </div>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {chips.map((c) => (
            <span key={c.label} className="inline-flex items-center gap-2 font-label text-xs text-ink-secondary">
              <c.Icon size={16} className="text-gold" />
              {c.label}
            </span>
          ))}
        </div>
      </div>

      <a
        href="#products"
        aria-label={t("scroll_more")}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-floatY p-3 text-gold opacity-60 transition-opacity hover:opacity-100"
      >
        <ChevronDown size={30} />
      </a>
    </header>
  );
}
