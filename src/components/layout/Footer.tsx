"use client";

import { Info, Phone, Mail, MapPin } from "lucide-react";
import { AlgeriaFlag, WhatsAppIcon, InstagramIcon, FacebookIcon, TikTokIcon } from "@/components/ui/brands";
import { useT } from "@/lib/useT";
import { waGreeting, waLink } from "@/lib/config";
import { useSiteData } from "@/components/providers/SiteDataProvider";
import { about } from "@/data/content";

export function Footer() {
  const { t, L, locale } = useT();
  const { settings } = useSiteData();
  const wa = waLink(waGreeting[locale] || waGreeting.ar, settings.whatsappPhone);
  const year = new Date().getFullYear();

  const socials = [
    { href: wa, label: "WhatsApp", Icon: WhatsAppIcon },
    { href: settings.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings.tiktok, label: "TikTok", Icon: TikTokIcon },
  ];

  return (
    <footer className="border-t border-gold/20 bg-bg-primary">
      <div className="mx-auto max-w-container px-4 py-10 md:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Info size={18} className="text-gold" />
              <h3 className="font-display text-lg font-bold text-gold">{t("foot_about")}</h3>
            </div>
            <p className="font-body text-sm leading-relaxed text-ink-secondary">{L(about.paragraphs[0])}</p>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <Phone size={18} className="text-gold" />
              <h3 className="font-display text-lg font-bold text-gold">{t("foot_data")}</h3>
            </div>
            <ul className="space-y-2.5 font-body text-sm text-ink-secondary">
              <li className="flex flex-wrap items-center gap-2">
                <Phone size={16} className="text-gold" />
                {settings.phones.map((p, i) => (
                  <span key={p.tel} className="flex items-center gap-2">
                    {i > 0 && <span className="opacity-40">/</span>}
                    <a href={`tel:${p.tel}`} className="transition-colors hover:text-gold" dir="ltr">
                      {p.display}
                    </a>
                  </span>
                ))}
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-gold" />
                <a href={`mailto:${settings.email}`} className="transition-colors hover:text-gold" dir="ltr">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-gold" />
                <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold">
                  {settings.addressLocality}، {settings.addressRegion}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <WhatsAppIcon className="h-[18px] w-[18px] text-gold" />
              <h3 className="font-display text-lg font-bold text-gold">{t("foot_follow")}</h3>
            </div>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-gold/20 text-gold transition-colors hover:border-gold/60"
                >
                  <s.Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-1.5 border-t border-gold/10 pt-6 text-center font-body text-xs text-ink-secondary">
          <span>
            © {year} البيت الجزائري — {settings.addressLocality}، {settings.addressRegion}
          </span>
          <AlgeriaFlag className="h-3 w-auto rounded-[2px]" />
        </div>
      </div>
    </footer>
  );
}
