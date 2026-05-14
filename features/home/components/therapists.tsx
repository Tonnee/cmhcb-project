import * as React from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { TherapistCarousel } from "@/features/home/components/therapist-carousel";
import { type Therapist } from "@/components/shared/therapist-card";

import { THERAPISTS_DATA } from "@/features/therapists/data/therapists";

export default function Therapists(): React.JSX.Element {
  return (
    <section className="py-20 lg:py-24">
      <Container>
        <SectionHeading 
          subtitle="Our Therapist"
          title={<>Personalized & Professional <span className="text-primary-dark">Therapy</span> to Guide<br className="hidden md:block" /> You Toward <span className="text-accent">Healing</span></>}
          className="mb-14"
        />

        {/* Dynamic Interactive Leaf Component Mounting Block */}
        <TherapistCarousel therapists={THERAPISTS_DATA} />

      </Container>
    </section>
  );
}
