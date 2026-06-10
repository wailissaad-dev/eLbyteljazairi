"use client";

import { useState } from "react";
import { X, Crown, Send, Sofa, Table, BedDouble, Gem, MoreHorizontal } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { useStore } from "@/store/useStore";
import { useT } from "@/lib/useT";
import { submitCustomRequest } from "@/lib/api";

const CHIPS = [
  { val: "صالون فاخر", key: "sp_t_salon", Icon: Sofa },
  { val: "طاولة", key: "sp_t_table", Icon: Table },
  { val: "غرفة نوم", key: "sp_t_room", Icon: BedDouble },
  { val: "باقة متكاملة", key: "sp_t_pack", Icon: Gem },
  { val: "قطعة أخرى", key: "sp_t_other", Icon: MoreHorizontal },
];

const isValidPhone = (v: string) => {
  const d = v.replace(/[^0-9]/g, "");
  return d.length >= 9 && d.length <= 13;
};

export function CustomRequestModal() {
  const { t, locale } = useT();
  const open = useStore((s) => s.customOpen);
  const close = useStore((s) => s.closeCustom);
  const orderSucceeded = useStore((s) => s.orderSucceeded);

  const [type, setType] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [color, setColor] = useState("");
  const [details, setDetails] = useState("");
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const clearInvalid = (k: string) => setInvalid((v) => (v[k] ? { ...v, [k]: false } : v));

  const reset = () => {
    setType("");
    setFullName("");
    setPhone("");
    setColor("");
    setDetails("");
    setInvalid({});
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bad: Record<string, boolean> = {};
    const problems: string[] = [];
    const badIds: string[] = [];
    if (fullName.trim().length < 2) {
      bad.fullName = true;
      problems.push(t("sp_name").replace(/\s*\*\s*$/, ""));
      badIds.push("sp-name");
    }
    if (!isValidPhone(phone)) {
      bad.phone = true;
      problems.push(t("sp_phone").replace(/\s*\*\s*$/, ""));
      badIds.push("sp-phone");
    }
    if (details.trim().length < 3) {
      bad.details = true;
      problems.push(t("sp_details").replace(/\s*\*\s*$/, ""));
      badIds.push("sp-details");
    }
    if (problems.length) {
      setInvalid(bad);
      setErrorMsg(t("f_err") + problems.join("، "));
      requestAnimationFrame(() => document.getElementById(badIds[0])?.focus());
      return;
    }
    setErrorMsg("");

    setSubmitting(true);
    const res = await submitCustomRequest({
      fullName: fullName.trim(),
      phone: phone.trim(),
      requestType: type || undefined,
      preferredColor: color.trim() || undefined,
      details: details.trim(),
      locale,
    });
    setSubmitting(false);
    window.open(res.whatsappUrl, "_blank", "noopener");
    reset();
    orderSucceeded();
  };

  return (
    <Overlay open={open} onClose={close} label={t("sp_title")}>
      <div className="animate-panel flex max-h-[94vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-gold/40 bg-bg-secondary">
        <header
          className="relative px-6 py-7 text-center"
          style={{ background: "radial-gradient(120% 120% at 50% 0%, rgba(201,151,58,.16), transparent 70%)" }}
        >
          <button
            type="button"
            onClick={close}
            aria-label={t("close")}
            className="absolute end-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-gold/20 text-ink-secondary transition-colors hover:text-gold"
          >
            <X size={18} />
          </button>
          <span
            className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full border border-gold/50"
            style={{ background: "linear-gradient(180deg,rgba(226,185,106,.22),rgba(201,151,58,.10))" }}
          >
            <Crown size={32} className="text-gold-light" />
          </span>
          <h3 className="font-display text-2xl font-bold text-gold">{t("sp_title")}</h3>
          <p className="mx-auto mt-2 max-w-md font-body text-sm leading-relaxed text-ink-secondary">{t("sp_sub")}</p>
        </header>

        <div className="overflow-y-auto px-6 py-5">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <span className="mb-2 block font-label text-sm text-ink-secondary">{t("sp_type")}</span>
              <div className="flex flex-wrap gap-2">
                {CHIPS.map((c) => {
                  const active = type === c.val;
                  return (
                    <button
                      type="button"
                      key={c.val}
                      onClick={() => setType(active ? "" : c.val)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 font-label text-sm transition-colors ${
                        active
                          ? "border-gold bg-gradient-to-b from-gold-light to-gold text-black"
                          : "border-gold/15 bg-bg-card text-ink-secondary hover:border-gold/60 hover:text-gold-light"
                      }`}
                    >
                      <c.Icon size={16} />
                      {t(c.key)}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="mb-1.5 block font-label text-sm text-ink-secondary">{t("sp_name")}</span>
              <input
                id="sp-name"
                className={`form-input ${invalid.fullName ? "field-invalid" : ""}`}
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  clearInvalid("fullName");
                }}
                aria-invalid={invalid.fullName || undefined}
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-label text-sm text-ink-secondary">{t("sp_phone")}</span>
              <input
                id="sp-phone"
                className={`form-input ${invalid.phone ? "field-invalid" : ""}`}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  clearInvalid("phone");
                }}
                type="tel"
                inputMode="tel"
                dir="ltr"
                autoComplete="tel"
                aria-invalid={invalid.phone || undefined}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-label text-sm text-ink-secondary">{t("sp_color")}</span>
              <input className="form-input" value={color} onChange={(e) => setColor(e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-label text-sm text-ink-secondary">{t("sp_details")}</span>
              <textarea
                id="sp-details"
                className={`form-input min-h-[100px] resize-y ${invalid.details ? "field-invalid" : ""}`}
                value={details}
                onChange={(e) => {
                  setDetails(e.target.value);
                  clearInvalid("details");
                }}
                aria-invalid={invalid.details || undefined}
              />
            </label>

            {errorMsg && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 font-body text-sm text-red-700 dark:text-red-300"
              >
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-gold inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 font-label text-base disabled:opacity-60"
            >
              <Send size={20} />
              {submitting ? t("f_sending") : t("sp_submit")}
            </button>
            <p className="text-center font-body text-xs text-ink-secondary">{t("sp_note")}</p>
          </form>
        </div>
      </div>
    </Overlay>
  );
}
