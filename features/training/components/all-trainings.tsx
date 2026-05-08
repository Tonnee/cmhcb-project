import * as React from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import FeatureCard from "@/components/shared/feature-card";
import { TrainingApproachBlock } from "@/features/training/components/training-approach-block";
import { TRAININGS } from "@/features/training/data/trainings";

export function AllTrainings(): React.JSX.Element {
  return (
    <section aria-labelledby="trainings-heading" className="py-16 md:py-24">
      <Container>
        <SectionHeading
          id="trainings-heading"
          title="Training Programs Offered"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TRAININGS.map((training) => (
            <FeatureCard
              key={training.slug}
              title={training.title}
              duration={training.duration}
              fees={training.fees}
              href={`/training/${training.slug}`}
              variant={training.variant}
            />
          ))}
          <TrainingApproachBlock />
        </div>
      </Container>
    </section>
  );
}
