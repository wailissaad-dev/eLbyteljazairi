"use client";

import { CheckCircle2 } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { useStore } from "@/store/useStore";
import { useT } from "@/lib/useT";

export function SuccessModal() {
  const { t } = useT();
  const open = useStore((s) => s.successOpen);
  const close = useStore((s) => s.closeSuccess);

  return (
    <Overlay open={open} onClose={close} label={t("ok_title")}>
      <div className="animate-panel glass w-full max-w-md rounded-2xl p-8 text-center">
        <CheckCircle2 size={56} className="mx-auto text-gold" />
        <h2 className="mt-4 font-display text-2xl font-bold text-gold">{t("ok_title")}</h2>
        <p className="mt-3 font-body leading-relaxed text-ink-secondary">{t("ok_body")}</p>
        <button
          type="button"
          onClick={close}
          className="btn-gold mt-6 inline-flex min-h-[48px] items-center justify-center rounded-lg px-8 py-3 font-label"
        >
          {t("ok_btn")}
        </button>
      </div>
    </Overlay>
  );
}
