import * as React from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import FeatureCard from "@/components/shared/feature-card";
import { ServicesApproachBlock } from "@/features/services/components/services-approach-block";
import { SERVICES } from "@/features/services/data/services";

export function AllServices(): React.JSX.Element {
  return (
    <section aria-labelledby="services-heading" className="py-16 md:py-24">
      <Container>
        <SectionHeading
          id="services-heading"
          title="Our Psychotherapeutic Services"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service) => (
            <FeatureCard
              key={service.slug}
              title={service.title}
              features={service.features}
              duration={service.duration}
              fees={service.fees}
              href={`/services/${service.slug}`}
              variant={service.variant}
            />
          ))}
          <ServicesApproachBlock />
        </div>
      </Container>
    </section>
  );
}
