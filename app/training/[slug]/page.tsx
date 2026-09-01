import * as React from "react";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { ServiceDescription } from "@/features/services/components/service-description";
import { ServiceProfessionals } from "@/features/services/components/service-professionals";
import { Faq } from "@/components/shared/faq";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { JsonLd } from "@/components/shared/json-ld";
import { TRAININGS } from "@/features/training/data/trainings";

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

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams() {
  try {
    const trainings = await prisma.training.findMany({
      select: { slug: true },
    });
    if (trainings.length > 0) {
      return trainings.map((t) => ({ slug: t.slug }));
    }
  } catch {}
  return TRAININGS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: TrainingDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const dbTraining = await prisma.training.findUnique({
      where: { slug: decodedSlug },
    }).catch(() => null);

    const staticTraining = TRAININGS.find((t) => t.slug === decodedSlug);
    const training = dbTraining || (staticTraining ? {
      slug: staticTraining.slug,
      title: staticTraining.title,
      heroDescription: staticTraining.heroDescription,
      bgImage: null,
    } : null);

    if (!training) return {};

    const url = `https://cmhcbd.com/training/${training.slug}`;
    const image = TRAINING_SLUG_IMAGE_MAP[training.slug] ?? training.bgImage ?? "/pages-hero-background/training-default.png";
    const imageUrl = image.startsWith("http")
      ? image
      : `https://cmhcbd.com${image.startsWith("/") ? "" : "/"}${image}`;

    return {
      title: `${training.title} | Professional Training`,
      description: training.heroDescription,
      alternates: {
        canonical: url,
      },
      openGraph: {
        type: "website",
        title: `${training.title} | Mental Health Training`,
        description: training.heroDescription,
        url: url,
        images: [
          {
            url: imageUrl,
            alt: training.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: training.title,
        description: training.heroDescription,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for training page:", error);
    return {
      title: "Training | CMHCB",
    };
  }
}

export default async function TrainingDetailPage({
  params,
}: TrainingDetailPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Retrieve training program details from database with static fallback
  const dbTraining = await prisma.training.findUnique({
    where: { slug: decodedSlug },
  }).catch(() => null);

  const staticTraining = TRAININGS.find((t) => t.slug === decodedSlug);

  if (!dbTraining && !staticTraining) {
    notFound();
  }

  // Retrieve and filter dynamic trainers (therapists assigned to this training or specializing as trainers)
  let trainingTrainers: any[] = [];
  try {
    let assignedTrainerIds: string[] = [];
    if (dbTraining?.trainers) {
      try {
        const parsed = typeof dbTraining.trainers === "string" ? JSON.parse(dbTraining.trainers) : dbTraining.trainers;
        if (Array.isArray(parsed)) {
          assignedTrainerIds = parsed;
        }
      } catch {}
    }

    let dbTherapists: any[] = [];
    try {
      dbTherapists = await prisma.therapist.findMany({
        orderBy: [{ order: "asc" }, { name: "asc" }],
      });
    } catch {
      dbTherapists = await prisma.therapist.findMany().catch(() => []);
    }

    const mappedTherapists = dbTherapists.map((t) => {
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
    });

    if (assignedTrainerIds.length > 0) {
      // Show explicitly assigned therapists
      trainingTrainers = mappedTherapists.filter((therapist) =>
        assignedTrainerIds.includes(therapist.id) || assignedTrainerIds.includes(therapist.name)
      );
    } else {
      // Fallback: show therapists with "trainer" in their role
      trainingTrainers = mappedTherapists.filter((therapist) =>
        therapist.role.toLowerCase().includes("trainer")
      );
    }
  } catch (err) {
    console.error("Error querying trainers:", err);
  }

  // Unified training properties and safe section/faq parsing
  let title = "";
  let heroTitle = "";
  let heroDescription = "";
  let introTitle = "";
  let introDescription = "";
  let duration = "";
  let fees = "";
  let format: string | null = null;
  let language: string | null = null;
  let bgImage: string | null = null;
  let parsedSections: { title: string; items: string[] }[] = [];
  let parsedFaq: { question: string; answer: string }[] = [];

  if (dbTraining) {
    title = dbTraining.title;
    heroTitle = dbTraining.heroTitle;
    heroDescription = dbTraining.heroDescription;
    introTitle = dbTraining.introTitle;
    introDescription = dbTraining.introDescription;
    duration = dbTraining.duration;
    fees = dbTraining.fees;
    format = dbTraining.format;
    language = dbTraining.language;
    bgImage = dbTraining.bgImage;

    try {
      const s = typeof dbTraining.sections === "string" ? JSON.parse(dbTraining.sections) : dbTraining.sections;
      if (Array.isArray(s)) {
        parsedSections = s.map((sec: any) => ({
          title: sec?.title || "Overview",
          items: Array.isArray(sec?.items) ? sec.items : [],
        }));
      }
    } catch (err) {
      console.error("Error parsing training sections:", err);
    }

    try {
      const f = typeof dbTraining.faq === "string" ? JSON.parse(dbTraining.faq) : dbTraining.faq;
      if (Array.isArray(f)) {
        parsedFaq = f.map((item: any) => ({
          question: item?.question || "",
          answer: item?.answer || "",
        }));
      }
    } catch (err) {
      console.error("Error parsing training faq:", err);
    }
  } else if (staticTraining) {
    title = staticTraining.title;
    heroTitle = staticTraining.heroTitle;
    heroDescription = staticTraining.heroDescription;
    introTitle = staticTraining.description.introduction.title;
    introDescription = staticTraining.description.introduction.description;
    duration = staticTraining.duration;
    fees = staticTraining.fees;
    parsedSections = staticTraining.description.sections.map((sec) => ({
      title: sec.title,
      items: Array.isArray(sec.items) ? sec.items : [],
    }));
    parsedFaq = staticTraining.faq.map((item) => ({
      question: item.question,
      answer: item.answer,
    }));
  }

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `https://cmhcbd.com/training/${decodedSlug}#course`,
    name: title,
    description: heroDescription,
    provider: {
      "@id": "https://cmhcbd.com/#organization",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://cmhcbd.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Training",
        item: "https://cmhcbd.com/training",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `https://cmhcbd.com/training/${decodedSlug}`,
      },
    ],
  };

  const jsonLdSchemas: any[] = [courseJsonLd, breadcrumbJsonLd];

  if (Array.isArray(parsedFaq) && parsedFaq.length > 0) {
    jsonLdSchemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: parsedFaq.map((item: any) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return (
    <main>
      <JsonLd data={jsonLdSchemas} />
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Training", href: "/training" },
        ]}
        currentPage={heroTitle}
        title={heroTitle}
        description={heroDescription}
        imageSrc={bgImage || TRAINING_SLUG_IMAGE_MAP[decodedSlug] || "/pages-hero-background/training-default.png"}
        imageAlt={`Professional training: ${title} at CMHCB`}
        ctaLabel="Register Interest"
        ctaHref={`/join-training?training=${decodedSlug}`}
        duration={duration || undefined}
        fees={fees || undefined}
        format={format || undefined}
        language={language || undefined}
      />
      <ServiceDescription
        introduction={{
          title: introTitle,
          description: introDescription,
        }}
        sections={parsedSections}
        sessionDetails={{
          duration: duration,
          fees: fees,
          format: format || undefined,
          language: language || undefined,
        }}
      />
      {trainingTrainers.length > 0 && (
        <ServiceProfessionals
          therapists={trainingTrainers}
          heading="Our Top Trainers"
          description="All training programmes are facilitated by qualified professionals with both clinical expertise and extensive training delivery experience."
        />
      )}
      {parsedFaq.length > 0 && (
        <Faq
          heading={`Frequently Asked Questions – ${title}`}
          items={parsedFaq}
        />
      )}
    </main>
  );
}
