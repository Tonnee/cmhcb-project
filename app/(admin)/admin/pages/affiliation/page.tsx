import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import EditAffiliationPageForm from "@/features/admin/components/edit-affiliation-page-form";

export const metadata: Metadata = {
  title: "Customize Affiliation Page | Admin Portal | CMHCB",
  description: "Manage Affiliation program titles, partners showcase, benefit cards, and CTA promises.",
};

export const dynamic = "force-dynamic";

export default async function AdminAffiliationPage(): Promise<React.JSX.Element> {
  const dbContent = await prisma.affiliationPageContent.findFirst();

  const defaultContent = {
    id: "affiliation-content",
    heroTitle: "Partner with CMHCB",
    heroDescription: "Join our network of professionals and organizations dedicated to advancing mental health care in Bangladesh. Together, we can make a greater impact by expanding access to quality psychological support.",
    heroImage: "/hero-image/psychotherapy-counseling-session.png",
    partners: JSON.stringify([
      { name: "University of Dhaka", type: "Academic & Research Partner", abbr: "DU" },
      { name: "Bangladesh Psychological Association", type: "Professional Association", abbr: "BPA" },
      { name: "National Institute of Mental Health", type: "Clinical & Policy Affiliate", abbr: "NIMH" },
      { name: "Sajida Foundation", type: "Community Care Partner", abbr: "SF" },
      { name: "BRAC Institute of Educational Development", type: "Educational Research", abbr: "BRAC" },
      { name: "icddr,b", type: "Health Research Collaborator", abbr: "ICDDR" },
      { name: "National Trauma Counseling Centre", type: "Clinical Care Partner", abbr: "NTCC" },
      { name: "Moner Bandhu", type: "Mental Health Support Partner", abbr: "MB" }
    ]),
    benefits: JSON.stringify([
      {
        title: "Professional Network",
        description: "Gain access to a vast, multi-disciplinary network of leading psychiatrists, clinical psychologists, and therapists across Bangladesh.",
        icon: "UserGroup"
      },
      {
        title: "Research & Outreach",
        description: "Participate in clinical research, community advocacy programs, and large-scale mental health awareness campaigns.",
        icon: "GlobeAlt"
      },
      {
        title: "Continuous Learning",
        description: "Receive priority access to CMHCB's specialized workshops, masterclasses, and ongoing professional development training.",
        icon: "AcademicCap"
      },
      {
        title: "Referral Ecosystem",
        description: "Leverage mutual client referral pathways designed to connect individuals with the most appropriate expert care.",
        icon: "ArrowPath"
      },
      {
        title: "Brand Credibility",
        description: "Elevate your organization or private practice's visibility by aligning with a highly-regarded and trusted institution.",
        icon: "ShieldCheck"
      },
      {
        title: "Partner Support",
        description: "Get dedicated operational and administrative assistance to ensure smooth collaborations and streamline communications.",
        icon: "ChatBubble"
      }
    ]),
    ctaTitle: "Let's shape the future of mental health together",
    ctaDescription: "Join hands with CMHCB to foster clinical excellence, expand counseling accessibility, and build a stronger mental health support ecosystem across Bangladesh.",
    promises: JSON.stringify([
      "Standardized clinical referral protocols",
      "Shared mental health resources & research",
      "Joint training programs & events",
      "Co-branded advocacy & campaign visibility"
    ])
  };

  const content = dbContent || defaultContent;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-marcellus text-3xl font-bold text-dark-green">
          Customize Affiliation Page
        </h1>
        <p className="font-sans text-sm text-light-ash">
          Update the hero banner, partners showcase list, benefit cards, and CTA checkbox details.
        </p>
      </div>

      <EditAffiliationPageForm initialContent={content} />
    </div>
  );
}
