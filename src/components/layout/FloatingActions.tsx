"use client";

import { Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useT } from "@/lib/useT";
import { waGreeting, waLink } from "@/lib/config";
import { WhatsAppIcon } from "@/components/ui/brands";

export function FloatingActions() {
  const { t, locale } = useT();
  const openCustom = useStore((s) => s.openCustom);
  const wa = waLink(waGreeting[locale] || waGreeting.ar);

  return (
    <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] end-5 z-30 flex flex-col items-end gap-3">
      <button
        type="button"
        onClick={openCustom}
        aria-label={t("fab_special")}
        className="glass card-hover flex min-h-[44px] items-center gap-2 rounded-full px-4 py-3 font-label text-sm font-bold text-gold-light"
      >
        <Sparkles size={18} className="text-gold" />
        <span>{t("fab_special")}</span>
      </button>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="grid h-14 w-14 place-items-center rounded-full text-white shadow-lg transition-transform hover:scale-110"
        style={{ background: "#25d366" }}
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </div>
  );
}
