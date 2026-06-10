"use client";

import { useMemo, useState } from "react";
import { X, ShoppingBag, Send } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { useStore } from "@/store/useStore";
import { useT } from "@/lib/useT";
import { submitOrder } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { WILAYA_KEYS, WILAYAS } from "@/data/wilayas";
import type { OrderPayload } from "@/lib/types";

const isValidPhone = (v: string) => {
  const d = v.replace(/[^0-9]/g, "");
  return d.length >= 9 && d.length <= 13;
};

const strip = (s: string) => s.replace(/\s*\*\s*$/, "");

export function OrderFormModal() {
  const { t, L, locale } = useT();
  const open = useStore((s) => s.orderFormOpen);
  const close = useStore((s) => s.closeOrderForm);
  const items = useStore((s) => s.currentOrderItems);
  const orderSucceeded = useStore((s) => s.orderSucceeded);

  const [fullName, setFullName] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [notes, setNotes] = useState("");
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const communes = useMemo(() => (wilaya ? WILAYAS[wilaya] ?? [] : []), [wilaya]);

  const clearInvalid = (k: string) => setInvalid((v) => (v[k] ? { ...v, [k]: false } : v));

  const reset = () => {
    setFullName("");
    setWilaya("");
    setCommune("");
    setAddress("");
    setPhone1("");
    setPhone2("");
    setNotes("");
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
      problems.push(strip(t("f_name")));
      badIds.push("of-name");
    }
    if (!wilaya) {
      bad.wilaya = true;
      problems.push(strip(t("f_wilaya")));
      badIds.push("of-wilaya");
    }
    if (!commune) {
      bad.commune = true;
      problems.push(strip(t("f_commune")));
      badIds.push("of-commune");
    }
    if (address.trim().length < 3) {
      bad.address = true;
      problems.push(strip(t("f_address")));
      badIds.push("of-address");
    }
    if (!isValidPhone(phone1)) {
      bad.phone1 = true;
      problems.push(strip(t("f_phone1")));
      badIds.push("of-phone1");
    }

    if (problems.length) {
      setInvalid(bad);
      setErrorMsg(t("f_err") + problems.join("، "));
      requestAnimationFrame(() => document.getElementById(badIds[0])?.focus());
      return;
    }
    setInvalid({});
    setErrorMsg("");

    const payload: OrderPayload = {
      fullName: fullName.trim(),
      wilaya,
      commune,
      address: address.trim(),
      phone1: phone1.trim(),
      phone2: phone2.trim() || undefined,
      notes: notes.trim() || undefined,
      locale,
      items: items.map((it) => ({
        name: L(it.name),
        color: it.color ? L(it.color) : undefined,
        ref: it.ref,
        productSlug: it.slug,
        quantity: it.qty,
        price: it.price,
      })),
    };

    setSubmitting(true);
    const res = await submitOrder(payload);
    setSubmitting(false);
    window.open(res.whatsappUrl, "_blank", "noopener");
    reset();
    orderSucceeded();
  };

  return (
    <Overlay open={open} onClose={close} label={t("form_title")}>
      <div className="animate-panel glass flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl">
        <header className="flex items-center justify-between border-b border-gold/15 px-6 py-4">
          <h2 className="font-display text-xl font-bold text-gold">{t("form_title")}</h2>
          <button
            type="button"
            onClick={close}
            aria-label={t("close")}
            className="grid h-9 w-9 place-items-center rounded-full border border-gold/20 text-ink-secondary transition-colors hover:text-gold"
          >
            <X size={18} />
          </button>
        </header>

        <div className="overflow-y-auto px-6 py-5">
          {/* summary */}
          {items.length > 0 && (
            <div className="mb-5 rounded-xl border border-gold/15 bg-bg-card p-4">
              <div className="mb-2 flex items-center gap-2 font-label text-sm font-bold text-gold-light">
                <ShoppingBag size={18} />
                {t("sum_label")}
              </div>
              <ul className="space-y-1.5">
                {items.map((it, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 font-body text-sm text-ink-secondary">
                    <span>
                      {L(it.name)}
                      {it.color ? ` (${L(it.color)})` : ""}
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-gold">
                      {it.price ? <span>{formatPrice(it.price, locale)}</span> : null}
                      <span>×{it.qty}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form id="order-form" onSubmit={handleSubmit} noValidate className="space-y-4">
            <Field label={t("f_name")}>
              <input
                id="of-name"
                className={`form-input ${invalid.fullName ? "field-invalid" : ""}`}
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  clearInvalid("fullName");
                }}
                aria-invalid={invalid.fullName || undefined}
                autoComplete="name"
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t("f_wilaya")}>
                <select
                  id="of-wilaya"
                  className={`form-input ${invalid.wilaya ? "field-invalid" : ""}`}
                  value={wilaya}
                  onChange={(e) => {
                    setWilaya(e.target.value);
                    setCommune("");
                    clearInvalid("wilaya");
                  }}
                  aria-invalid={invalid.wilaya || undefined}
                >
                  <option value="">{t("f_wilaya_ph")}</option>
                  {WILAYA_KEYS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("f_commune")}>
                <select
                  id="of-commune"
                  className={`form-input ${invalid.commune ? "field-invalid" : ""}`}
                  value={commune}
                  onChange={(e) => {
                    setCommune(e.target.value);
                    clearInvalid("commune");
                  }}
                  disabled={!wilaya}
                  aria-invalid={invalid.commune || undefined}
                >
                  <option value="">{wilaya ? t("f_commune_ph2") : t("f_commune_ph")}</option>
                  {communes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label={t("f_address")}>
              <input
                id="of-address"
                className={`form-input ${invalid.address ? "field-invalid" : ""}`}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  clearInvalid("address");
                }}
                aria-invalid={invalid.address || undefined}
                autoComplete="street-address"
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t("f_phone1")}>
                <input
                  id="of-phone1"
                  className={`form-input ${invalid.phone1 ? "field-invalid" : ""}`}
                  value={phone1}
                  onChange={(e) => {
                    setPhone1(e.target.value);
                    clearInvalid("phone1");
                  }}
                  type="tel"
                  inputMode="tel"
                  dir="ltr"
                  autoComplete="tel"
                  aria-invalid={invalid.phone1 || undefined}
                />
              </Field>
              <Field label={t("f_phone2")}>
                <input
                  className="form-input"
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                  type="tel"
                  inputMode="tel"
                  dir="ltr"
                />
              </Field>
            </div>

            <Field label={t("f_notes")}>
              <textarea
                className="form-input min-h-[80px] resize-y"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Field>

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
              {submitting ? t("f_sending") : t("f_submit")}
            </button>
            <p className="text-center font-body text-xs text-ink-secondary">{t("f_note")}</p>
          </form>
        </div>
      </div>
    </Overlay>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-label text-sm text-ink-secondary">{label}</span>
      {children}
    </label>
  );
}
