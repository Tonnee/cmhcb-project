import * as React from "react";
import { PageFeatureHero } from "@/components/shared/page-feature-hero";
import { AllTrainings } from "@/features/training/components/all-trainings";
import { TrainingInfoSection } from "@/features/training/components/training-info-section";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TrainingPage(): Promise<React.JSX.Element> {
  // Query all training programs and dynamic info blocks from the database
  const [trainings, infoBlocks] = await Promise.all([
    prisma.training.findMany({
      orderBy: { title: "asc" },
    }),
    prisma.trainingInfoBlock.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <main>
      <PageFeatureHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Training", href: "/training" },
        ]}
        title="Building future mental health professionals and advocates"
        description="CMHCB offers a range of professional training programs designed to equip individuals with practical mental health knowledge and skills — from psychological first aid to advanced counselling techniques."
        image={{
          src: "/compassionate-mental-health-professional.png",
          alt: "CMHCB training programme participants",
        }}
        ctas={[
          {
            label: "View Programs",
            variant: "primary",
            href: "#trainings-heading",
            className: "bg-primary-dark hover:bg-primary-dark/90 border-primary-dark",
          },
          {
            label: "Contact Us",
            variant: "outline",
            href: "/contact",
            className: "text-primary-dark border-primary-dark hover:bg-primary-dark/10",
          },
        ]}
      />
      <AllTrainings trainings={trainings} />
      <TrainingInfoSection infoBlocks={infoBlocks} />
    </main>
  );
}
