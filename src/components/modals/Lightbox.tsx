"use client";

import { X } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { useStore } from "@/store/useStore";
import { useT } from "@/lib/useT";

export function Lightbox() {
  const { t } = useT();
  const lightbox = useStore((s) => s.lightbox);
  const close = useStore((s) => s.closeLightbox);

  return (
    <Overlay open={lightbox.open} onClose={close} label={lightbox.caption}>
      <div className="animate-panel relative flex max-h-[92vh] w-full max-w-4xl flex-col items-center">
        <button
          type="button"
          onClick={close}
          aria-label={t("close")}
          className="absolute end-0 -top-12 grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-white transition-colors hover:text-gold"
        >
          <X size={20} />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={lightbox.src}
          alt={lightbox.caption}
          className="max-h-[80vh] w-auto rounded-xl object-contain shadow-2xl"
        />
        {lightbox.caption && (
          <p className="mt-4 text-center font-body text-sm text-white/90">{lightbox.caption}</p>
        )}
      </div>
    </Overlay>
  );
}
