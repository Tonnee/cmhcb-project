import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { PageHero } from "@/components/shared/page-hero";
import { AllServices } from "@/features/services/components/all-services";
import { ServiceInfoSection } from "@/features/services/components/service-info-section";

export const metadata: Metadata = {
  title: "Our Psychotherapeutic Services | CMHCB",
  description: "Explore our professional, ethical, and evidence-based mental health services in Bangladesh.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage(): Promise<React.JSX.Element> {
  // Fetch services dynamically from database
  const [services, infoBlocks] = await Promise.all([
    prisma.service.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.serviceInfoBlock.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <main className="bg-page-bg">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
        ]}
        currentPage="Services"
        title="Professional, ethical, and evidence-based mental health care"
        description="At CMHC,B, we provide compassionate and confidential psychotherapeutic services to support individuals, couples, families, and organizations in improving mental well-being and quality of life."
        imageSrc="/mental-health-services-bangladesh.jpg"
        imageAlt="Group psychotherapeutic support session at Center for Mental Health and Care Bangladesh"
        ctaLabel="Book an Appointment"
        ctaHref="/appointment"
      />
      <AllServices services={services} />
      <ServiceInfoSection infoBlocks={infoBlocks} />
    </main>
  );
}
