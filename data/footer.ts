export interface FooterLink {
  label: string;
  href: string;
  isHighlighted?: boolean;
}

export interface FooterLinkColumn {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  label: string;
  href: string;
}

export const FOOTER_LINK_COLUMNS: FooterLinkColumn[] = [
  {
    title: "Company & Services",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Our Therapists", href: "/therapists" },
      { label: "Training", href: "/training" },
      { label: "Affiliation", href: "/affiliation" },
      { label: "Success Stories", href: "/success-stories" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Resources & Support",
    links: [
      { label: "Support", href: "/support" },
      { label: "Events", href: "/events" },
      { label: "Workshops", href: "/workshops" },
      { label: "Blog", href: "/blog" },
      { label: "FAQs", href: "/faqs" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Twitter", href: "https://x.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "YouTube", href: "https://youtube.com" },
];

export const LEGAL_LINKS: FooterLink[] = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Community Service", href: "/legal/community-service" },
];

export const CONTACT_INFO = {
  email: "info@cmhcbd.com",
  phone: "+8801974349569",
  address: [
    "CMHC Office Room, 78/2 (2nd Floor)",
    "New Airport Road, Tejkunipara",
    "Tejgoan, Dhaka-1212",
  ],
} as const;
