"use client";

import { Phone, MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon, InstagramIcon, FacebookIcon, TikTokIcon } from "@/components/ui/brands";
import { useT } from "@/lib/useT";
import { about } from "@/data/content";
import { waGreeting, waLink } from "@/lib/config";
import { useSiteData } from "@/components/providers/SiteDataProvider";

export function About() {
  const { t, L, locale } = useT();
  const { settings } = useSiteData();
  const wa = waLink(waGreeting[locale] || waGreeting.ar, settings.whatsappPhone);

  const socials = [
    { href: wa, label: t("nav_wa"), Icon: WhatsAppIcon },
    { href: settings.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings.tiktok, label: "TikTok", Icon: TikTokIcon },
  ];

  return (
    <section id="about" className="bg-bg-secondary px-4 py-section md:px-12">
      <div className="mx-auto grid max-w-container grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="mb-4">
            <span className="ornament font-display text-xl">◈</span>
          </div>
          <h2 className="mb-3 font-display text-section text-ink-primary">{t("sec_about")}</h2>
          <p className="mb-6 font-display text-xl font-bold text-gold-light md:text-2xl">
            <span className="gold-shimmer">{L(about.tag)}</span>
          </p>
          {about.paragraphs.map((p, i) => (
            <p key={i} className="mb-4 font-body leading-relaxed text-ink-secondary">
              {L(p)}
            </p>
          ))}

          <h3 className="mb-4 mt-8 font-label text-sm uppercase tracking-wider text-ink-secondary">
            {L(about.followLabel)}
          </h3>
          <div className="flex flex-wrap gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover flex items-center gap-3 rounded-lg border border-gold/15 bg-bg-card px-4 py-3"
              >
                <s.Icon className="h-5 w-5 shrink-0 text-gold" />
                <span className="font-body text-sm text-ink-primary">{s.label}</span>
              </a>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={settings.phones[0]?.tel ? `tel:${settings.phones[0].tel}` : "#"}
              className="card-hover inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 font-body text-sm text-gold"
            >
              <Phone size={17} />
              <span dir="ltr">{settings.phones[0]?.display}</span>
            </a>
            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 font-body text-sm text-gold"
            >
              <MapPin size={17} />
              {settings.addressLocality}، {settings.addressRegion}
            </a>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="corner-frame overflow-hidden rounded-2xl border border-gold/40">
            <div className="zoomable aspect-[4/5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/img-14.jpg"
                alt={L(about.tag)}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
