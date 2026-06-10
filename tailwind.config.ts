import type { Config } from "tailwindcss";

/** Colors are driven by CSS variables (RGB channels) so the whole UI
 *  re-themes when the `.dark` class is toggled on <html>. */
const ch = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: ch("--c-bg-primary"),
          primary: ch("--c-bg-primary"),
          secondary: ch("--c-bg-secondary"),
          card: ch("--c-bg-card"),
          cardHover: ch("--c-bg-card-hover"),
        },
        gold: {
          DEFAULT: ch("--c-gold"),
          light: ch("--c-gold-light"),
          dark: ch("--c-gold-dark"),
        },
        ink: {
          primary: ch("--c-ink-primary"),
          secondary: ch("--c-ink-secondary"),
          muted: ch("--c-ink-muted"),
        },
        whatsapp: "#25d366",
      },
      fontFamily: {
        display: ["var(--font-amiri)", "Amiri", "serif"],
        body: ["var(--font-cairo)", "Cairo", "sans-serif"],
        label: ["var(--font-tajawal)", "Tajawal", "sans-serif"],
      },
      maxWidth: {
        container: "1280px",
      },
      fontSize: {
        hero: ["clamp(2.4rem,6vw,4.2rem)", { lineHeight: "1.2", fontWeight: "700" }],
        section: ["clamp(1.8rem,4vw,2.8rem)", { lineHeight: "1.3", fontWeight: "600" }],
      },
      spacing: {
        section: "96px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(.23,1,.32,1)",
        soft: "cubic-bezier(.16,1,.3,1)",
      },
      keyframes: {
        fade: { from: { opacity: "0" }, to: { opacity: "1" } },
        zoom: {
          from: { opacity: "0", transform: "scale(.94)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        riseIn: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        floatY: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
      },
      animation: {
        fade: "fade .3s ease",
        zoom: "zoom .35s cubic-bezier(.16,1,.3,1)",
        riseIn: "riseIn .7s cubic-bezier(.23,1,.32,1) both",
        floatY: "floatY 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
