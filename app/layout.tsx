import type { Metadata } from "next";
import { Marcellus, DM_Sans } from "next/font/google";
import { Header } from "@/components/layout/header";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import prisma from "@/lib/prisma";

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
  title: "Center for Mental Health and Care, Bangladesh",
  description: "Expert mental health services including individual, family, and child therapy. Book sessions with experienced therapists and start your journey to better well-being today.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let footerContactInfo = null;
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
    }
  } catch (error) {
    console.error("Error fetching contact page content for root layout:", error);
  }

  return (
    <html
      lang="en"
      className={`h-full antialiased ${marcellus.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-page-bg" suppressHydrationWarning>
        <Header />
        {children}
        <Footer contactInfo={footerContactInfo} />
        <ScrollToTop />
      </body>
    </html>
  );
}

