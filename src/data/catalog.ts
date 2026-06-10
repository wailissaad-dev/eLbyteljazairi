import type { CategoryId, Fabric, GalleryItem, Localized, Pack, Product } from "@/lib/types";

export const HERO_IMAGE = "/images/img-03.jpg";
export const OG_IMAGE = "/images/img-02.png";
export const FAVICON = "/images/img-01.png";

export const categories: { id: CategoryId; label: Localized; icon: string }[] = [
  { id: "salons", label: { ar: "صالونات", fr: "Salons", en: "Sofas" }, icon: "Sofa" },
  { id: "tables", label: { ar: "طاولات صغيرة", fr: "Petites tables", en: "Small Tables" }, icon: "Table" },
  { id: "rooms", label: { ar: "غرف", fr: "Chambres", en: "Rooms" }, icon: "BedDouble" },
];

/** Salons — each has a real photo + a color swatch shown on the card. */
export const products: Product[] = [
  {
    id: "renault",
    ref: "RN-1",
    slug: "salon-renault",
    category: "salons",
    name: { ar: "صالون رونو", fr: "Salon Renault", en: "Renault Sofa Set" },
    color: { ar: "بيج / كريمي مع خشب الجوز", fr: "Beige / crème, bois noyer", en: "Beige / cream with walnut wood" },
    price: 83000,
    images: [
      { src: "/products/salon-renault-1.png" },
      { src: "/products/salon-renault-2.png" },
      { src: "/products/salon-renault-3.png" },
      { src: "/products/salon-renault-4.png" },
      { src: "/products/salon-renault-5.png" },
    ],
    status: "available",
  },
  {
    id: "p1",
    ref: "AY-1",
    slug: "salon-ayla-beige",
    category: "salons",
    name: { ar: "صالون أيلا البيج الفاخر", fr: "Salon Ayla Beige", en: "Ayla Beige Sofa" },
    color: { ar: "بيج / كريمي", fr: "Beige / crème", en: "Beige / cream" },
    images: [{ src: "/images/img-04.jpg" }],
    status: "available",
  },
  {
    id: "p2",
    ref: "AY-2",
    slug: "salon-ayla-gris",
    category: "salons",
    name: { ar: "صالون أيلا الرمادي", fr: "Salon Ayla Gris", en: "Ayla Grey Sofa" },
    color: { ar: "رمادي فاتح", fr: "Gris clair", en: "Light grey" },
    images: [{ src: "/images/img-05.jpg" }],
    status: "available",
  },
  {
    id: "p3",
    ref: "AY-3",
    slug: "salon-ayla-olive",
    category: "salons",
    name: { ar: "صالون أيلا الزيتوني", fr: "Salon Ayla Olive", en: "Ayla Olive Sofa" },
    color: { ar: "زيتوني / كاكي", fr: "Olive / kaki", en: "Olive / khaki" },
    images: [{ src: "/images/img-06.jpg" }],
    status: "available",
  },
  {
    id: "p4",
    ref: "MD-1",
    slug: "salon-moderne-gris-fonce",
    category: "salons",
    name: { ar: "صالون مودرن رمادي غامق", fr: "Salon Moderne Gris Foncé", en: "Modern Dark Grey Sofa" },
    color: { ar: "رمادي غامق", fr: "Gris foncé", en: "Dark grey" },
    images: [{ src: "/images/img-07.jpg" }],
    status: "available",
  },
  {
    id: "p5",
    ref: "MD-2",
    slug: "salon-moderne-bleu",
    category: "salons",
    name: { ar: "صالون مودرن أزرق طيفي", fr: "Salon Moderne Bleu", en: "Modern Spectral Blue Sofa" },
    color: { ar: "أزرق سماوي", fr: "Bleu ciel", en: "Sky blue" },
    images: [{ src: "/images/img-08.jpg" }],
    status: "available",
  },
  {
    id: "p6",
    ref: "MD-3",
    slug: "salon-moderne-terre",
    category: "salons",
    name: { ar: "صالون مودرن طيني دافئ", fr: "Salon Moderne Terre", en: "Modern Warm Clay Sofa" },
    color: { ar: "طيني / بني دافئ", fr: "Terracotta / brun", en: "Clay / warm brown" },
    images: [{ src: "/images/img-09.jpg" }],
    status: "available",
  },
  {
    id: "p7",
    ref: "MD-4",
    slug: "salon-moderne-creme",
    category: "salons",
    name: { ar: "صالون مودرن كريمي ناعم", fr: "Salon Moderne Crème", en: "Modern Soft Cream Sofa" },
    color: { ar: "كريمي ناعم", fr: "Crème doux", en: "Soft cream" },
    images: [{ src: "/images/img-10.jpg" }],
    status: "available",
  },
  {
    id: "p8",
    ref: "MD-5",
    slug: "salon-moderne-terracotta",
    category: "salons",
    name: { ar: "صالون مودرن توب ترابي", fr: "Salon Moderne Terracotta", en: "Modern Earthy Sofa" },
    color: { ar: "ترابي دافئ", fr: "Terre chaude", en: "Warm earth" },
    images: [{ src: "/images/img-11.jpg" }],
    status: "available",
  },
  {
    id: "p9",
    ref: "MD-6",
    slug: "salon-moderne-gris-clair",
    category: "salons",
    name: { ar: "صالون مودرن رمادي فاتح", fr: "Salon Moderne Gris Clair", en: "Modern Light Grey Sofa" },
    color: { ar: "رمادي فاتح", fr: "Gris clair", en: "Light grey" },
    images: [{ src: "/images/img-12.jpg" }],
    status: "available",
  },
];

/** Color swatch hex shown as a dot on the salon cards (decorative). */
export const swatch: Record<string, string> = {
  renault: "#E5D5B8",
  p1: "#E5D5B8",
  p2: "#C9C9CE",
  p3: "#6E7444",
  p4: "#4A4D52",
  p5: "#8FB4CC",
  p6: "#9C6B4A",
  p7: "#EADBC2",
  p8: "#B5794E",
  p9: "#BFC2C7",
};

/** Small tables — no photos in the source; rendered with an icon tile. */
export const tables: (Product & { icon: string; tileBg: string; swatchHex: string; badge?: Localized })[] = [
  {
    id: "t1",
    ref: "TB-1",
    slug: "table-bois-fait-main",
    category: "tables",
    name: { ar: "طاولة خشبية مصممة يدوياً", fr: "Table en bois faite main", en: "Handmade Wooden Table" },
    color: { ar: "خشب طبيعي", fr: "Bois naturel", en: "Natural wood" },
    images: [],
    status: "available",
    icon: "TreePine",
    tileBg: "linear-gradient(135deg,#1a1410 0%,#241a12 100%)",
    swatchHex: "#8B5A2B",
    badge: { ar: "صناعة يدوية", fr: "Fait main", en: "Handmade" },
  },
  {
    id: "t2",
    ref: "TB-2",
    slug: "table-verre-moderne",
    category: "tables",
    name: { ar: "طاولة زجاجية عصرية", fr: "Table en verre moderne", en: "Modern Glass Table" },
    color: { ar: "زجاج / معدن", fr: "Verre / métal", en: "Glass / metal" },
    images: [],
    status: "available",
    icon: "Square",
    tileBg: "linear-gradient(135deg,#101418 0%,#16202a 100%)",
    swatchHex: "#9FB8C4",
  },
  {
    id: "t3",
    ref: "TB-3",
    slug: "ensemble-tables-basses",
    category: "tables",
    name: { ar: "طقم طاولات قهوة", fr: "Ensemble de tables basses", en: "Coffee Table Set" },
    color: { ar: "حسب الطلب", fr: "Sur mesure", en: "Made to order" },
    images: [],
    status: "available",
    icon: "Coffee",
    tileBg: "linear-gradient(135deg,#16120d 0%,#1f1812 100%)",
    swatchHex: "#C9973A",
  },
];

/** Rooms — "coming soon" teasers (no ordering, just a WhatsApp notify link). */
export const rooms: { id: string; icon: string; name: Localized; desc: Localized }[] = [
  {
    id: "r1",
    icon: "BedDouble",
    name: { ar: "غرفة نوم كاملة", fr: "Chambre complète", en: "Full Bedroom" },
    desc: {
      ar: "سرير، خزانة، وكومود بتصميم متناسق.",
      fr: "Lit, armoire et commode, design coordonné.",
      en: "Bed, wardrobe and dresser in a coordinated design.",
    },
  },
  {
    id: "r2",
    icon: "Armchair",
    name: { ar: "غرفة معيشة متكاملة", fr: "Séjour complet", en: "Complete Living Room" },
    desc: {
      ar: "حلول أثاث متكاملة لغرفة المعيشة بأناقة عصرية.",
      fr: "Solutions meubles pour le séjour, style moderne.",
      en: "Complete living-room furniture in a modern style.",
    },
  },
  {
    id: "r3",
    icon: "Baby",
    name: { ar: "غرفة أطفال", fr: "Chambre d'enfant", en: "Kids' Room" },
    desc: {
      ar: "أثاث آمن وعملي بألوان مبهجة لغرف الأطفال.",
      fr: "Meubles sûrs et pratiques, couleurs joyeuses.",
      en: "Safe, practical furniture in cheerful colors.",
    },
  },
];

export const packs: Pack[] = [
  {
    id: "pack-essentiel",
    icon: "Sofa",
    name: { ar: "باقة الأناقة", fr: "Pack Essentiel", en: "Essential Pack" },
    subtitle: { ar: "Pack Essentiel", fr: "باقة الأناقة", en: "باقة الأناقة" },
    items: [
      { label: { ar: "صالون فاخر (لون حسب الاختيار)", fr: "Salon de luxe (couleur au choix)", en: "Luxury sofa (color of your choice)" } },
      { label: { ar: "طاولة قهوة منسّقة", fr: "Table basse assortie", en: "Matching coffee table" } },
      { label: { ar: "توصيل وتركيب مجاني", fr: "Livraison & installation gratuites", en: "Free delivery & install" } },
    ],
    highlight: { ar: "عرض مميّز 🎁", fr: "Offre spéciale 🎁", en: "Special offer 🎁" },
    orderLabel: {
      ar: "باقة الأناقة (صالون فاخر + طاولة قهوة + توصيل وتركيب)",
      fr: "Pack Essentiel (salon + table basse + livraison & installation)",
      en: "Essential Pack (sofa + coffee table + delivery & install)",
    },
  },
  {
    id: "pack-famille",
    icon: "Armchair",
    featured: true,
    badge: { ar: "الأكثر طلباً ⭐", fr: "Le plus demandé ⭐", en: "Most popular ⭐" },
    name: { ar: "باقة العائلة", fr: "Pack Famille", en: "Family Pack" },
    subtitle: { ar: "Pack Famille", fr: "باقة العائلة", en: "باقة العائلة" },
    items: [
      { label: { ar: "صالون فاخر كامل", fr: "Salon de luxe complet", en: "Full luxury sofa set" } },
      { label: { ar: "طاولة أكل كبيرة", fr: "Grande table à manger", en: "Large dining table" } },
      { label: { ar: "طاولة صغيرة للقهوة", fr: "Petite table basse", en: "Small coffee table" } },
      { label: { ar: "توصيل وتركيب مجاني", fr: "Livraison & installation gratuites", en: "Free delivery & install" } },
    ],
    highlight: { ar: "أفضل قيمة 💎", fr: "Meilleur rapport 💎", en: "Best value 💎" },
    orderLabel: {
      ar: "باقة العائلة (صالون فاخر كامل + طاولة أكل كبيرة + طاولة قهوة صغيرة + توصيل وتركيب)",
      fr: "Pack Famille (salon complet + grande table à manger + table basse + livraison & installation)",
      en: "Family Pack (full sofa set + large dining table + coffee table + delivery & install)",
    },
  },
  {
    id: "pack-premium",
    icon: "Gem",
    name: { ar: "الباقة الفاخرة", fr: "Pack Premium", en: "Premium Pack" },
    subtitle: { ar: "Pack Premium", fr: "الباقة الفاخرة", en: "الباقة الفاخرة" },
    items: [
      { label: { ar: "صالونان (استقبال + معيشة)", fr: "Deux salons (réception + séjour)", en: "Two sofa sets (reception + living)" } },
      { label: { ar: "طاولة أكل فاخرة", fr: "Table à manger de luxe", en: "Luxury dining table" } },
      { label: { ar: "طاولات جانبية + قهوة", fr: "Tables d'appoint + basse", en: "Side tables + coffee table" } },
      { label: { ar: "توصيل وتركيب مجاني", fr: "Livraison & installation gratuites", en: "Free delivery & install" } },
    ],
    highlight: { ar: "تجهيز كامل 👑", fr: "Aménagement complet 👑", en: "Full setup 👑" },
    orderLabel: {
      ar: "الباقة الفاخرة (صالونان: استقبال + معيشة + طاولة أكل فاخرة + طاولات جانبية وقهوة + توصيل وتركيب)",
      fr: "Pack Premium (deux salons + table à manger de luxe + tables d'appoint & basse + livraison & installation)",
      en: "Premium Pack (two sofa sets + luxury dining table + side & coffee tables + delivery & install)",
    },
  },
];

export const gallery: GalleryItem[] = [
  { src: "/images/img-13.jpg", caption: { ar: "صالون بيج كامل — رؤية علوية", fr: "Salon beige complet — vue de dessus", en: "Full beige sofa set — top view" } },
  { src: "/images/img-14.jpg", caption: { ar: "صالون ترابي فاخر", fr: "Salon terracotta de luxe", en: "Luxury earth-tone sofa" } },
  { src: "/images/img-15.jpg", caption: { ar: "كنبة كريمية بتفاصيل أنيقة", fr: "Canapé crème aux finitions élégantes", en: "Cream sofa with elegant details" } },
  { src: "/images/img-16.jpg", caption: { ar: "طاولة خشبية مصممة يدوياً", fr: "Table en bois faite main", en: "Handmade wooden table" } },
  { src: "/images/img-17.jpg", caption: { ar: "طاولة زجاجية عصرية", fr: "Table en verre moderne", en: "Modern glass table" } },
  { src: "/images/img-18.jpg", caption: { ar: "كتالوج أقمشة AYLA", fr: "Catalogue de tissus AYLA", en: "AYLA fabric catalogue" } },
];

export const fabrics: Fabric[] = [
  { src: "/images/img-19.jpg", caption: { ar: "ألوان دافئة — بيج، كريمي، بيج غامق", fr: "Tons chauds — beige, crème, beige foncé", en: "Warm tones — beige, cream, dark beige" } },
  { src: "/images/img-20.jpg", caption: { ar: "ألوان نابضة — خردلي، طيني، زيتوني، رمادي", fr: "Tons vifs — moutarde, terre, olive, gris", en: "Vivid tones — mustard, clay, olive, grey" } },
  { src: "/images/img-21.jpg", caption: { ar: "قماش Nevine الأصلي — جودة عالمية", fr: "Tissu Nevine original — qualité internationale", en: "Original Nevine fabric — world-class quality" } },
];
