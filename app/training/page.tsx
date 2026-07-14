import * as React from "react";
import { PageHero } from "@/components/shared/page-hero";
import { AllTrainings } from "@/features/training/components/all-trainings";
import { TrainingInfoSection } from "@/features/training/components/training-info-section";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TrainingPage(): Promise<React.JSX.Element> {
  // Query all training programs and dynamic info blocks from the database
  const [trainings, infoBlocks] = await Promise.all([
    prisma.training.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.trainingInfoBlock.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
        ]}
        currentPage="Training"
        title="Building future mental health professionals and advocates"
        description="CMHCB offers a range of professional training programs designed to equip individuals with practical mental health knowledge and skills — from psychological first aid to advanced counselling techniques."
        imageSrc="/training_hero.png"
        imageAlt="CMHCB training programme participants"
        ctaLabel="View Programs"
        ctaHref="#trainings-heading"
      />
      <AllTrainings trainings={trainings} />
      <TrainingInfoSection infoBlocks={infoBlocks} />
    </main>
  );
}
