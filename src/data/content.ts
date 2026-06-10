import type { Localized } from "@/lib/types";

export const features: { icon: string; title: Localized; desc: Localized }[] = [
  {
    icon: "Sparkles",
    title: { ar: "تصاميم عصرية", fr: "Designs modernes", en: "Modern designs" },
    desc: {
      ar: "نتابع أحدث اتجاهات التصميم الداخلي ونطبّقها بلمسة جزائرية.",
      fr: "On suit les tendances du design d'intérieur, avec une touche algérienne.",
      en: "We follow current interior trends and add an Algerian touch.",
    },
  },
  {
    icon: "Award",
    title: { ar: "جودة عالية", fr: "Haute qualité", en: "High quality" },
    desc: {
      ar: "خامات محلية ومستوردة منتقاة، ومتابعة في كل مرحلة من الإنتاج.",
      fr: "Matériaux locaux et importés sélectionnés, suivis à chaque étape.",
      en: "Selected local and imported materials, checked at every step.",
    },
  },
  {
    icon: "ShieldCheck",
    title: { ar: "ضمان ومصداقية", fr: "Garantie & confiance", en: "Warranty & trust" },
    desc: {
      ar: "نقف وراء كل قطعة نصنعها، وكلمتنا قبل بيعنا.",
      fr: "On assume chaque pièce qu'on fabrique, parole donnée.",
      en: "We stand behind every piece we make.",
    },
  },
  {
    icon: "Truck",
    title: { ar: "توصيل وتركيب", fr: "Livraison & pose", en: "Delivery & install" },
    desc: {
      ar: "نوصّل ونركّب في عين المكان عبر كامل ولايات الوطن.",
      fr: "Livraison et installation sur place, dans toutes les wilayas.",
      en: "On-site delivery and installation across all provinces.",
    },
  },
];

export const about: {
  tag: Localized;
  paragraphs: Localized[];
  followLabel: Localized;
} = {
  tag: { ar: "البيت الجزائري يصمّم وينفّذ 🇩🇿", fr: "El Bayt El Djazairi conçoit et fabrique 🇩🇿", en: "El Bayt El Djazairi designs & builds 🇩🇿" },
  paragraphs: [
    {
      ar: "البيت الجزائري علامة جزائرية مختصة في تصميم وتنفيذ الصالونات والأثاث، من قلب رأس الوادي بولاية برج بوعريريج. نجمع بين التصميم العصري والصنعة الجزائرية، ونصنع لك قطعاً تليق ببيتك.",
      fr: "El Bayt El Djazairi est une marque algérienne spécialisée dans la conception et la fabrication de salons et de meubles, depuis Ras El Oued, wilaya de Bordj Bou Arreridj. On allie design moderne et savoir-faire algérien.",
      en: "El Bayt El Djazairi is an Algerian brand specialised in designing and building sofas and furniture, based in Ras El Oued, Bordj Bou Arreridj. We mix modern design with Algerian craftsmanship.",
    },
    {
      ar: "نصمّم حسب رغبتك، ننفّذ بإتقان، ونوصّل ونركّب في جميع أنحاء الجزائر.",
      fr: "On conçoit selon vos envies, on fabrique avec soin, et on livre et installe partout en Algérie.",
      en: "We design to your taste, build with care, and deliver and install anywhere in Algeria.",
    },
  ],
  followLabel: { ar: "تابعنا على مواقع التواصل", fr: "Suivez-nous", en: "Follow us" },
};

/** Headline business stats shown in the band under the hero. */
export const stats: { value: string; key: string }[] = [
  { value: "+500", key: "stat_projects" },
  { value: "+10", key: "stat_years" },
  { value: "🇩🇿", key: "stat_made" },
];
