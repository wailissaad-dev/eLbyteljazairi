"use client";

import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon, InstagramIcon, FacebookIcon, TikTokIcon } from "@/components/ui/brands";
import { useT } from "@/lib/useT";
import { waGreeting, waLink } from "@/lib/config";
import { useSiteData } from "@/components/providers/SiteDataProvider";

export function Contact() {
  const { t, locale } = useT();
  const { settings } = useSiteData();
  const wa = waLink(waGreeting[locale] || waGreeting.ar, settings.whatsappPhone);

  const socials = [
    { href: wa, label: "WhatsApp", Icon: WhatsAppIcon },
    { href: settings.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings.tiktok, label: "TikTok", Icon: TikTokIcon },
  ];

  return (
    <section id="contact" className="bg-bg-secondary px-4 py-section md:px-12">
      <div className="mx-auto max-w-container">
        <Reveal>
          <div className="corner-frame relative mx-auto max-w-4xl rounded-2xl border border-gold/40 bg-bg-secondary p-8 md:p-16">
            <div className="mb-10 text-center">
              <div className="mb-4 font-display text-2xl text-gold">◈</div>
              <h2 className="mb-3 font-display text-section text-ink-primary">{t("sec_contact")}</h2>
              <p className="font-body text-ink-secondary">{t("sec_contact_sub")}</p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <a
                href={`tel:${settings.phones[0]?.tel ?? ""}`}
                className="card-hover flex items-center gap-4 rounded-xl border border-gold/15 bg-bg-card p-5"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ background: "rgba(201,151,58,0.12)" }}>
                  <Phone size={20} className="text-gold" />
                </span>
                <div className="min-w-0">
                  <div className="mb-1 font-label text-xs uppercase tracking-wider text-ink-secondary">{t("contact_call")}</div>
                  <div className="truncate font-body font-bold text-ink-primary" dir="ltr">
                    {settings.phones.map((p) => p.display).join(" / ")}
                  </div>
                </div>
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="card-hover flex items-center gap-4 rounded-xl border border-gold/15 bg-bg-card p-5"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ background: "rgba(201,151,58,0.12)" }}>
                  <Mail size={20} className="text-gold" />
                </span>
                <div className="min-w-0">
                  <div className="mb-1 font-label text-xs uppercase tracking-wider text-ink-secondary">{t("contact_email")}</div>
                  <div className="truncate font-body font-bold text-ink-primary" dir="ltr">{settings.email}</div>
                </div>
              </a>
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover flex items-center gap-4 rounded-xl border border-gold/15 bg-bg-card p-5"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full" style={{ background: "rgba(201,151,58,0.12)" }}>
                  <MapPin size={20} className="text-gold" />
                </span>
                <div className="min-w-0">
                  <div className="mb-1 font-label text-xs uppercase tracking-wider text-ink-secondary">{t("contact_loc")}</div>
                  <div className="font-body font-bold text-ink-primary">
                    {settings.addressLocality}، ولاية {settings.addressRegion}
                  </div>
                </div>
              </a>
            </div>

            <div className="mb-8 flex justify-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-12 w-12 place-items-center rounded-full transition-transform hover:scale-110"
                  style={{ background: "rgba(201,151,58,0.12)" }}
                >
                  <s.Icon className="h-5 w-5 text-gold" />
                </a>
              ))}
            </div>

            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold flex min-h-[56px] w-full items-center justify-center gap-2 rounded-lg px-8 py-4 font-label text-base"
            >
              <MessageCircle size={22} />
              {t("nav_wa")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
