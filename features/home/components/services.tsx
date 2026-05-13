import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";

import { SERVICES } from "@/features/services/data/services";
import { ServiceCard } from "@/components/shared/service-card";

export default function Services(): React.JSX.Element {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        {/* Header */}
        <div className="text-center mb-14 px-4">
          <p className="font-sans font-medium text-base text-accent mb-3 tracking-wide">
            Services We Provide
          </p>
          <h2 className="font-marcellus text-3xl md:text-4xl text-dark leading-snug">
            Professional Psychology <span className="text-primary-dark">Therapy Services</span>
            <br className="hidden md:block" /> You Can Choose
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
          {SERVICES.map((service) => (
            <ServiceCard key={service.slug} item={service} />
          ))}
        </div>
      </Container>
    </section>
  );
}
