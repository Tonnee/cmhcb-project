import * as React from "react";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { ServiceDescription } from "@/features/services/components/service-description";
import { ServiceProfessionals } from "@/features/services/components/service-professionals";
import { Faq } from "@/components/shared/faq";
import { TRAININGS } from "@/features/training/data/trainings";
import { type Therapist } from "@/components/shared/therapist-card";

// Shared therapist data — reused from the home page dataset
const THERAPISTS: Therapist[] = [
  {
    id: "t1",
    image: "/home-therapist/therapist-ruma-khondaker-1.png",
    name: "Ruma Khondaker",
    role: "Lead Trainer",
  },
  {
    id: "t2",
    image: "/home-therapist/therapist-ruma-khondaker-2.png",
    name: "Ruma Khondaker",
    role: "Lead Trainer",
  },
];

export function generateStaticParams(): { slug: string }[] {
  return TRAININGS.map((training) => ({ slug: training.slug }));
}

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;

  const training = TRAININGS.find((t) => t.slug === slug);

  if (!training) {
    notFound();
  }

  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Training", href: "/training" },
        ]}
        currentPage={training.heroTitle}
        title={training.heroTitle}
        description={training.heroDescription}
        imageSrc="/pages-hero-background/1.png"
        imageAlt="Professional training at CMHCB"
        ctaLabel="Register Interest"
        ctaHref="/contact"
      />
      <ServiceDescription
        introduction={training.description.introduction}
        sections={training.description.sections}
        sessionDetails={{
          duration: training.duration,
          fees: training.fees,
        }}
      />
      <ServiceProfessionals
        therapists={THERAPISTS}
        heading="Our Trainers"
        description="All training programmes are facilitated by qualified professionals with both clinical expertise and extensive training delivery experience."
      />
      <Faq
        heading={`Frequently Asked Questions \u2013 ${training.title}`}
        items={training.faq}
      />
    </main>
  );
}
