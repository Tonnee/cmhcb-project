import * as React from "react";
import type { Metadata } from "next";
import { PageFeatureHero } from "@/components/shared/page-feature-hero";
import { MissionVision } from "@/features/about/components/mission-vision";
import { CoreValues } from "@/features/about/components/core-values";

import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "About Us | CMHCB",
  description: "Learn about the Center for Mental Health and Care Bangladesh (CMHCB), our mission, vision, and core values.",
};

export default async function AboutPage(): Promise<React.JSX.Element> {
  const dbContent = await prisma.aboutPageContent.findFirst();

  const title = dbContent?.heroTitle || "Dedicated to Your Mental Well-being";
  const description = dbContent?.heroDescription || "The Center for Mental Health and Care Bangladesh (CMHCB) is a leading institution committed to providing accessible, compassionate, and high-quality psychological support to individuals and families across the nation.";
  const imageSrc = dbContent?.heroImage || "/hero-image/psychotherapy-counseling-session.png";

  const missionTitle = dbContent?.missionTitle || "Our Mission";
  const missionText = dbContent?.missionText || "To empower individuals to overcome mental health challenges through compassionate, evidence-based therapy. We strive to create a safe, inclusive environment where healing begins, resilience is built, and lasting emotional well-being is achieved.";

  const visionTitle = dbContent?.visionTitle || "Our Vision";
  const visionText = dbContent?.visionText || "To be the leading center for psychological care and advocacy in Bangladesh, fostering a society where mental health is prioritized, stigma is eradicated, and everyone has access to the support they need to thrive.";

  let coreValuesArray = [];
  if (dbContent?.coreValues) {
    try {
      coreValuesArray = JSON.parse(dbContent.coreValues);
    } catch (e) {
      console.error("Failed to parse core values:", e);
    }
  }

  return (
    <main>
      <PageFeatureHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" },
        ]}
        title={title}
        description={description}
        image={{
          src: imageSrc,
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
      
      <MissionVision
        missionTitle={missionTitle}
        missionText={missionText}
        visionTitle={visionTitle}
        visionText={visionText}
      />
      
      <CoreValues values={coreValuesArray} />
    </main>
  );
}
