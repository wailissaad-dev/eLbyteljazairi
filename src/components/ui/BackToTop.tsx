"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { useT } from "@/lib/useT";

export function BackToTop() {
  const { t } = useT();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      aria-label={t("to_top")}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="glass fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] start-5 z-30 grid h-12 w-12 place-items-center rounded-full text-gold transition-transform hover:-translate-y-1"
    >
      <ChevronUp size={22} />
    </button>
  );
}
