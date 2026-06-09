# How to edit products · دليل إدارة المنتجات

> Requires the admin to be enabled (Supabase + `ADMIN_PASSWORD` set on Vercel — see **DEPLOY.md**).
> يتطلّب تفعيل لوحة التحكم (مفاتيح Supabase وكلمة المرور — انظر DEPLOY.md).

## 1) Log in · الدخول
Open `https://your-site-url/admin` and enter your `ADMIN_PASSWORD`.
افتح الرابط `‎/admin` وأدخل كلمة المرور.

## 2) Add a product · إضافة منتج
1. **المنتجات** (Products) tab → **منتج جديد** (New product).
2. Fill in:
   - **الاسم** — name in Arabic / French / English
   - **الفئة** (category): `salons` (صالونات), `tables` (طاولات), `rooms` (غرف)
   - **السعر** (price) — leave empty to show "اطلب السعر" instead of a number
   - **اللون** (color) and **لون العيّنة** (swatch color dot)
3. **الصور** (Images): click the dashed upload box and pick photos — they upload automatically. Remove one with the ✕.
4. **مُفعّل** (Active) = shown on the site. Click **حفظ** (Save).
→ It appears on the live site right away.

## 3) Edit / delete · تعديل / حذف
In the products list: **تعديل** to edit, the 🗑 icon to delete.

## 4) Packs · الباقات
**الباقات** tab: edit each pack's name, **items** (one per line, in each language),
the highlight text, and the **"الأكثر طلباً"** star. Click save under each pack.

## 5) Contact info & WhatsApp · الإعدادات
**الإعدادات** tab: phones, **WhatsApp number**, email, Instagram / Facebook / TikTok,
and address. Changing the WhatsApp number here also changes **where orders are sent**.

## Tips · ملاحظات
- **Slug** = a unique id in latin letters (e.g. `salon-rouge`). Must be unique.
- Category `rooms` + status `coming_soon` = a "قريباً" teaser card (no price/cart).
- **Icons** (for tables/rooms) use names from https://lucide.dev — e.g. `Sofa`, `Coffee`, `BedDouble`, `TreePine`.
- Uploaded photos are stored in Supabase Storage and served on the site automatically.
