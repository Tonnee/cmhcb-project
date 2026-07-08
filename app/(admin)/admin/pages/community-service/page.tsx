import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import EditCommunityServicePageForm from "@/features/admin/components/edit-community-service-page-form";

export const metadata: Metadata = {
  title: "Customize Community Service Page | Admin Portal | CMHCB",
  description: "Manage page headings, subtitle, statistics, pillars, and detailed community service policy contents.",
};

export const dynamic = "force-dynamic";

export default async function AdminCommunityServicePage(): Promise<React.JSX.Element> {
  const dbContent = await prisma.communityServicePageContent.findFirst();

  const defaultContent = {
    id: "community-service-content",
    heroTitle: "Community Service Policy & Outreach",
    heroSubtitle: "Last Updated: May 2026",
    heroDescription: "At the Center for Mental Health and Care Bangladesh (CMHCB), we believe mental health support is a human right. Explore our structured community-oriented programs and the ethical guidelines that define our outreach initiatives.",
    introTitle: "Our Commitment to Bangladesh's Communities",
    introDescription1: "CMHCB dedicates a portion of its resources and clinical hours to pro-bono work, local community workshops, and disaster response. Through structured partnerships, we aim to bridge the mental health service gap in Bangladesh.",
    introDescription2: "Our practitioners actively volunteer to implement community support initiatives, adhering to the same high ethical standards, confidentiality, and professional competence required in our standard clinical practices.",
    stats: JSON.stringify([
      { value: "15%", title: "Clinical Hours Allocation", description: "Dedicated to free community and pro-bono care" },
      { value: "2,500+", title: "Beneficiaries Reached", description: "Through awareness campaigns and workshops" },
      { value: "40+", title: "Institutional Partners", description: "Schools, NGOs, and voluntary local networks" }
    ]),
    pillars: JSON.stringify([
      { badge: "Clinical Care", title: "Pro-Bono Clinic Services", description: "Providing free individual psychological counseling and assessment sessions to marginalized or low-income communities who lack access to mental health facilities.", iconName: "userGroup" },
      { badge: "Education", title: "School Mental Health Programs", description: "Partnering with schools and educational institutions to offer free teacher workshops on identifying student distress and classroom emotional support.", iconName: "academicCap" },
      { badge: "Awareness", title: "Community Open Circles", description: "Hosting free public workshops, mental health awareness seminars, and support circles in both urban and rural areas of Bangladesh to combat social stigma.", iconName: "globe" },
      { badge: "Crisis Support", title: "Frontline & Crisis Training", description: "Equipping disaster relief groups, community leaders, and volunteer healthcare workers with basic Psychological First Aid (PFA) and coping toolkits.", iconName: "shield" }
    ]),
    eligibilityTitle: "Eligibility & Verification",
    eligibilityDescription: "To ensure that our community and pro-bono services reach the individuals who need them most, we maintain a clear verification framework. Services are allocated based on these parameters:",
    eligibilityItems: JSON.stringify([
      { title: "Economic Assessment", description: "Priority is given to clients verified by local council representatives or recognized NGOs as financially disadvantaged." },
      { title: "Referrals from Public Facilities", description: "Cases referred directly from government hospitals, community clinics, or educational boards." },
      { title: "Emergency Outreach Triage", description: "Immediate temporary counseling access for groups impacted by localized environmental disasters or sudden trauma." }
    ]),
    guidelinesTitle: "Operational Guidelines",
    guidelinesDescription: "CMHCB maintains strong professional boundaries in its volunteer and outreach services to guarantee safety, quality, and clinical ethics.",
    guidelinesItems: JSON.stringify([
      { title: "1. Scope of Care Limitations", description: "Our community programs do not replace specialized medical procedures or full-scale emergency crisis lines. Severe clinical conditions requiring hospitalization are referred to government psychiatric departments." },
      { title: "2. Supervision and Accountability", description: "All volunteer psychologists and counseling facilitators operate under the clinical supervision of senior licensed clinical psychologists to monitor session quality." },
      { title: "3. Strict Consent and Privacy", description: "No clinical information or media captured during outreach operations will be published or shared without prior written consent from participants." }
    ]),
    ctaTitle: "Request a Community Outreach Session",
    ctaDescription: "Are you an NGO, school, university, or local community leader looking to partner with CMHCB for mental health awareness training or counseling camps? Write to our coordinator today.",
    ctaEmail: "outreach@cmhcbd.com"
  };

  const content = dbContent || defaultContent;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-marcellus text-3xl font-bold text-dark-green">
          Customize Community Service Policy
        </h1>
        <p className="font-sans text-sm text-light-ash">
          Edit the page titles, subtitles, statistics, pillars, guidelines, eligibility rules, and outreach email coordinates.
        </p>
      </div>

      <EditCommunityServicePageForm initialContent={content} />
    </div>
  );
}
