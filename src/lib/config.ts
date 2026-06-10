/**
 * Central business + site configuration.
 * Phone/site values can be overridden via env; everything else is constant.
 */

const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(/[^0-9]/g, "");

export const business = {
  /** WhatsApp number that receives orders — digits only, international format */
  whatsappPhone: rawPhone && rawPhone.length >= 9 ? rawPhone : "213770040474",
  phones: [
    { display: "0770 04 04 74", tel: "+213770040474" },
    { display: "0698 73 92 62", tel: "+213698739262" },
  ],
  email: "elbayteljazairi@gmail.com",
  address: {
    locality: "رأس الوادي",
    region: "برج بوعريريج",
    country: "DZ",
    mapsUrl: "https://maps.google.com/?q=Ras+el+oued+BBA+Algerie",
  },
  social: {
    instagram: "https://www.instagram.com/elbayt_eljazairi",
    facebook: "https://www.facebook.com/share/1MDTEdh8vz/",
    tiktok: "https://www.tiktok.com/@elbayt_eljazairi",
  },
} as const;

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://elbayt-eldjazairi.vercel.app"
).replace(/\/$/, "");

/** Pre-filled greeting used by the header / contact WhatsApp buttons. */
export const waGreeting: Record<string, string> = {
  ar: "السلام عليكم، أتواصل معكم من موقع البيت الجزائري وأرغب في الاستفسار عن صالوناتكم الفاخرة 🛋️",
  fr: "Bonjour, je vous contacte depuis le site El Bayt El Djazairi et je souhaite me renseigner sur vos salons 🛋️",
  en: "Hello, I'm reaching out from the El Bayt El Djazairi website and I'd like to ask about your sofas 🛋️",
};

export function waLink(message: string, phone = business.whatsappPhone): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
