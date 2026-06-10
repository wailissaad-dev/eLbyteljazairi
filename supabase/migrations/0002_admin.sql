-- ─────────────────────────────────────────────────────────────
-- El Bayt El Djazairi — admin support
-- Extends products with the fields the UI needs, adds a settings
-- table, and a public Storage bucket for uploaded product images.
-- Run after 0001_init.sql.
-- ─────────────────────────────────────────────────────────────

-- richer product fields ----------------------------------------------------
alter table products add column if not exists price       numeric(12,2);
alter table products add column if not exists swatch_hex  text;
alter table products add column if not exists icon        text;
alter table products add column if not exists badge_ar    text;
alter table products add column if not exists badge_fr    text;
alter table products add column if not exists badge_en    text;
alter table products add column if not exists status      text not null default 'available'
  check (status in ('available', 'coming_soon'));

alter table packs add column if not exists badge_ar text;
alter table packs add column if not exists badge_fr text;
alter table packs add column if not exists badge_en text;

-- key/value site settings (business info, etc.) ----------------------------
create table if not exists settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
drop trigger if exists trg_settings_updated on settings;
create trigger trg_settings_updated before update on settings
  for each row execute function set_updated_at();

alter table settings enable row level security;
drop policy if exists "public read settings" on settings;
create policy "public read settings" on settings
  for select to anon, authenticated using (true);
-- writes happen via the service role (admin API), which bypasses RLS.

-- public Storage bucket for admin-uploaded product images ------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- allow public read of objects in that bucket (bucket is public, but be explicit)
drop policy if exists "public read product-images" on storage.objects;
create policy "public read product-images" on storage.objects
  for select to anon, authenticated using (bucket_id = 'product-images');

-- default business settings (mirrors src/lib/config.ts) --------------------
insert into settings (key, value) values
  ('business', jsonb_build_object(
    'whatsappPhone', '213770040474',
    'phones', jsonb_build_array(
      jsonb_build_object('display', '0770 04 04 74', 'tel', '+213770040474'),
      jsonb_build_object('display', '0698 73 92 62', 'tel', '+213698739262')
    ),
    'email', 'elbayteljazairi@gmail.com',
    'instagram', 'https://www.instagram.com/elbayt_eljazairi',
    'facebook', 'https://www.facebook.com/share/1MDTEdh8vz/',
    'tiktok', 'https://www.tiktok.com/@elbayt_eljazairi',
    'addressLocality', 'رأس الوادي',
    'addressRegion', 'برج بوعريريج',
    'mapsUrl', 'https://maps.google.com/?q=Ras+el+oued+BBA+Algerie'
  ))
on conflict (key) do nothing;

-- ── backfill rich data on the seeded catalog (matches src/data/catalog.ts) ──
update products set swatch_hex = v.hex from (values
  ('salon-ayla-beige','#E5D5B8'),('salon-ayla-gris','#C9C9CE'),('salon-ayla-olive','#6E7444'),
  ('salon-moderne-gris-fonce','#4A4D52'),('salon-moderne-bleu','#8FB4CC'),('salon-moderne-terre','#9C6B4A'),
  ('salon-moderne-creme','#EADBC2'),('salon-moderne-terracotta','#B5794E'),('salon-moderne-gris-clair','#BFC2C7')
) as v(slug, hex) where products.slug = v.slug;

update products set icon='TreePine', swatch_hex='#8B5A2B', badge_ar='صناعة يدوية', badge_fr='Fait main', badge_en='Handmade' where slug='table-bois-fait-main';
update products set icon='Square', swatch_hex='#9FB8C4' where slug='table-verre-moderne';
update products set icon='Coffee', swatch_hex='#C9973A' where slug='ensemble-tables-basses';

update packs set badge_ar='الأكثر طلباً ⭐', badge_fr='Le plus demandé ⭐', badge_en='Most popular ⭐' where slug='pack-famille';

-- rooms (coming soon teasers)
insert into products (slug, ref_code, category, name_ar, name_fr, name_en, description_ar, description_fr, description_en, icon, status, sort_order) values
  ('chambre-complete','RM-1','rooms','غرفة نوم كاملة','Chambre complète','Full Bedroom','سرير، خزانة، وكومود بتصميم متناسق.','Lit, armoire et commode, design coordonné.','Bed, wardrobe and dresser in a coordinated design.','BedDouble','coming_soon',20),
  ('sejour-complet','RM-2','rooms','غرفة معيشة متكاملة','Séjour complet','Complete Living Room','حلول أثاث متكاملة لغرفة المعيشة بأناقة عصرية.','Solutions meubles pour le séjour, style moderne.','Complete living-room furniture in a modern style.','Armchair','coming_soon',21),
  ('chambre-enfant','RM-3','rooms','غرفة أطفال','Chambre d''enfant','Kids'' Room','أثاث آمن وعملي بألوان مبهجة لغرف الأطفال.','Meubles sûrs et pratiques, couleurs joyeuses.','Safe, practical furniture in cheerful colors.','Baby','coming_soon',22)
on conflict (slug) do nothing;

-- Renault salon (priced)
insert into products (slug, ref_code, category, name_ar, name_fr, name_en, color_ar, color_fr, color_en, price, swatch_hex, sort_order) values
  ('salon-renault','RN-1','salons','صالون رونو','Salon Renault','Renault Sofa Set','بيج / كريمي مع خشب الجوز','Beige / crème, bois noyer','Beige / cream with walnut wood',83000,'#E5D5B8',0)
on conflict (slug) do nothing;

insert into product_images (product_id, image_path, alt, sort_order)
select p.id, x.path, p.name_ar, x.ord
from products p
join (values
  ('/products/salon-renault-1.png',0),('/products/salon-renault-2.png',1),('/products/salon-renault-3.png',2),
  ('/products/salon-renault-4.png',3),('/products/salon-renault-5.png',4)
) as x(path, ord) on p.slug = 'salon-renault'
where not exists (select 1 from product_images pi where pi.product_id = p.id);

