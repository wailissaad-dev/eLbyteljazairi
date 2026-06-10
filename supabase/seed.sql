-- ─────────────────────────────────────────────────────────────
-- El Bayt El Djazairi — catalog seed (idempotent)
-- Mirrors src/data/catalog.ts. Safe to run multiple times.
-- ─────────────────────────────────────────────────────────────

-- Salons ------------------------------------------------------------------
insert into products (slug, ref_code, category, name_ar, name_fr, name_en, color_ar, color_fr, color_en, sort_order)
values
  ('salon-ayla-beige','AY-1','salons','صالون أيلا البيج الفاخر','Salon Ayla Beige','Ayla Beige Sofa','بيج / كريمي','Beige / crème','Beige / cream',1),
  ('salon-ayla-gris','AY-2','salons','صالون أيلا الرمادي','Salon Ayla Gris','Ayla Grey Sofa','رمادي فاتح','Gris clair','Light grey',2),
  ('salon-ayla-olive','AY-3','salons','صالون أيلا الزيتوني','Salon Ayla Olive','Ayla Olive Sofa','زيتوني / كاكي','Olive / kaki','Olive / khaki',3),
  ('salon-moderne-gris-fonce','MD-1','salons','صالون مودرن رمادي غامق','Salon Moderne Gris Foncé','Modern Dark Grey Sofa','رمادي غامق','Gris foncé','Dark grey',4),
  ('salon-moderne-bleu','MD-2','salons','صالون مودرن أزرق طيفي','Salon Moderne Bleu','Modern Spectral Blue Sofa','أزرق سماوي','Bleu ciel','Sky blue',5),
  ('salon-moderne-terre','MD-3','salons','صالون مودرن طيني دافئ','Salon Moderne Terre','Modern Warm Clay Sofa','طيني / بني دافئ','Terracotta / brun','Clay / warm brown',6),
  ('salon-moderne-creme','MD-4','salons','صالون مودرن كريمي ناعم','Salon Moderne Crème','Modern Soft Cream Sofa','كريمي ناعم','Crème doux','Soft cream',7),
  ('salon-moderne-terracotta','MD-5','salons','صالون مودرن توب ترابي','Salon Moderne Terracotta','Modern Earthy Sofa','ترابي دافئ','Terre chaude','Warm earth',8),
  ('salon-moderne-gris-clair','MD-6','salons','صالون مودرن رمادي فاتح','Salon Moderne Gris Clair','Modern Light Grey Sofa','رمادي فاتح','Gris clair','Light grey',9)
on conflict (slug) do nothing;

-- Tables ------------------------------------------------------------------
insert into products (slug, ref_code, category, name_ar, name_fr, name_en, color_ar, color_fr, color_en, sort_order)
values
  ('table-bois-fait-main','TB-1','tables','طاولة خشبية مصممة يدوياً','Table en bois faite main','Handmade Wooden Table','خشب طبيعي','Bois naturel','Natural wood',10),
  ('table-verre-moderne','TB-2','tables','طاولة زجاجية عصرية','Table en verre moderne','Modern Glass Table','زجاج / معدن','Verre / métal','Glass / metal',11),
  ('ensemble-tables-basses','TB-3','tables','طقم طاولات قهوة','Ensemble de tables basses','Coffee Table Set','حسب الطلب','Sur mesure','Made to order',12)
on conflict (slug) do nothing;

-- Salon images ------------------------------------------------------------
insert into product_images (product_id, image_path, alt, caption_ar, sort_order)
select p.id, x.path, p.name_ar, p.name_ar, 0
from products p
join (values
  ('salon-ayla-beige','/images/img-04.jpg'),
  ('salon-ayla-gris','/images/img-05.jpg'),
  ('salon-ayla-olive','/images/img-06.jpg'),
  ('salon-moderne-gris-fonce','/images/img-07.jpg'),
  ('salon-moderne-bleu','/images/img-08.jpg'),
  ('salon-moderne-terre','/images/img-09.jpg'),
  ('salon-moderne-creme','/images/img-10.jpg'),
  ('salon-moderne-terracotta','/images/img-11.jpg'),
  ('salon-moderne-gris-clair','/images/img-12.jpg')
) as x(slug, path) on p.slug = x.slug
where not exists (select 1 from product_images pi where pi.product_id = p.id);

-- Packs -------------------------------------------------------------------
insert into packs (slug, name_ar, name_fr, name_en, subtitle, highlight_ar, highlight_fr, highlight_en, featured, sort_order)
values
  ('pack-essentiel','باقة الأناقة','Pack Essentiel','Essential Pack','Pack Essentiel','عرض مميّز 🎁','Offre spéciale 🎁','Special offer 🎁',false,1),
  ('pack-famille','باقة العائلة','Pack Famille','Family Pack','Pack Famille','أفضل قيمة 💎','Meilleur rapport 💎','Best value 💎',true,2),
  ('pack-premium','الباقة الفاخرة','Pack Premium','Premium Pack','Pack Premium','تجهيز كامل 👑','Aménagement complet 👑','Full setup 👑',false,3)
on conflict (slug) do nothing;

-- Pack items --------------------------------------------------------------
insert into pack_items (pack_id, label_ar, label_fr, label_en, sort_order)
select pk.id, v.label_ar, v.label_fr, v.label_en, v.sort_order
from packs pk
join (values
  ('pack-essentiel','صالون فاخر (لون حسب الاختيار)','Salon de luxe (couleur au choix)','Luxury sofa (color of your choice)',1),
  ('pack-essentiel','طاولة قهوة منسّقة','Table basse assortie','Matching coffee table',2),
  ('pack-essentiel','توصيل وتركيب مجاني','Livraison & installation gratuites','Free delivery & install',3),
  ('pack-famille','صالون فاخر كامل','Salon de luxe complet','Full luxury sofa set',1),
  ('pack-famille','طاولة أكل كبيرة','Grande table à manger','Large dining table',2),
  ('pack-famille','طاولة صغيرة للقهوة','Petite table basse','Small coffee table',3),
  ('pack-famille','توصيل وتركيب مجاني','Livraison & installation gratuites','Free delivery & install',4),
  ('pack-premium','صالونان (استقبال + معيشة)','Deux salons (réception + séjour)','Two sofa sets (reception + living)',1),
  ('pack-premium','طاولة أكل فاخرة','Table à manger de luxe','Luxury dining table',2),
  ('pack-premium','طاولات جانبية + قهوة','Tables d''appoint + basse','Side tables + coffee table',3),
  ('pack-premium','توصيل وتركيب مجاني','Livraison & installation gratuites','Free delivery & install',4)
) as v(slug, label_ar, label_fr, label_en, sort_order) on pk.slug = v.slug
where not exists (select 1 from pack_items pi where pi.pack_id = pk.id);
