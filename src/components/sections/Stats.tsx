"use client";

import { useT } from "@/lib/useT";
import { stats } from "@/data/content";
import { CountUp } from "@/components/ui/CountUp";

export function Stats() {
  const { t } = useT();
  return (
    <section className="relative border-y border-gold/15 bg-bg-secondary py-10 md:py-12">
      <div className="mx-auto max-w-container px-4 md:px-12">
        <div className="grid grid-cols-3 gap-6">
          {stats.map((s) => {
            const m = s.value.match(/^(\+?)(\d+)(%?)$/);
            return (
              <div key={s.key} className="px-2 text-center">
                <div className="mb-2 font-display text-3xl font-bold md:text-4xl">
                  {m ? (
                    <CountUp className="gold-shimmer" prefix={m[1]} value={parseInt(m[2], 10)} suffix={m[3]} />
                  ) : (
                    <span>{s.value}</span>
                  )}
                </div>
                <div className="font-body text-sm text-ink-secondary">{t(s.key)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
