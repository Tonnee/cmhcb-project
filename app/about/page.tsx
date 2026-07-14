import * as React from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { MissionVision } from "@/features/about/components/mission-vision";
import { CoreValues } from "@/features/about/components/core-values";
import { getRequiredAdminSession } from "@/app/(admin)/admin/admin-management";
import { Container } from "@/components/layout/container";

import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "About Us | CMHCB",
  description: "Learn about the Center for Mental Health and Care Bangladesh (CMHCB), our mission, vision, and core values.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage(): Promise<React.JSX.Element> {
  let isAdmin = false;
  try {
    await getRequiredAdminSession();
    isAdmin = true;
  } catch {
    isAdmin = false;
  }

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
      {isAdmin && (
        <div className="bg-primary/10 border-b border-primary/20 py-3 text-center text-sm">
          <Container className="flex items-center justify-between">
            <span className="font-medium text-primary-dark font-sans">
              You are logged in as an Administrator.
            </span>
            <a
              href="/admin/pages/about"
              className="px-4 py-1.5 bg-primary-dark hover:bg-primary-dark/90 text-white rounded-lg font-semibold transition-all text-xs font-sans"
            >
              Edit Page Content
            </a>
          </Container>
        </div>
      )}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
        ]}
        currentPage="About Us"
        title={title}
        description={description}
        imageSrc={imageSrc}
        imageAlt="CMHCB facility and caring professionals"
        ctaLabel="Meet Our Therapists"
        ctaHref="/therapists"
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
