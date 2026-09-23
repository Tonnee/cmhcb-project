import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import FeatureCard, { type FeatureCardVariant } from "@/components/shared/feature-card";
import { TrainingApproachBlock, type TrainingApproachBlockProps } from "@/features/training/components/training-approach-block";
import { TRAINING_IMAGES } from "@/features/training/data/trainings";

export interface TrainingItemProps {
  slug: string;
  title: string;
  heroDescription: string;
  features?: string[];
  duration: string;
  fees: string;
  variant: FeatureCardVariant;
  image?: string | null;
}

interface AllTrainingsProps {
  trainings: TrainingItemProps[];
  approachData?: TrainingApproachBlockProps;
}

export function AllTrainings({ trainings, approachData }: AllTrainingsProps): React.JSX.Element {
  const isOdd = trainings.length % 2 !== 0;
  const firstTraining = trainings[0];
  const firstTrainingThumbnail =
    firstTraining?.image ||
    (firstTraining?.slug ? TRAINING_IMAGES[firstTraining.slug] : undefined) ||
    "/pages-hero-background/psychological-first-aid.png";

  return (
    <section aria-labelledby="trainings-heading" className="py-16 md:py-24">
      <Container>
        <SectionHeading
          id="trainings-heading"
          title="Training Programs Offered"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainings.map((training, index) => (
            <FeatureCard
              key={training.slug}
              title={training.title}
              description={training.heroDescription}
              features={training.features}
              duration={training.duration}
              fees={training.fees}
              href={`/training/${training.slug}`}
              variant={training.variant || (index === 0 ? "accent" : "primary")}
            />
          ))}

          {/* If trainings count is odd, fill the empty grid column with an image */}
          {isOdd && (
            <div className="relative w-full rounded-3xl overflow-hidden min-h-80 h-full border border-muted/30 group">
              <Image
                src={firstTrainingThumbnail}
                alt={firstTraining?.title ? `${firstTraining.title} thumbnail` : "Training program thumbnail"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}

          <TrainingApproachBlock {...approachData} />
        </div>
      </Container>
    </section>
  );
}

