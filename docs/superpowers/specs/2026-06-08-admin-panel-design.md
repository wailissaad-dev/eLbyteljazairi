# Admin Panel (Design Spec)

**Date:** 2026-06-08 · **Status:** Approved

## Goal
A password-protected `/admin` to manage products, packs, and business settings,
with changes reflected on the live (deployed) site. Supabase-backed.

## Decisions
- **Storage:** Supabase (schema already exists). Public site reads from Supabase
  when configured, else falls back to the built-in `catalog.ts`/`config.ts` — so
  unconfigured deploys are unchanged.
- **Auth:** single `ADMIN_PASSWORD` → signed httpOnly cookie session.
- **Scope:** products + packs + business settings. Product images upload to a
  Supabase Storage bucket `product-images`.

## Data model (migration 0002)
- `products`: add `price numeric`, `swatch_hex text`, `icon text`,
  `badge_ar/fr/en text`, `status text default 'available'`.
- `settings`: `key text pk`, `value jsonb`, `updated_at`. Public read.
- Storage bucket `product-images` (public read; writes via service role).
- `seed.sql` extended to match the current static catalog (swatches, prices incl.
  Renault, rooms as `coming_soon`, table icons/badges) so configuring Supabase
  reproduces today's site.

## Server pieces
- `src/lib/admin-auth.ts` — sign/verify session token (HMAC of `ADMIN_SESSION_SECRET`/`ADMIN_PASSWORD`).
- `src/lib/site-data.ts` — `getSiteData()` returns `{ salons, tables, rooms, swatch, packs, settings }`
  from Supabase (service client) or `null` → caller uses static.
- API routes under `/api/admin/*` (nodejs runtime, session-checked, service role):
  `login`, `logout`, `products`, `packs`, `settings`, `upload`.
- Order/price/custom routes read the WhatsApp number from settings (fallback env).

## Client pieces
- `SiteDataProvider` + `useSiteData()` — context seeded by the server fetch,
  defaulting to the static catalog/config so behavior is identical without DB.
- Public sections (Products, Packs, ProductGalleryModal, About, Contact, Footer,
  Header, Hero) read from `useSiteData()` with static fallback.
- `/admin` — login screen, then tabs: Products (CRUD + multi-image upload),
  Packs, Settings. Calls the admin API.

## Env
`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` (defaults to password), plus existing
Supabase keys. `/admin` shows a "configure Supabase + ADMIN_PASSWORD" notice when
not set.

## Success
- `npm run build` clean. Public site unchanged with no DB; with Supabase + admin,
  product/pack/settings edits appear on the site. Every admin route rejects
  unauthenticated requests.
