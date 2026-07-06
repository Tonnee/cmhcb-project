import * as React from "react";
import type { Metadata } from "next";
import { PageFeatureHero } from "@/components/shared/page-feature-hero";
import PartnerNetwork from "@/features/affiliation/components/partner-network";
import AffiliationBenefits from "@/features/affiliation/components/affiliation-benefits";
import PartnerCta from "@/features/affiliation/components/partner-cta";

import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Affiliation Program | CMHCB",
  description: "Join our affiliation program and become a partner with the Center for Mental Health and Care Bangladesh.",
};

export default async function AffiliationPage(): Promise<React.JSX.Element> {
  const dbContent = await prisma.affiliationPageContent.findFirst();

  const heroTitle = dbContent?.heroTitle || "Partner with CMHCB";
  const heroDescription = dbContent?.heroDescription || "Join our network of professionals and organizations dedicated to advancing mental health care in Bangladesh. Together, we can make a greater impact by expanding access to quality psychological support.";
  const heroImage = dbContent?.heroImage || "/hero-image/psychotherapy-counseling-session.png";

  let partners = [];
  if (dbContent?.partners) {
    try {
      partners = JSON.parse(dbContent.partners);
    } catch (e) {
      console.error("Failed to parse partners:", e);
    }
  }

  let benefits = [];
  if (dbContent?.benefits) {
    try {
      benefits = JSON.parse(dbContent.benefits);
    } catch (e) {
      console.error("Failed to parse benefits:", e);
    }
  }

  const ctaTitle = dbContent?.ctaTitle || "Let's shape the future of mental health together";
  const ctaDescription = dbContent?.ctaDescription || "Join hands with CMHCB to foster clinical excellence, expand counseling accessibility, and build a stronger mental health support ecosystem across Bangladesh.";

  let promises = [];
  if (dbContent?.promises) {
    try {
      promises = JSON.parse(dbContent.promises);
    } catch (e) {
      console.error("Failed to parse promises:", e);
    }
  }

  return (
    <main>
      <PageFeatureHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Affiliation", href: "/affiliation" },
        ]}
        title={heroTitle}
        description={heroDescription}
        image={{
          src: heroImage,
          alt: "Partnership and Collaboration",
        }}
        ctas={[
          {
            label: "Become a Partner",
            variant: "primary",
            href: "#partner-cta",
            className: "bg-primary-dark hover:bg-primary-dark/90 border-primary-dark",
          },
        ]}
      />

      {/* 1. Our Network showcase */}
      <PartnerNetwork partners={partners} />

      {/* 2. Why Affiliate with Us (Benefits) */}
      <AffiliationBenefits benefits={benefits} />

      {/* 3. Contact for Partnership CTA */}
      <PartnerCta
        ctaTitle={ctaTitle}
        ctaDescription={ctaDescription}
        promises={promises}
      />
    </main>
  );
}

