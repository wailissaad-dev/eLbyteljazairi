"use client";

import { CheckCircle2, Gift, Info } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { DynIcon } from "@/components/ui/Icon";
import { useStore } from "@/store/useStore";
import { useT } from "@/lib/useT";
import { useSiteData } from "@/components/providers/SiteDataProvider";
import type { Pack } from "@/lib/types";

function PackCard({ pack }: { pack: Pack }) {
  const { t, L } = useT();
  const orderDirect = useStore((s) => s.orderDirect);

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl bg-bg-card ${
        pack.featured ? "border-2 border-gold shadow-[0_24px_60px_rgba(201,151,58,0.18)]" : "border border-gold/30"
      }`}
    >
      {pack.featured && pack.badge && (
        <div className="bg-gold py-1.5 text-center font-label text-xs font-bold text-black">{L(pack.badge)}</div>
      )}
      <div
        className="px-6 py-7 text-center"
        style={{ background: "radial-gradient(120% 120% at 50% 0%, rgba(201,151,58,.16), transparent 70%)" }}
      >
        <DynIcon name={pack.icon} size={44} className="mx-auto text-gold" strokeWidth={1.3} />
        <h3 className="mt-3 font-display text-2xl font-bold text-gold">{L(pack.name)}</h3>
        <p className="mt-1 font-body text-xs text-ink-secondary">{L(pack.subtitle)}</p>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <ul className="space-y-2.5">
          {pack.items.map((it, i) => (
            <li key={i} className="flex items-start gap-2 font-body text-sm text-ink-secondary">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-gold" />
              {L(it.label)}
            </li>
          ))}
        </ul>
        <div className="my-1 flex flex-col items-center gap-0.5 rounded-xl border border-dashed border-gold/35 bg-gold/[0.06] p-3 text-center">
          <span className="font-label text-xs text-ink-secondary">{t("pack_price_label")}</span>
          <span className="gold-shimmer font-display text-xl font-bold">{L(pack.highlight)}</span>
        </div>
        <button
          type="button"
          onClick={() => orderDirect({ name: pack.orderLabel, ref: pack.id, slug: pack.id, qty: 1 })}
          className="btn-gold mt-auto inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg px-4 py-3 font-label text-sm"
        >
          <Gift size={19} />
          {t("btn_pack_order")}
        </button>
      </div>
    </article>
  );
}

export function Packs() {
  const { t } = useT();
  const { packs } = useSiteData();
  return (
    <section id="packs" className="relative overflow-hidden bg-bg-secondary px-4 py-section md:px-12">
      <div className="aurora left-1/2 top-4 h-[360px] w-[520px] -translate-x-1/2" />
      <div className="relative z-10 mx-auto max-w-container">
        <div id="cat-packs" className="scroll-mt-[130px]" />
        <SectionHeading title={t("sec_packs")} subtitle={t("sec_packs_sub")} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {packs.map((p, i) => (
            <Reveal key={p.id} delay={i * 90} className="h-full">
              <PackCard pack={p} />
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-8 flex max-w-2xl items-center justify-center gap-2 text-center font-body text-sm text-ink-secondary">
          <Info size={18} className="shrink-0 text-gold" />
          {t("packs_custom")}
        </p>
      </div>
    </section>
  );
}
