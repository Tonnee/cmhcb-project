import * as React from "react";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { ServiceDescription } from "@/features/services/components/service-description";
import { ServiceProfessionals } from "@/features/services/components/service-professionals";
import { Faq } from "@/components/shared/faq";
import { SERVICES } from "@/features/services/data/services";
import { type Therapist } from "@/features/home/components/therapist-carousel";

// Shared therapist data — reused from the home page dataset
const THERAPISTS: Therapist[] = [
  {
    id: "t1",
    image: "/home-therapist/therapist-ruma-khondaker-1.png",
    name: "Ruma Khondaker",
    role: "Psychiatrist",
  },
  {
    id: "t2",
    image: "/home-therapist/therapist-ruma-khondaker-2.png",
    name: "Ruma Khondaker",
    role: "Psychiatrist",
  },
];

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;

  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: "Services", href: "/services" }]}
        currentPage={service.heroTitle}
        title={service.heroTitle}
        description={service.heroDescription}
        imageSrc="/pages-hero-background/1.png"
        imageAlt="Professional psychotherapy in Dhaka - CMHCB"
        ctaLabel="Book an Appointment"
        ctaHref="/book"
      />
      <ServiceDescription
        introduction={service.description.introduction}
        sections={service.description.sections}
        sessionDetails={{
          duration: service.duration,
          fees: service.fees,
        }}
      />
      <ServiceProfessionals therapists={THERAPISTS} />
      <Faq
        heading={`Frequently Asked Questions \u2013 ${service.title}`}
        items={service.faq}
      />
    </main>
  );
}