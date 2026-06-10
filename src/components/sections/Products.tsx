"use client";

import { BellRing, ArrowLeft } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/sections/ProductCard";
import { DynIcon } from "@/components/ui/Icon";
import { useT } from "@/lib/useT";
import { waLink } from "@/lib/config";
import { useSiteData } from "@/components/providers/SiteDataProvider";
import type { Localized } from "@/lib/types";

function RoomCard({ room }: { room: { id: string; icon: string; name: Localized; desc: Localized } }) {
  const { t, L, locale } = useT();
  const soon = locale === "fr" ? "Bientôt" : locale === "en" ? "Soon" : "قريباً";
  const name = L(room.name);
  const msg =
    locale === "fr"
      ? `Bonjour, je souhaite des infos sur ${name} 🛋️`
      : locale === "en"
        ? `Hello, I'd like info about ${name} 🛋️`
        : `السلام عليكم، أرغب في الاستفسار عن ${name} 🛋️`;

  return (
    <article
      className="card-hover flex h-full flex-col overflow-hidden rounded-xl border border-gold/15 bg-bg-card"
      style={{ borderStyle: "dashed" }}
    >
      <div className="tile-bg relative grid aspect-[4/3] place-items-center">
        <DynIcon name={room.icon} size={64} strokeWidth={1.2} className="text-gold opacity-45" />
        <span className="absolute end-3 top-3 rounded-full border border-gold/50 px-3 py-1 font-label text-xs font-bold text-gold">
          {soon}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-body text-lg font-bold text-ink-primary">{name}</h3>
        <p className="flex-1 font-body text-sm text-ink-secondary">{L(room.desc)}</p>
        <a
          href={waLink(msg)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost mt-auto inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-label text-sm"
        >
          <BellRing size={17} />
          {t("btn_notify")}
        </a>
      </div>
    </article>
  );
}

export function Products() {
  const { t, dir } = useT();
  const { salons, tables, rooms, swatch } = useSiteData();

  return (
    <section id="products" className="bg-bg-primary px-4 py-section md:px-12">
      <div className="mx-auto max-w-container">
        {/* salons */}
        <SectionHeading anchorId="cat-salons" title={t("sec_salons")} subtitle={t("sec_salons_sub")} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {salons.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 80} className="h-full">
              <ProductCard product={p} swatchHex={swatch[p.id]} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a
            href="#gallery"
            className="btn-gold inline-flex min-h-[48px] items-center gap-2 rounded-lg px-7 py-3 font-label text-sm"
          >
            {t("sec_gallery_btn")}
            <ArrowLeft size={18} className={dir === "rtl" ? "" : "rotate-180"} />
          </a>
        </div>

        {/* tables */}
        <div className="mt-20">
          <SectionHeading anchorId="cat-tables" title={t("sec_tables")} subtitle={t("sec_tables_sub")} />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tables.map((tb, i) => (
              <Reveal key={tb.id} delay={(i % 3) * 80} className="h-full">
                <ProductCard product={tb} icon={tb.icon} swatchHex={tb.swatchHex} badge={tb.badge} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* rooms */}
        <div className="mt-20">
          <SectionHeading anchorId="cat-rooms" title={t("sec_rooms")} subtitle={t("sec_rooms_sub")} />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r, i) => (
              <Reveal key={r.id} delay={(i % 3) * 80} className="h-full">
                <RoomCard room={r} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
