import * as React from "react";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { ServiceDescription } from "@/features/services/components/service-description";
import { ServiceProfessionals } from "@/features/services/components/service-professionals";
import { Faq } from "@/components/shared/faq";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";

const TRAINING_SLUG_IMAGE_MAP: Record<string, string> = {
  "psychological-first-aid": "/pages-hero-background/psychological-first-aid.png",
  "anger-management": "/pages-hero-background/anger-management.png",
  "stress-management": "/pages-hero-background/stress-management.png",
  "relaxation": "/pages-hero-background/relaxation.png",
  "helping-children-self-confidence": "/pages-hero-background/helping-children-self-confidence.png",
  "managing-childrens-misbehavior": "/pages-hero-background/managing-childrens-misbehavior.png",
  "study-skills": "/pages-hero-background/training-default.png",
  "basic-counseling-skills": "/pages-hero-background/basic-counseling-skills.png",
  "child-development-parenting": "/pages-hero-background/child-development-parenting.png",
  "how-to-be-a-good-communicator": "/pages-hero-background/training-default.png",
  "burnout-management": "/pages-hero-background/burnout-management.png",
  "creative-therapy": "/pages-hero-background/creative-therapy.png",
};

interface TrainingDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const trainings = await prisma.training.findMany({
    select: { slug: true }
  });
  return trainings.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: TrainingDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const training = await prisma.training.findUnique({
    where: { slug },
  });
  if (!training) return {};
  return {
    title: `${training.title} | Training | CMHCB`,
    description: training.heroDescription,
  };
}

export default async function TrainingDetailPage({
  params,
}: TrainingDetailPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;

  // Retrieve training program details from database
  const training = await prisma.training.findUnique({
    where: { slug },
  });

  if (!training) {
    notFound();
  }

  // Retrieve and filter dynamic trainers (therapists specializing as trainers)
  const dbTherapists = await prisma.therapist.findMany({
    orderBy: { name: "asc" },
  });

  const trainingTrainers = dbTherapists.map((t) => {
    let parsedEducation: string[] = [];
    let parsedTraining: string[] = [];
    let parsedExpertise: string[] = [];
    let parsedExperience: string[] = [];
    let parsedServices: string[] = [];
    let parsedActivities: string[] = [];
    let parsedFees: any = null;

    try { parsedEducation = JSON.parse(t.education || "[]"); } catch { }
    try { parsedTraining = JSON.parse(t.training || "[]"); } catch { }
    try { parsedExpertise = JSON.parse(t.expertise || "[]"); } catch { }
    try { parsedExperience = JSON.parse(t.experience || "[]"); } catch { }
    try { parsedServices = JSON.parse(t.services || "[]"); } catch { }
    try { parsedActivities = JSON.parse(t.activities || "[]"); } catch { }
    try { parsedFees = JSON.parse(t.fees || "null"); } catch { }

    return {
      id: t.id,
      image: t.image,
      name: t.name,
      role: t.role,
      bio: t.bio,
      education: parsedEducation,
      training: parsedTraining,
      expertise: parsedExpertise,
      experience: parsedExperience,
      fees: parsedFees,
      services: parsedServices,
      activities: parsedActivities,
    };
  }).filter((therapist) => {
    return therapist.role.toLowerCase().includes("trainer");
  });

  // Parse complex JSON columns
  let parsedSections = [];
  let parsedFaq = [];
  try {
    parsedSections = JSON.parse(training.sections);
  } catch (err) {
    console.error("Error parsing training sections:", err);
  }
  try {
    parsedFaq = JSON.parse(training.faq);
  } catch (err) {
    console.error("Error parsing training faq:", err);
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
        imageSrc={TRAINING_SLUG_IMAGE_MAP[training.slug] ?? training.bgImage ?? "/pages-hero-background/training-default.png"}
        imageAlt="Professional training at CMHCB"
        ctaLabel="Register Interest"
        ctaHref={`/join-training?training=${training.slug}`}
        duration={training.duration ?? undefined}
        fees={training.fees ?? undefined}
      />
      <ServiceDescription
        introduction={{
          title: training.introTitle,
          description: training.introDescription,
        }}
        sections={parsedSections}
        sessionDetails={{
          duration: training.duration,
          fees: training.fees,
        }}
      />
      <ServiceProfessionals
        therapists={trainingTrainers}
        heading="Our Top Trainers"
        description="All training programmes are facilitated by qualified professionals with both clinical expertise and extensive training delivery experience."
      />
      <Faq
        heading={`Frequently Asked Questions – ${training.title}`}
        items={parsedFaq}
      />
    </main>
  );
}
