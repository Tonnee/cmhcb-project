import * as React from "react";
import { Container } from "@/components/layout/container";
import { TherapistCarousel } from "@/features/home/components/therapist-carousel";
import { type Therapist } from "@/components/shared/therapist-card";

import { THERAPISTS_DATA } from "@/features/therapists/data/therapists";

export default function Therapists(): React.JSX.Element {
  return (
    <section className="py-20 lg:py-24">
      <Container>
        {/* Global Component Header Context */}
        <div className="text-center mb-14 mx-auto">
          <p className="font-sans font-medium text-base text-accent mb-3 tracking-wide">
            Our Therapist
          </p>
          <h2 className="font-marcellus text-3xl md:text-4xl lg:text-[36px] leading-[1.3] text-dark">
            Personalized &amp; Professional <span className="text-primary-dark">Therapy</span> to Guide
            <br className="hidden md:block" />
            You Toward <span className="text-accent">Healing</span>
          </h2>
        </div>

        {/* Dynamic Interactive Leaf Component Mounting Block */}
        <TherapistCarousel therapists={THERAPISTS_DATA} />

      </Container>
    </section>
  );
}
