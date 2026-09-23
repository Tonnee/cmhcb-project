import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import EditLandingPageForm from "@/features/admin/components/edit-landing-page-form";
import { DEFAULT_FOOTER_SOCIALS, CONTACT_INFO } from "@/data/footer";

export const metadata: Metadata = {
  title: "Customize Landing Page | Admin Portal | CMHCB",
  description: "Dynamic landing page settings, statistics counters, and background image customizations.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLandingPage(): Promise<React.JSX.Element> {
  // Query dynamic database content
  const landingContent = await prisma.landingPageContent.findFirst();

  // Fallbacks if database not seeded
  const defaultContent = {
    id: "landing-content",
    heroHeadline: "Empowering Your <span class=\"text-accent\">Mind</span>, Transforming Your <span class=\"text-primary\">Life</span>",
    heroSubtitle: "At CMHC,B, we believe every individual deserves a supportive space to heal, grow, and thrive. Connect with the right therapist, right when you need it.",
    heroBgImage: "/hero-image/hero-bg.png",
    heroFigureImage: "/hero-image/hero-figure.png",
    wellbeingHeadline: "Our Commitment to Your <span class=\"text-accent\">Well-Being</span>",
    wellbeingSubtitle: "At CMHC,B, we are committed to delivering compassionate and effective mental health care. Explore how we've supported individuals on their path to emotional well-being and resilience.",
    experienceCount: 20,
    happyClientsCount: 1500,
    sessionsCount: 2800,
    satisfactionRate: 94,
    trainingHeadline: "Want to Make a <span class=\"text-primary-dark\">Difference</span> in <span class=\"text-accent\">Mental Health</span>?",
    trainingSubtitle: "Our specialized trainings equip professionals, educators, and caregivers with the tools needed to foster mental well-being in their communities.",
    trainingImage: "/mental-health-training-program.png",
    reviewCard1Title: "Real Experiences, Real Impact",
    reviewCard1Description: "Discover how our clients' lives have changed through therapy, training, and mental health support at CMHC,B.",
    reviewCard2Title: "Voices That Inspire Hope",
    reviewCard2Description: "Our clients share their journeys of transformation—honest reflections on the care and support they received at CMHC,B.",
    reviewPhoto1Image: "/home-review/bangladeshi-woman-mental-health-therapy-client.png",
    reviewPhoto1Alt: "Happy Bangladeshi woman sharing her positive therapy experience and emotional recovery at CMHCB",
    reviewPhoto2Image: "/home-review/bangladeshi-man-mental-health-therapy-client.png",
    reviewPhoto2Alt: "Confident Bangladeshi male client reflecting on successful mental health counseling sessions at CMHCB",
    footerSocials: JSON.stringify(DEFAULT_FOOTER_SOCIALS),
    footerPhone: CONTACT_INFO.phone,
    footerEmail: CONTACT_INFO.email,
    footerAddressLine1: CONTACT_INFO.address[0] || "",
    footerAddressLine2: CONTACT_INFO.address[1] || "",
    footerAddressLine3: CONTACT_INFO.address[2] || "",
  };

  const content = {
    ...defaultContent,
    ...(landingContent || {}),
    reviewCard1Title: landingContent?.reviewCard1Title ?? defaultContent.reviewCard1Title,
    reviewCard1Description: landingContent?.reviewCard1Description ?? defaultContent.reviewCard1Description,
    reviewCard2Title: landingContent?.reviewCard2Title ?? defaultContent.reviewCard2Title,
    reviewCard2Description: landingContent?.reviewCard2Description ?? defaultContent.reviewCard2Description,
    reviewPhoto1Image: landingContent?.reviewPhoto1Image ?? defaultContent.reviewPhoto1Image,
    reviewPhoto1Alt: landingContent?.reviewPhoto1Alt ?? defaultContent.reviewPhoto1Alt,
    reviewPhoto2Image: landingContent?.reviewPhoto2Image ?? defaultContent.reviewPhoto2Image,
    reviewPhoto2Alt: landingContent?.reviewPhoto2Alt ?? defaultContent.reviewPhoto2Alt,
    footerPhone: landingContent?.footerPhone || defaultContent.footerPhone,
    footerEmail: landingContent?.footerEmail || defaultContent.footerEmail,
    footerAddressLine1: landingContent?.footerAddressLine1 ?? defaultContent.footerAddressLine1,
    footerAddressLine2: landingContent?.footerAddressLine2 ?? defaultContent.footerAddressLine2,
    footerAddressLine3: landingContent?.footerAddressLine3 ?? defaultContent.footerAddressLine3,
    footerSocials: landingContent?.footerSocials || defaultContent.footerSocials,
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-marcellus text-3xl font-bold text-dark-green">
          Customize Landing Page
        </h1>
        <p className="font-sans text-sm text-light-ash">
          Manage layout headings, paragraph summaries, background banners, and statistics values.
        </p>
      </div>

      <EditLandingPageForm initialContent={content} />
    </div>
  );
}
