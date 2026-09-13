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

export const revalidate = 60;

const DEFAULT_HERO = {
  heroTitle: "Professional, ethical, and evidence-based mental health care",
  heroDescription: "At CMHC,B, we provide compassionate and confidential psychotherapeutic services to support individuals, couples, families, and organizations in improving mental well-being and quality of life.",
  heroImage: "/mental-health-services-bangladesh.jpg",
  heroImageAlt: "Group psychotherapeutic support session at Center for Mental Health and Care Bangladesh",
};

export default async function ServicesPage(): Promise<React.JSX.Element> {
  // Fetch services and page content dynamically from database
  const [services, infoBlocks, pageContent] = await Promise.all([
    prisma.service.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.serviceInfoBlock.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.servicesPageContent.findFirst().catch(() => null),
  ]);

  const heroTitle = pageContent?.heroTitle || DEFAULT_HERO.heroTitle;
  const heroDescription = pageContent?.heroDescription || DEFAULT_HERO.heroDescription;
  const heroImage = pageContent?.heroImage || DEFAULT_HERO.heroImage;
  const heroImageAlt = pageContent?.heroImageAlt || DEFAULT_HERO.heroImageAlt;

  return (
    <main className="bg-page-bg">
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
        ]}
        currentPage="Services"
        title={heroTitle}
        description={heroDescription}
        imageSrc={heroImage}
        imageAlt={heroImageAlt}
        ctaLabel="Book an Appointment"
        ctaHref="/appointment"
      />
      <AllServices services={services} />
      <ServiceInfoSection infoBlocks={infoBlocks} />
    </main>
  );
}
