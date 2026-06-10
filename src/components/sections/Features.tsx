"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { DynIcon } from "@/components/ui/Icon";
import { useT } from "@/lib/useT";
import { features } from "@/data/content";

export function Features() {
  const { t, L } = useT();
  return (
    <section id="features" className="bg-bg-primary px-4 py-section md:px-12">
      <div className="mx-auto max-w-container">
        <SectionHeading title={t("sec_features")} subtitle={t("sec_features_sub")} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((f, i) => (
            <Reveal key={i} delay={(i % 2) * 90} className="h-full">
              <div className="card-hover flex h-full gap-5 rounded-xl border border-gold/15 bg-bg-card p-7">
                <div
                  className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-lg"
                  style={{ background: "rgba(201,151,58,0.1)" }}
                >
                  <DynIcon name={f.icon} size={26} className="text-gold" />
                </div>
                <div>
                  <h3 className="mb-2 font-body text-lg font-bold text-ink-primary">{L(f.title)}</h3>
                  <p className="font-body leading-relaxed text-ink-secondary">{L(f.desc)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
