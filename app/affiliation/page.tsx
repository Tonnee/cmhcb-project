import * as React from "react";
import type { Metadata } from "next";
import { PageFeatureHero } from "@/components/shared/page-feature-hero";
import PartnerNetwork from "@/features/affiliation/components/partner-network";
import AffiliationBenefits from "@/features/affiliation/components/affiliation-benefits";
import PartnerCta from "@/features/affiliation/components/partner-cta";

export const metadata: Metadata = {
  title: "Affiliation Program | CMHCB",
  description: "Join our affiliation program and become a partner with the Center for Mental Health and Care Bangladesh.",
};

export default function AffiliationPage(): React.JSX.Element {
  return (
    <main>
      <PageFeatureHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Affiliation", href: "/affiliation" },
        ]}
        title="Partner with CMHCB"
        description="Join our network of professionals and organizations dedicated to advancing mental health care in Bangladesh. Together, we can make a greater impact by expanding access to quality psychological support."
        image={{
          src: "/hero-image/psychotherapy-counseling-session.png",
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
      <PartnerNetwork />

      {/* 2. Why Affiliate with Us (Benefits) */}
      <AffiliationBenefits />

      {/* 3. Contact for Partnership CTA */}
      <PartnerCta />
    </main>
  );
}

