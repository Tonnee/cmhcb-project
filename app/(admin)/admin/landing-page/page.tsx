import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import EditLandingPageForm from "@/features/admin/components/edit-landing-page-form";

export const metadata: Metadata = {
  title: "Customize Landing Page | Admin Portal | CMHCB",
  description: "Dynamic landing page settings, statistics counters, and background image customizations.",
};

export const dynamic = "force-dynamic";

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
  };

  const content = landingContent || defaultContent;

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
