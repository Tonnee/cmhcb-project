import * as React from "react";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { ServiceDescription } from "@/features/services/components/service-description";
import { ServiceProfessionals } from "@/features/services/components/service-professionals";
import { Faq } from "@/components/shared/faq";
import { TRAININGS } from "@/features/training/data/trainings";
import { THERAPISTS_DATA } from "@/features/therapists/data/therapists";
import { Metadata } from "next";



export function generateStaticParams(): { slug: string }[] {
  return TRAININGS.map((training) => ({ slug: training.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const training = TRAININGS.find((t) => t.slug === slug);
  if (!training) return {};
  return {
    title: `${training.title} | Training | CMHCB`,
    description: training.heroDescription,
  };
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

  const trainingTrainers = THERAPISTS_DATA.filter((therapist) =>
    therapist.role.toLowerCase().includes("trainer")
  );

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
        therapists={trainingTrainers}
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
