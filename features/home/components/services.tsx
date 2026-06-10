import * as React from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";

import { SERVICES } from "@/features/services/data/services";
import { ServiceCard } from "@/components/shared/service-card";

export default function Services(): React.JSX.Element {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        {/* Header */}
        <SectionHeading 
          subtitle="Services We Provide"
          title={<><span className="text-primary-dark">Professional</span> Psychology Therapy <span className="text-accent">Services</span><br className="hidden md:block" /> You Can Choose</>}
          className="mb-14 px-4"
        />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {SERVICES.map((service) => (
            <ServiceCard key={service.slug} item={service} />
          ))}
        </div>
      </Container>
    </section>
  );
}
