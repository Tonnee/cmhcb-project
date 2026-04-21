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
    title: "Important Links",
    links: [
      { label: "Our Therapist", href: "/therapists", isHighlighted: true },
      { label: "Services", href: "/services" },
      { label: "Training", href: "/training" },
      { label: "Blog", href: "/blog" },
      { label: "FAQs", href: "/faqs" },
      { label: "Workshops", href: "/workshops" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    title: "Important Links",
    links: [
      { label: "Events", href: "/events" },
      { label: "Success Stories", href: "/success-stories" },
      { label: "Gallery", href: "/gallery" },
      { label: "Affiliation", href: "/affiliation" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "News & Events", href: "/news-events" },
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
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Community Service", href: "/community-service" },
];

export const CONTACT_INFO = {
  email: "info@cmhcbd.com",
  phone: "+8801974349569",
  address: [
    "Target company Inc",
    "CMHC Office Room, 78/2 (2nd Floor)",
    "New Airport Road, Tejkunipara",
    "Tejgoan, Dhaka-1212",
  ],
} as const;
