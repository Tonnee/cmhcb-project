export const DESIGN_SYSTEM = {
  colors: {
    primary: "#0D8C09",
    "primary-dark": "#035300",
    secondary: "#72C100",
    accent: "#F9A620",
    dark: "#14080E",
    "light-ash": "#49475B",
    light: "#F0F0F0",
    "dark-green": "#012100",
    "dark-green-overlay": "rgba(0, 12, 0, 0.6)",
    "footer-bg": "#1E1E1E",
    muted: "#D9D9D9",
    "card-secondary": "rgba(73, 71, 91, 0.1)",
    "page-bg": "#F9FFF9",
  },
  backgrounds: {
    page: "#F9FFF9",                // bg-page-bg
    card: "#FFFFFF",                // bg-white
    footer: "#1E1E1E",              // bg-footer-bg
    darkSection: "#012100",         // bg-dark-green
    lightSection: "#F0F0F0",        // bg-light
    overlay: "rgba(0, 12, 0, 0.6)",  // bg-dark-green-overlay
    primaryLight: "rgba(13, 140, 9, 0.1)", // bg-primary/10
    cardSecondary: "rgba(73, 71, 91, 0.1)", // bg-card-secondary
  },
  layout: {
    container: "container",
    containerMaxWidth: "1156px",
  },
  spacing: {
    xs: "0.5rem",       // 8px  (e.g., gap-2)
    sm: "1rem",         // 16px (e.g., p-4, gap-4)
    md: "1.5rem",       // 24px (e.g., p-6, gap-6, mb-6)
    lg: "2rem",         // 32px (e.g., p-8, mb-8)
    xl: "2.5rem",       // 40px (e.g., p-10, mb-10)
    xxl: "3rem",        // 48px (e.g., p-12)
    sectionSm: "4rem",  // 64px (e.g., py-16)
    sectionMd: "5rem",  // 80px (e.g., py-20)
    sectionLg: "6rem",  // 96px (e.g., py-24)
  },
  borders: {
    thin: "1px solid",
    medium: "2px solid",
    colors: {
      muted: "#D9D9D9",
      mutedLight: "rgba(217, 217, 217, 0.3)",
      gray100: "#F3F4F6",
      gray200: "#E5E7EB",
    },
  },
  borderRadius: {
    lg: "8px",          // 0.5rem (e.g., rounded-lg icons wrapper)
    xl: "12px",         // 0.75rem (e.g., rounded-xl inputs, buttons)
    "2xl": "16px",      // 1rem (e.g., rounded-2xl map card)
    "24": "24px",       // 1.5rem (e.g., rounded-[24px] hero container)
    "3xl": "24px",      // 1.5rem (e.g., rounded-3xl cards and approach blocks)
    "32": "32px",       // 2rem (e.g., rounded-[32px] appointment form wrapper)
    full: "9999px",     // (e.g., rounded-full badges, pill buttons)
  },
  list: {
    bullet: "w-1.5 h-1.5 rounded-full shrink-0 mt-[10px]",
    item: "flex items-start gap-4",
    text: "font-sans font-normal text-base md:text-lg leading-relaxed text-light-ash/90",
    textMuted: "font-sans font-normal text-base text-light-ash/80 leading-relaxed",
  },
  typography: {
    fonts: {
      sans: "DM Sans, sans-serif",
      marcellus: "Marcellus, serif",
    },
    body: "text-base text-dark font-sans",
    heroHeading: "text-[54px] font-marcellus leading-[1.1]",
  },
};