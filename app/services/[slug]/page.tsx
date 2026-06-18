import * as React from "react";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { ServiceDescription } from "@/features/services/components/service-description";
import { ServiceProfessionals } from "@/features/services/components/service-professionals";
import { Faq } from "@/components/shared/faq";
import { SERVICES } from "@/features/services/data/services";
import { THERAPISTS_DATA } from "@/features/therapists/data/therapists";
import { Metadata } from "next";



export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.title} | Services | CMHCB`,
    description: service.shortDescription,
  };
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

  const serviceTherapists = THERAPISTS_DATA.filter((therapist) =>
    therapist.services?.includes(slug)
  );

  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
        ]}
        currentPage={service.heroTitle}
        title={service.heroTitle}
        description={service.heroDescription}
        imageSrc="/pages-hero-background/1.png"
        imageAlt="Professional psychotherapy in Dhaka - CMHCB"
        ctaLabel="Book an Appointment"
        ctaHref={`/appointment?service=${slug}`}
      />
      <ServiceDescription
        introduction={service.description.introduction}
        sections={service.description.sections}
        sessionDetails={{
          duration: service.duration,
          fees: service.fees,
        }}
      />
      <ServiceProfessionals therapists={serviceTherapists} />
      <Faq
        heading={`Frequently Asked Questions \u2013 ${service.title}`}
        items={service.faq}
      />
    </main>
  );
}