"use client";

import { Palette, Gift } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useStore } from "@/store/useStore";
import { useT } from "@/lib/useT";
import { fabrics } from "@/data/catalog";

export function Fabrics() {
  const { t, L } = useT();
  const openLightbox = useStore((s) => s.openLightbox);

  return (
    <section id="fabrics" className="bg-bg-secondary px-4 py-section md:px-12">
      <div className="mx-auto max-w-container">
        <SectionHeading title={t("sec_fabrics")} />
        <Reveal className="-mt-6 mb-10 text-center">
          <p className="mx-auto mb-6 max-w-2xl font-body text-ink-secondary">{t("fabrics_meta")}</p>
          <a
            href="#fabric-images"
            className="btn-gold inline-flex min-h-[48px] items-center gap-2 rounded-lg px-7 py-3 font-label text-sm"
          >
            <Palette size={19} />
            {t("fabrics_browse")}
          </a>
        </Reveal>

        <div id="fabric-images" className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {fabrics.map((f, i) => (
            <Reveal key={f.src} delay={i * 80} className="h-full">
              <figure className="card-hover overflow-hidden rounded-xl border border-gold/15">
                <button
                  type="button"
                  onClick={() => openLightbox(f.src, L(f.caption))}
                  className="zoomable block aspect-[4/5] w-full overflow-hidden bg-bg-card"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.src} alt={L(f.caption)} loading="lazy" className="h-full w-full object-cover" />
                </button>
                <figcaption className="border-t border-gold/15 bg-bg-card p-4 text-center font-body text-sm text-ink-secondary">
                  {L(f.caption)}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-5 py-2 font-label text-sm text-gold">
            <Gift size={18} />
            {t("fabrics_sample")}
          </span>
        </div>
      </div>
    </section>
  );
}
