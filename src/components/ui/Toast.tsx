"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useStore } from "@/store/useStore";

export function Toast() {
  const toast = useStore((s) => s.toast);
  const clearToast = useStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(clearToast, 3200);
    return () => clearTimeout(id);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[120] flex justify-center px-4"
    >
      <div className="animate-toast glass flex items-center gap-2 rounded-full px-5 py-3 font-body text-sm text-ink-primary shadow-2xl">
        <CheckCircle2 size={18} className="text-gold" />
        {toast.msg}
      </div>
    </div>
  );
}
