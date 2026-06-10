# البيت الجزائري — El Bayt El Djazairi

Landing page and lead-capture site for **El Bayt El Djazairi**, an Algerian
workshop designing and building luxury sofas and furniture in Ras El Oued,
Bordj Bou Arreridj.

Arabic (RTL) is the default experience; **French** and **English** are available
through the language switcher. Orders, custom requests and price requests are
validated, saved to Supabase (optional), and handed off to **WhatsApp** so the
shop can confirm and arrange delivery.

> Built with Next.js (App Router) + TypeScript + Tailwind CSS + Supabase + Zod.

---

## Features

- 🌍 Trilingual **AR / FR / EN** with full RTL support and a language switcher.
- 🛋️ Catalog: 9 sofas, 3 tables, "coming soon" rooms, and 3 packs.
- 🛒 Cart drawer, single-product order, product image gallery, fabric lightbox.
- 📝 Order form with cascading **wilaya → commune** selectors (all 58 wilayas).
- ✨ Custom-order ("طلب خاص") and price-request flows.
- 💬 Every action builds a clean WhatsApp message; leads also persist to Supabase.
- 🪟 Restrained "liquid glass" styling on the nav, drawers and modals.
- 🔎 SEO: Arabic metadata, Open Graph, local-business JSON-LD, sitemap & robots.

---

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

`npm install` / `npm run dev` automatically run `scripts/extract-images.mjs`,
which generates `public/images/` from the original design export. (See
[`reference/README.md`](reference/README.md).)

---

## Environment variables

The site **works out of the box without any configuration** — orders simply open
WhatsApp. Add a `.env.local` (copy from [`.env.example`](.env.example)) to enable
lead storage and tune defaults:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | no | Receiving WhatsApp number (digits only). Defaults to `213770040474`. |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical URL for SEO / sitemap. |
| `NEXT_PUBLIC_SUPABASE_URL` | for DB | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | for DB | Supabase anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | for DB | **Server-only.** Lets the API routes insert leads past RLS. Never expose to the client. |

---

## Supabase setup (optional but recommended)

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   then [`supabase/seed.sql`](supabase/seed.sql).
3. Copy the URL + anon key + service role key (**Project Settings → API**) into
   `.env.local`.
4. Restart `npm run dev`. New orders/requests now appear in the `orders`,
   `custom_requests` and `price_requests` tables.

Row Level Security is enabled everywhere. The catalog tables are publicly
readable; the lead tables are **only** writable/readable by the service role
used server-side, so customer data is never exposed to the browser.

If an insert ever fails, the customer is never blocked — the UI falls back to a
WhatsApp-only message.

---

## Admin panel (`/admin`)

A password-protected panel to manage the catalog and business info — changes
appear on the **live** site (Supabase-backed).

**Enable it:**
1. In the Supabase SQL editor run, in order:
   [`0001_init.sql`](supabase/migrations/0001_init.sql),
   [`0002_admin.sql`](supabase/migrations/0002_admin.sql),
   then [`seed.sql`](supabase/seed.sql). (`0002` also creates the `product-images`
   Storage bucket and backfills the catalog.)
2. Set env vars: the three Supabase keys + `ADMIN_PASSWORD` (optionally
   `ADMIN_SESSION_SECRET`).
3. Open `/admin` and log in with `ADMIN_PASSWORD`.

**Tabs:** **Products** (add/edit/delete, AR/FR/EN, price, category, active toggle,
multi-image upload to Storage) · **Packs** (the 3 offers + items) · **Settings**
(phones, WhatsApp number, email, Instagram/Facebook/TikTok, address).

When Supabase/`ADMIN_PASSWORD` aren't set, the public site keeps using the
built-in catalog and `/admin` shows a short setup notice. `/admin` is `noindex`.

## Security

- **HTTP headers** — a per-request, **nonce-based Content-Security-Policy**
  (`strict-dynamic`, set in `src/middleware.ts`) plus HSTS, `X-Frame-Options`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`,
  COOP, and `X-Permitted-Cross-Domain-Policies` (in `next.config.mjs`).
- **Admin auth** — signed **httpOnly** `sameSite=lax` (`secure` in prod) cookie,
  **constant-time** password compare, login **rate-limiting** + brute-force delay.
  Use a strong `ADMIN_PASSWORD`; rotate `ADMIN_SESSION_SECRET` to invalidate all
  sessions. Every `/api/admin/*` route is session-checked.
- **Database** — Row Level Security on; lead tables (`orders`, `custom_requests`,
  `price_requests`) are readable/writable **only by the service role** (server-side).
  Admin writes go through a column **allowlist**; uploads are restricted to images
  with a size cap.
- **Input/output** — all public POSTs validated with **Zod**; all rendered values
  are escaped by React (the only `dangerouslySetInnerHTML` uses are static,
  nonce'd JSON-LD + the theme script).
- `/admin` and `/api` are disallowed in `robots.txt`; `/admin` is `noindex`.

## Deploy to Vercel

1. Push this repo to GitHub (see below).
2. Import the repo at [vercel.com/new](https://vercel.com/new) (framework:
   **Next.js**, no config needed).
3. Add the environment variables above in **Project Settings → Environment
   Variables**.
4. Deploy. The `prebuild` step regenerates the images during the build.

### Push to GitHub

```bash
git init            # already initialised if you cloned
git add .
git commit -m "El Bayt El Djazairi landing page"
git branch -M main
git remote add origin https://github.com/<you>/elbayt-eldjazairi.git
git push -u origin main
```

---

## Verify before shipping

```bash
npm run lint        # eslint (next/core-web-vitals)
npm run typecheck   # tsc --noEmit
npm run build       # production build
```

---

## Editing content

- **Products, packs, gallery, fabrics** → [`src/data/catalog.ts`](src/data/catalog.ts)
- **Wilayas / communes** → [`src/data/wilayas.ts`](src/data/wilayas.ts)
- **Features & about copy** → [`src/data/content.ts`](src/data/content.ts)
- **Translations (AR/FR/EN)** → [`src/lib/i18n.ts`](src/lib/i18n.ts)
- **Business info (phone, email, socials, address)** → [`src/lib/config.ts`](src/lib/config.ts)
- **WhatsApp message wording** → [`src/lib/whatsapp.ts`](src/lib/whatsapp.ts)

To add more photos to a product, drop them in the catalog `images` array; the
product gallery, counter and thumbnails update automatically.

---

## Project structure

```
src/
  app/
    layout.tsx            # fonts, SEO metadata, JSON-LD
    page.tsx              # section + overlay composition
    globals.css           # design system + liquid glass
    sitemap.ts / robots.ts
    api/{orders,custom-requests,price-requests}/route.ts
  components/
    layout/   sections/   cart/   modals/   ui/   providers/
  data/       catalog.ts  content.ts  wilayas.ts
  lib/        i18n.ts  config.ts  whatsapp.ts  schemas.ts  api.ts  types.ts
              orderCode.ts  useT.ts  supabase/server.ts
  store/      useStore.ts  # zustand: cart, modals, language, gallery
supabase/     migrations/0001_init.sql   seed.sql
scripts/      extract-images.mjs
```

---

Made in Algeria 🇩🇿
