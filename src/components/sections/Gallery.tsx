"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useStore } from "@/store/useStore";
import { useT } from "@/lib/useT";
import { gallery } from "@/data/catalog";

export function Gallery() {
  const { t, L } = useT();
  const openLightbox = useStore((s) => s.openLightbox);

  return (
    <section id="gallery" className="bg-bg-primary px-4 py-section md:px-12">
      <div className="mx-auto max-w-container">
        <SectionHeading title={t("sec_gallery")} subtitle={t("sec_gallery_sub")} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gallery.map((g, i) => (
            <Reveal key={g.src} delay={(i % 3) * 80} className="h-full">
              <button
                type="button"
                onClick={() => openLightbox(g.src, L(g.caption))}
                className="zoomable card-hover group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-gold/15 text-start"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={L(g.caption)} loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 block bg-gradient-to-t from-bg-primary to-transparent p-4 pt-10">
                  <span className="font-body text-sm font-bold text-ink-primary">{L(g.caption)}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
