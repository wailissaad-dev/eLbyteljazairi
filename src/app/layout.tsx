import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Amiri, Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import { siteUrl, business } from "@/lib/config";
import { OG_IMAGE, FAVICON } from "@/data/catalog";
import { LocaleBoot } from "@/components/providers/LocaleBoot";
import { ThemeBoot } from "@/components/providers/ThemeBoot";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});
const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "البيت الجزائري — صالونات فاخرة | رأس الوادي، برج بوعريريج",
  description:
    "البيت الجزائري — تصميم وتنفيذ صالونات وأثاث فاخر بلمسة جزائرية أصيلة. أيلا، مودرن، أقمشة Nevine. رأس الوادي، ولاية برج بوعريريج.",
  keywords: [
    "صالونات فاخرة",
    "أثاث الجزائر",
    "صالونات برج بوعريريج",
    "أثاث رأس الوادي",
    "صالون مودرن",
    "أثاث جزائري",
    "البيت الجزائري",
    "صالونات أيلا",
  ],
  authors: [{ name: "البيت الجزائري" }],
  alternates: { canonical: "/" },
  icons: { icon: FAVICON, apple: FAVICON },
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    siteName: "البيت الجزائري",
    title: "البيت الجزائري — صالونات فاخرة | يصمّم وينفّذ 🇩🇿",
    description: "تصميم وتنفيذ صالونات وأثاث فاخر بلمسة جزائرية أصيلة. رأس الوادي، برج بوعريريج.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "البيت الجزائري" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "البيت الجزائري — صالونات فاخرة",
    description: "تصميم وتنفيذ صالونات وأثاث فاخر بلمسة جزائرية أصيلة 🇩🇿",
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f0" },
    { media: "(prefers-color-scheme: dark)", color: "#080808" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Runs before paint to set the theme class with no flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='light'){d=false}else if(t==='dark'){d=true}document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  name: "البيت الجزائري",
  description: "تصميم وتنفيذ صالونات وأثاث فاخر بلمسة جزائرية أصيلة",
  url: siteUrl,
  image: `${siteUrl}${OG_IMAGE}`,
  telephone: business.phones[0].tel,
  address: {
    "@type": "PostalAddress",
    addressLocality: business.address.locality,
    addressRegion: business.address.region,
    addressCountry: business.address.country,
  },
  areaServed: "DZ",
  sameAs: [business.social.facebook, business.social.instagram, business.social.tiktok],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = headers().get("x-nonce") ?? undefined;
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${cairo.variable} ${tajawal.variable}`}>
      <body className="font-body bg-bg-primary text-ink-primary antialiased">
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LocaleBoot />
        <ThemeBoot />
        {children}
      </body>
    </html>
  );
}
