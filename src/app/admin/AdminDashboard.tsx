"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X, Upload, ArrowLeft } from "lucide-react";

type Dict = Record<string, string | number | boolean | null | undefined>;

const CATS = ["salons", "tables", "rooms"];
const STATUSES = ["available", "coming_soon"];

async function api(url: string, opts?: RequestInit) {
  const r = await fetch(url, opts);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || r.statusText);
  return j;
}

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const j = await api("/api/admin/upload", { method: "POST", body: fd });
  return j.url as string;
}

export function AdminDashboard() {
  const [tab, setTab] = useState<"products" | "packs" | "settings">("products");
  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.reload();
  };
  const tabs: [typeof tab, string][] = [
    ["products", "المنتجات"],
    ["packs", "الباقات"],
    ["settings", "الإعدادات"],
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-ink-primary">
      <header className="glass sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 px-5 py-3">
        <div className="flex items-center gap-4">
          <span className="font-display text-lg font-bold text-gold">لوحة التحكم</span>
          <nav className="flex gap-1">
            {tabs.map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`rounded-lg px-3 py-1.5 font-label text-sm transition-colors ${
                  tab === id ? "bg-gold/15 text-gold" : "text-ink-secondary hover:text-gold"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noreferrer" className="font-body text-sm text-ink-secondary hover:text-gold">
            عرض الموقع ↗
          </a>
          <button onClick={logout} className="btn-soft rounded-lg px-3 py-1.5 font-label text-sm">
            خروج
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        {tab === "products" && <ProductsPanel />}
        {tab === "packs" && <PacksPanel />}
        {tab === "settings" && <SettingsPanel />}
      </main>
    </div>
  );
}

/* ───────────────────────── Products ───────────────────────── */

function emptyProduct(): Dict {
  return {
    slug: "",
    ref_code: "",
    category: "salons",
    name_ar: "",
    name_fr: "",
    name_en: "",
    color_ar: "",
    color_fr: "",
    color_en: "",
    price: "",
    swatch_hex: "#c9973a",
    icon: "",
    badge_ar: "",
    badge_fr: "",
    badge_en: "",
    status: "available",
    active: true,
    sort_order: 100,
  };
}

function ProductsPanel() {
  const [products, setProducts] = useState<Dict[]>([]);
  const [images, setImages] = useState<Dict[]>([]);
  const [editing, setEditing] = useState<Dict | null>(null);
  const [imgs, setImgs] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const j = await api("/api/admin/products");
    setProducts(j.products);
    setImages(j.images);
  };
  useEffect(() => {
    load().catch((e) => setMsg(String(e.message)));
  }, []);

  const imagesFor = (id: string) =>
    images.filter((im) => im.product_id === id).map((im) => im.image_path as string);

  const set = (k: string, v: Dict[string]) => setEditing((p) => (p ? { ...p, [k]: v } : p));

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    setMsg("");
    try {
      const payload = { ...editing, images: imgs };
      await api("/api/admin/products", {
        method: editing.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditing(null);
      await load();
      setMsg("تم الحفظ ✓");
    } catch (e) {
      setMsg("خطأ: " + (e as Error).message);
    }
    setBusy(false);
  };

  const del = async (p: Dict) => {
    if (!window.confirm("حذف هذا المنتج؟")) return;
    try {
      await api("/api/admin/products?id=" + p.id, { method: "DELETE" });
      await load();
    } catch (e) {
      setMsg("خطأ: " + (e as Error).message);
    }
  };

  const onUpload = async (files: FileList | null) => {
    if (!files) return;
    setBusy(true);
    for (const f of Array.from(files)) {
      try {
        const url = await uploadFile(f);
        setImgs((prev) => [...prev, url]);
      } catch (e) {
        setMsg("فشل رفع الصورة: " + (e as Error).message);
      }
    }
    setBusy(false);
  };

  if (editing) {
    return (
      <div className="rounded-2xl border border-gold/15 bg-bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => setEditing(null)} className="flex items-center gap-1 text-sm text-ink-secondary hover:text-gold">
            <ArrowLeft size={16} /> رجوع
          </button>
          <h2 className="font-display text-lg font-bold text-gold">{editing.id ? "تعديل منتج" : "منتج جديد"}</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <F label="المعرّف (slug)"><input className="form-input" value={s(editing.slug)} onChange={(e) => set("slug", e.target.value)} /></F>
          <F label="الرمز (ref)"><input className="form-input" value={s(editing.ref_code)} onChange={(e) => set("ref_code", e.target.value)} /></F>
          <F label="الفئة">
            <select className="form-input" value={s(editing.category)} onChange={(e) => set("category", e.target.value)}>
              {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </F>
          <F label="الحالة">
            <select className="form-input" value={s(editing.status)} onChange={(e) => set("status", e.target.value)}>
              {STATUSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </F>
          <F label="الاسم (عربي)"><input className="form-input" value={s(editing.name_ar)} onChange={(e) => set("name_ar", e.target.value)} /></F>
          <F label="الاسم (فرنسي)"><input className="form-input" value={s(editing.name_fr)} onChange={(e) => set("name_fr", e.target.value)} /></F>
          <F label="الاسم (إنجليزي)"><input className="form-input" value={s(editing.name_en)} onChange={(e) => set("name_en", e.target.value)} /></F>
          <F label="السعر (دج)"><input className="form-input" inputMode="numeric" value={s(editing.price)} onChange={(e) => set("price", e.target.value)} placeholder="بدون = اطلب السعر" /></F>
          <F label="اللون (عربي)"><input className="form-input" value={s(editing.color_ar)} onChange={(e) => set("color_ar", e.target.value)} /></F>
          <F label="اللون (فرنسي)"><input className="form-input" value={s(editing.color_fr)} onChange={(e) => set("color_fr", e.target.value)} /></F>
          <F label="اللون (إنجليزي)"><input className="form-input" value={s(editing.color_en)} onChange={(e) => set("color_en", e.target.value)} /></F>
          <F label="لون العيّنة">
            <input type="color" className="form-input h-[46px] p-1" value={s(editing.swatch_hex) || "#c9973a"} onChange={(e) => set("swatch_hex", e.target.value)} />
          </F>
          <F label="أيقونة (للطاولات/الغرف)"><input className="form-input" value={s(editing.icon)} onChange={(e) => set("icon", e.target.value)} placeholder="مثل TreePine" /></F>
          <F label="ترتيب العرض"><input className="form-input" inputMode="numeric" value={s(editing.sort_order)} onChange={(e) => set("sort_order", e.target.value)} /></F>
        </div>

        {/* images */}
        <div className="mt-4">
          <div className="mb-2 font-label text-sm text-ink-secondary">الصور</div>
          <div className="flex flex-wrap gap-3">
            {imgs.map((src, i) => (
              <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-gold/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => setImgs((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute end-0 top-0 grid h-5 w-5 place-items-center rounded-bl bg-black/70 text-white"
                  aria-label="حذف"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="grid h-20 w-20 cursor-pointer place-items-center rounded-lg border border-dashed border-gold/40 text-gold">
              <Upload size={20} />
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onUpload(e.target.files)} />
            </label>
          </div>
        </div>

        <label className="mt-4 flex items-center gap-2 font-body text-sm">
          <input type="checkbox" checked={!!editing.active} onChange={(e) => set("active", e.target.checked)} /> مُفعّل (يظهر في الموقع)
        </label>

        {msg && <p className="mt-3 font-body text-sm text-gold">{msg}</p>}
        <div className="mt-5 flex gap-2">
          <button onClick={save} disabled={busy} className="btn-gold rounded-lg px-6 py-2.5 font-label text-sm disabled:opacity-60">
            {busy ? "..." : "حفظ"}
          </button>
          <button onClick={() => setEditing(null)} className="btn-soft rounded-lg px-6 py-2.5 font-label text-sm">إلغاء</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-gold">المنتجات ({products.length})</h2>
        <button onClick={() => { setEditing(emptyProduct()); setImgs([]); }} className="btn-gold inline-flex items-center gap-2 rounded-lg px-4 py-2 font-label text-sm">
          <Plus size={16} /> منتج جديد
        </button>
      </div>
      {msg && <p className="mb-3 font-body text-sm text-gold">{msg}</p>}
      <div className="overflow-hidden rounded-xl border border-gold/15">
        {products.map((p) => (
          <div key={s(p.id)} className="flex items-center gap-3 border-b border-gold/10 bg-bg-card px-4 py-3 last:border-0">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-bg-secondary">
              {imagesFor(s(p.id))[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagesFor(s(p.id))[0]} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-body text-sm font-bold text-ink-primary">{s(p.name_ar) || s(p.slug)}</div>
              <div className="font-label text-xs text-ink-secondary">
                {s(p.category)} {p.price ? `· ${p.price} دج` : ""} {!p.active ? "· مخفي" : ""}
              </div>
            </div>
            <button onClick={() => { setEditing({ ...p }); setImgs(imagesFor(s(p.id))); }} className="btn-soft rounded-lg px-3 py-1.5 font-label text-xs">تعديل</button>
            <button onClick={() => del(p)} className="grid h-8 w-8 place-items-center rounded-lg text-ink-secondary hover:text-red-400" aria-label="حذف">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {products.length === 0 && <div className="bg-bg-card px-4 py-8 text-center font-body text-sm text-ink-secondary">لا توجد منتجات بعد.</div>}
      </div>
    </div>
  );
}

/* ───────────────────────── Packs ───────────────────────── */

function PacksPanel() {
  const [packs, setPacks] = useState<Dict[]>([]);
  const [items, setItems] = useState<Dict[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const j = await api("/api/admin/packs");
    setPacks(j.packs);
    setItems(j.items);
  };
  useEffect(() => {
    load().catch((e) => setMsg(String(e.message)));
  }, []);

  const itemsText = (packId: string, k: "label_ar" | "label_fr" | "label_en") =>
    items.filter((it) => it.pack_id === packId).map((it) => s(it[k])).join("\n");

  const save = async (p: Dict, ar: string, fr: string, en: string) => {
    setBusy(true);
    setMsg("");
    try {
      const arr = ar.split("\n").map((x) => x.trim()).filter(Boolean);
      const frArr = fr.split("\n");
      const enArr = en.split("\n");
      const payloadItems = arr.map((label_ar, i) => ({ label_ar, label_fr: frArr[i]?.trim() || label_ar, label_en: enArr[i]?.trim() || label_ar }));
      await api("/api/admin/packs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, items: payloadItems }),
      });
      await load();
      setMsg("تم الحفظ ✓");
    } catch (e) {
      setMsg("خطأ: " + (e as Error).message);
    }
    setBusy(false);
  };

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl font-bold text-gold">الباقات</h2>
      {msg && <p className="font-body text-sm text-gold">{msg}</p>}
      {packs.map((p) => (
        <PackForm key={s(p.id)} pack={p} ar={itemsText(s(p.id), "label_ar")} fr={itemsText(s(p.id), "label_fr")} en={itemsText(s(p.id), "label_en")} onSave={save} busy={busy} />
      ))}
      {packs.length === 0 && <p className="font-body text-sm text-ink-secondary">لا توجد باقات.</p>}
    </div>
  );
}

function PackForm({ pack, ar, fr, en, onSave, busy }: { pack: Dict; ar: string; fr: string; en: string; onSave: (p: Dict, ar: string, fr: string, en: string) => void; busy: boolean }) {
  const [p, setP] = useState<Dict>(pack);
  const [iAr, setIAr] = useState(ar);
  const [iFr, setIFr] = useState(fr);
  const [iEn, setIEn] = useState(en);
  const set = (k: string, v: Dict[string]) => setP((x) => ({ ...x, [k]: v }));

  return (
    <div className="rounded-xl border border-gold/15 bg-bg-card p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <F label="الاسم (عربي)"><input className="form-input" value={s(p.name_ar)} onChange={(e) => set("name_ar", e.target.value)} /></F>
        <F label="الاسم (فرنسي)"><input className="form-input" value={s(p.name_fr)} onChange={(e) => set("name_fr", e.target.value)} /></F>
        <F label="الاسم (إنجليزي)"><input className="form-input" value={s(p.name_en)} onChange={(e) => set("name_en", e.target.value)} /></F>
        <F label="العرض المميّز (عربي)"><input className="form-input" value={s(p.highlight_ar)} onChange={(e) => set("highlight_ar", e.target.value)} /></F>
        <F label="الشارة (عربي)"><input className="form-input" value={s(p.badge_ar)} onChange={(e) => set("badge_ar", e.target.value)} /></F>
        <F label="الترتيب"><input className="form-input" inputMode="numeric" value={s(p.sort_order)} onChange={(e) => set("sort_order", e.target.value)} /></F>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <F label="العناصر (عربي — سطر لكل عنصر)"><textarea className="form-input min-h-[90px]" value={iAr} onChange={(e) => setIAr(e.target.value)} /></F>
        <F label="العناصر (فرنسي)"><textarea className="form-input min-h-[90px]" value={iFr} onChange={(e) => setIFr(e.target.value)} /></F>
        <F label="العناصر (إنجليزي)"><textarea className="form-input min-h-[90px]" value={iEn} onChange={(e) => setIEn(e.target.value)} /></F>
      </div>
      <label className="mt-3 flex items-center gap-2 font-body text-sm">
        <input type="checkbox" checked={!!p.featured} onChange={(e) => set("featured", e.target.checked)} /> الباقة المميّزة (الأكثر طلباً)
      </label>
      <button onClick={() => onSave(p, iAr, iFr, iEn)} disabled={busy} className="btn-gold mt-3 rounded-lg px-5 py-2 font-label text-sm disabled:opacity-60">
        حفظ الباقة
      </button>
    </div>
  );
}

/* ───────────────────────── Settings ───────────────────────── */

function SettingsPanel() {
  const [b, setB] = useState<Dict>({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/api/admin/settings")
      .then((j) => setB(flatten(j.business)))
      .catch((e) => setMsg(String(e.message)));
  }, []);
  const set = (k: string, v: Dict[string]) => setB((x) => ({ ...x, [k]: v }));

  const save = async () => {
    setBusy(true);
    setMsg("");
    try {
      const value = {
        whatsappPhone: s(b.whatsappPhone),
        email: s(b.email),
        instagram: s(b.instagram),
        facebook: s(b.facebook),
        tiktok: s(b.tiktok),
        addressLocality: s(b.addressLocality),
        addressRegion: s(b.addressRegion),
        mapsUrl: s(b.mapsUrl),
        phones: [
          { display: s(b.phone1_display), tel: s(b.phone1_tel) },
          { display: s(b.phone2_display), tel: s(b.phone2_tel) },
        ].filter((p) => p.display || p.tel),
      };
      await api("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) });
      setMsg("تم الحفظ ✓");
    } catch (e) {
      setMsg("خطأ: " + (e as Error).message);
    }
    setBusy(false);
  };

  return (
    <div className="rounded-2xl border border-gold/15 bg-bg-card p-5">
      <h2 className="mb-4 font-display text-xl font-bold text-gold">الإعدادات</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <F label="رقم واتساب (دولي، أرقام فقط)"><input className="form-input" dir="ltr" value={s(b.whatsappPhone)} onChange={(e) => set("whatsappPhone", e.target.value)} /></F>
        <F label="البريد الإلكتروني"><input className="form-input" dir="ltr" value={s(b.email)} onChange={(e) => set("email", e.target.value)} /></F>
        <F label="هاتف 1 — العرض"><input className="form-input" dir="ltr" value={s(b.phone1_display)} onChange={(e) => set("phone1_display", e.target.value)} /></F>
        <F label="هاتف 1 — tel:"><input className="form-input" dir="ltr" value={s(b.phone1_tel)} onChange={(e) => set("phone1_tel", e.target.value)} /></F>
        <F label="هاتف 2 — العرض"><input className="form-input" dir="ltr" value={s(b.phone2_display)} onChange={(e) => set("phone2_display", e.target.value)} /></F>
        <F label="هاتف 2 — tel:"><input className="form-input" dir="ltr" value={s(b.phone2_tel)} onChange={(e) => set("phone2_tel", e.target.value)} /></F>
        <F label="إنستغرام"><input className="form-input" dir="ltr" value={s(b.instagram)} onChange={(e) => set("instagram", e.target.value)} /></F>
        <F label="فيسبوك"><input className="form-input" dir="ltr" value={s(b.facebook)} onChange={(e) => set("facebook", e.target.value)} /></F>
        <F label="تيك توك"><input className="form-input" dir="ltr" value={s(b.tiktok)} onChange={(e) => set("tiktok", e.target.value)} /></F>
        <F label="رابط الخريطة"><input className="form-input" dir="ltr" value={s(b.mapsUrl)} onChange={(e) => set("mapsUrl", e.target.value)} /></F>
        <F label="المدينة"><input className="form-input" value={s(b.addressLocality)} onChange={(e) => set("addressLocality", e.target.value)} /></F>
        <F label="الولاية"><input className="form-input" value={s(b.addressRegion)} onChange={(e) => set("addressRegion", e.target.value)} /></F>
      </div>
      {msg && <p className="mt-3 font-body text-sm text-gold">{msg}</p>}
      <button onClick={save} disabled={busy} className="btn-gold mt-4 rounded-lg px-6 py-2.5 font-label text-sm disabled:opacity-60">
        {busy ? "..." : "حفظ الإعدادات"}
      </button>
    </div>
  );
}

/* ───────────────────────── helpers ───────────────────────── */

function flatten(b: Record<string, unknown>): Dict {
  const phones = (b?.phones as { display?: string; tel?: string }[]) || [];
  return {
    whatsappPhone: (b?.whatsappPhone as string) || "",
    email: (b?.email as string) || "",
    instagram: (b?.instagram as string) || "",
    facebook: (b?.facebook as string) || "",
    tiktok: (b?.tiktok as string) || "",
    addressLocality: (b?.addressLocality as string) || "",
    addressRegion: (b?.addressRegion as string) || "",
    mapsUrl: (b?.mapsUrl as string) || "",
    phone1_display: phones[0]?.display || "",
    phone1_tel: phones[0]?.tel || "",
    phone2_display: phones[1]?.display || "",
    phone2_tel: phones[1]?.tel || "",
  };
}

const s = (v: Dict[string]): string => (v == null ? "" : String(v));

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-label text-xs text-ink-secondary">{label}</span>
      {children}
    </label>
  );
}
