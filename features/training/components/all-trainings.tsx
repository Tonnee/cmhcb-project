import * as React from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import FeatureCard, { type FeatureCardVariant } from "@/components/shared/feature-card";
import { TrainingApproachBlock } from "@/features/training/components/training-approach-block";

interface AllTrainingsProps {
  trainings: {
    slug: string;
    title: string;
    heroDescription: string;
    duration: string;
    fees: string;
    variant: FeatureCardVariant;
  }[];
}

export function AllTrainings({ trainings }: AllTrainingsProps): React.JSX.Element {
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
              duration={training.duration}
              fees={training.fees}
              href={`/training/${training.slug}`}
              variant={index === 0 ? "accent" : training.variant}
            />
          ))}
          <TrainingApproachBlock />
        </div>
      </Container>
    </section>
  );
}
