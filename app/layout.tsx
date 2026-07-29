import type { Metadata } from "next";
import { Marcellus, DM_Sans } from "next/font/google";
import { Header } from "@/components/layout/header";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import prisma from "@/lib/prisma";
import { JsonLd } from "@/components/shared/json-ld";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cmhcbd.com"),
  title: {
    default: "Center for Mental Health and Care, Bangladesh (CMHCB)",
    template: "%s | CMHCB",
  },
  description:
    "Expert mental health services in Bangladesh including individual, couple, family, and child therapy. Book sessions with experienced clinical psychologists.",
  keywords: [
    "Mental Health Bangladesh",
    "Psychologist in Dhaka",
    "Therapy Bangladesh",
    "Counseling Center Dhaka",
    "Psychotherapy CMHCB",
    "Child Therapy",
    "Couple Counseling",
  ],
  authors: [{ name: "CMHCB", url: "https://cmhcbd.com" }],
  creator: "Center for Mental Health and Care, Bangladesh",
  publisher: "Center for Mental Health and Care, Bangladesh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cmhcbd.com",
    siteName: "Center for Mental Health and Care, Bangladesh (CMHCB)",
    title: "Center for Mental Health and Care, Bangladesh (CMHCB)",
    description:
      "Expert mental health services in Bangladesh including individual, couple, family, and child therapy.",
    images: [
      {
        url: "/cmhcb-mental-health-care.png",
        width: 1200,
        height: 630,
        alt: "Center for Mental Health and Care, Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Center for Mental Health and Care, Bangladesh (CMHCB)",
    description:
      "Expert mental health services in Bangladesh including individual, couple, family, and child therapy.",
    images: ["/cmhcb-mental-health-care.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let footerContactInfo = null;
  let socialLinks: string[] = [];

  try {
    const contactData = await prisma.contactPageContent.findFirst();
    if (contactData) {
      footerContactInfo = {
        phone: contactData.phone,
        email: contactData.email,
        address: [
          contactData.addressLine1,
          contactData.addressLine2,
          contactData.addressLine3,
        ].filter(Boolean),
        socials: {
          Facebook: contactData.facebookUrl,
          Instagram: contactData.instagramUrl,
          Twitter: contactData.twitterUrl,
          LinkedIn: contactData.linkedinUrl,
        },
      };
      socialLinks = [
        contactData.facebookUrl,
        contactData.instagramUrl,
        contactData.twitterUrl,
        contactData.linkedinUrl,
      ].filter(Boolean) as string[];
    }
  } catch (error) {
    console.error("Error fetching contact page content for root layout:", error);
  }

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "MedicalBusiness"],
    "@id": "https://cmhcbd.com/#organization",
    name: "Center for Mental Health and Care, Bangladesh",
    alternateName: "CMHCB",
    url: "https://cmhcbd.com",
    logo: "https://cmhcbd.com/cmhcb-mental-health-care.png",
    description:
      "Leading professional center for mental health services, psychotherapy, and psychological assessment in Bangladesh.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "BD",
      addressLocality: "Dhaka",
    },
    sameAs: socialLinks.length > 0 ? socialLinks : undefined,
  };

  return (
    <html
      lang="en"
      className={`h-full antialiased ${marcellus.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd data={organizationJsonLd} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-page-bg" suppressHydrationWarning>
        <Header />
        {children}
        <Footer contactInfo={footerContactInfo} />
        <ScrollToTop />
      </body>
    </html>
  );
}
