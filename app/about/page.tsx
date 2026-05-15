import * as React from "react";
import type { Metadata } from "next";
import { PageFeatureHero } from "@/components/shared/page-feature-hero";
import { MissionVision } from "@/features/about/components/mission-vision";
import { CoreValues } from "@/features/about/components/core-values";

export const metadata: Metadata = {
  title: "About Us | CMHCB",
  description: "Learn about the Center for Mental Health and Care Bangladesh (CMHCB), our mission, vision, and core values.",
};

export default function AboutPage(): React.JSX.Element {
  return (
    <main>
      <PageFeatureHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" },
        ]}
        title="Dedicated to Your Mental Well-being"
        description="The Center for Mental Health and Care Bangladesh (CMHCB) is a leading institution committed to providing accessible, compassionate, and high-quality psychological support to individuals and families across the nation."
        image={{
          src: "/hero-image/psychotherapy-counseling-session.png",
          alt: "CMHCB facility and caring professionals",
        }}
        ctas={[
          {
            label: "Meet Our Therapists",
            variant: "primary",
            href: "/therapists",
            className: "bg-primary-dark hover:bg-primary-dark/90 border-primary-dark",
          },
          {
            label: "Our Services",
            variant: "outline",
            href: "/services",
            className: "text-primary-dark border-primary-dark hover:bg-primary-dark/10",
          },
        ]}
      />
      
      <MissionVision />
      
      <CoreValues />
    </main>
  );
}
