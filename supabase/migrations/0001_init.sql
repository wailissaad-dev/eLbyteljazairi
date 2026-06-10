-- ─────────────────────────────────────────────────────────────
-- El Bayt El Djazairi — initial schema
-- Catalog tables (products / packs) + lead tables (orders / requests).
-- Run in the Supabase SQL editor, or via the Supabase CLI:
--   supabase db push   (or paste this file into SQL editor)
-- ─────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- generic updated_at trigger -----------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ╔══════════════════════════ CATALOG ══════════════════════════╗

create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  ref_code    text,
  category    text not null check (category in ('salons','tables','rooms')),
  name_ar     text not null,
  name_fr     text,
  name_en     text,
  color_ar    text,
  color_fr    text,
  color_en    text,
  description_ar text,
  description_fr text,
  description_en text,
  active      boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_products_updated before update on products
  for each row execute function set_updated_at();

create table if not exists product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  image_path  text not null,
  alt         text,
  caption_ar  text,
  caption_fr  text,
  caption_en  text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists idx_product_images_product on product_images(product_id);

create table if not exists packs (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name_ar      text not null,
  name_fr      text,
  name_en      text,
  subtitle     text,
  highlight_ar text,
  highlight_fr text,
  highlight_en text,
  featured     boolean not null default false,
  active       boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger trg_packs_updated before update on packs
  for each row execute function set_updated_at();

create table if not exists pack_items (
  id         uuid primary key default gen_random_uuid(),
  pack_id    uuid not null references packs(id) on delete cascade,
  label_ar   text not null,
  label_fr   text,
  label_en   text,
  sort_order integer not null default 0
);
create index if not exists idx_pack_items_pack on pack_items(pack_id);

-- ╔══════════════════════════ LEADS ════════════════════════════╗

create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  order_code       text unique not null,
  customer_name    text not null,
  phone1           text not null,
  phone2           text,
  wilaya           text not null,
  commune          text not null,
  address          text not null,
  notes            text,
  status           text not null default 'new' check (status in ('new','confirmed','delivered','cancelled')),
  locale           text not null default 'ar',
  whatsapp_message text,
  metadata         jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger trg_orders_updated before update on orders
  for each row execute function set_updated_at();
create index if not exists idx_orders_created on orders(created_at desc);
create index if not exists idx_orders_status on orders(status);

create table if not exists order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references orders(id) on delete cascade,
  product_slug text,
  ref          text,
  label        text not null,
  color        text,
  quantity     integer not null default 1 check (quantity > 0),
  created_at   timestamptz not null default now()
);
create index if not exists idx_order_items_order on order_items(order_id);

create table if not exists custom_requests (
  id               uuid primary key default gen_random_uuid(),
  customer_name    text not null,
  phone            text not null,
  request_type     text,
  preferred_color  text,
  details          text not null,
  status           text not null default 'new' check (status in ('new','quoted','closed','cancelled')),
  locale           text not null default 'ar',
  whatsapp_message text,
  metadata         jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger trg_custom_updated before update on custom_requests
  for each row execute function set_updated_at();
create index if not exists idx_custom_created on custom_requests(created_at desc);

create table if not exists price_requests (
  id           uuid primary key default gen_random_uuid(),
  product_slug text,
  ref          text,
  product_name text not null,
  color        text,
  locale       text not null default 'ar',
  metadata     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists idx_price_created on price_requests(created_at desc);

-- ╔════════════════════ ROW LEVEL SECURITY ═════════════════════╗
-- Catalog: public read of active rows. Leads: NO public access at all —
-- only the service role (used by the server API routes) can read/write,
-- since the service role bypasses RLS.

alter table products        enable row level security;
alter table product_images  enable row level security;
alter table packs           enable row level security;
alter table pack_items      enable row level security;
alter table orders          enable row level security;
alter table order_items     enable row level security;
alter table custom_requests enable row level security;
alter table price_requests  enable row level security;

drop policy if exists "public read products" on products;
create policy "public read products" on products
  for select to anon, authenticated using (active = true);

drop policy if exists "public read product_images" on product_images;
create policy "public read product_images" on product_images
  for select to anon, authenticated using (true);

drop policy if exists "public read packs" on packs;
create policy "public read packs" on packs
  for select to anon, authenticated using (active = true);

drop policy if exists "public read pack_items" on pack_items;
create policy "public read pack_items" on pack_items
  for select to anon, authenticated using (true);

-- No policies are created for orders / order_items / custom_requests /
-- price_requests, so anon & authenticated clients are denied by default.
