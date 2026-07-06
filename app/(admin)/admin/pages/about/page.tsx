import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import EditAboutPageForm from "@/features/admin/components/edit-about-page-form";

export const metadata: Metadata = {
  title: "Customize About Us Page | Admin Portal | CMHCB",
  description: "Manage About Us page titles, mission, vision, and core value details.",
};

export const dynamic = "force-dynamic";

export default async function AdminAboutPage(): Promise<React.JSX.Element> {
  const dbContent = await prisma.aboutPageContent.findFirst();

  const defaultContent = {
    id: "about-content",
    heroTitle: "Dedicated to Your Mental Well-being",
    heroDescription: "The Center for Mental Health and Care Bangladesh (CMHCB) is a leading institution committed to providing accessible, compassionate, and high-quality psychological support to individuals and families across the nation.",
    heroImage: "/hero-image/psychotherapy-counseling-session.png",
    missionTitle: "Our Mission",
    missionText: "To provide accessible, compassionate, and evidence-based mental health care to individuals and communities across Bangladesh.",
    visionTitle: "Our Vision",
    visionText: "A Bangladesh where mental health is understood, valued, and prioritized as an essential component of overall well-being.",
    coreValues: JSON.stringify([
      {
        title: "Client-Centered Care",
        description: "We place our clients' unique needs, values, and goals at the heart of everything we do.",
        icon: "Heart"
      },
      {
        title: "Clinical Excellence",
        description: "Our licensed team delivers evidence-based therapeutic methods conforming to high global standards.",
        icon: "Shield"
      },
      {
        title: "Empathy & Compassion",
        description: "We cultivate a safe, warm, and judgment-free clinical environment for everyone.",
        icon: "Sparkles"
      }
    ])
  };

  const content = dbContent || defaultContent;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-marcellus text-3xl font-bold text-dark-green">
          Customize About Us Page
        </h1>
        <p className="font-sans text-sm text-light-ash">
          Update the hero heading, mission statements, vision descriptions, and core values list.
        </p>
      </div>

      <EditAboutPageForm initialContent={content} />
    </div>
  );
}
