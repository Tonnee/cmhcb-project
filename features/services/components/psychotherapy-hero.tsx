import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export function PsychotherapyHero(): React.JSX.Element {
  return (
    <section className="relative w-full min-h-[500px] lg:h-[500px] py-12 lg:py-16">
      <Container className="relative h-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full">
          {/* Content Column */}
          <div className="relative z-10 flex flex-col justify-center">
            {/* Breadcrumb */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <p className="font-sans font-normal text-sm">
                <span className="text-primary-dark">Services</span>
                <span className="text-light-ash/80"> &gt; Psychotherapeutic Services</span>
              </p>
            </nav>

            {/* Heading */}
            <h1 className="font-marcellus text-4xl md:text-5xl leading-tight text-footer-bg mb-6 max-w-lg">
              Professional, ethical, and evidence-based mental health care
            </h1>

            {/* Description */}
            <p className="font-sans font-normal text-base leading-snug text-light-ash/80 mb-8 max-w-lg">
              At CMHC,B, we provide compassionate and confidential psychotherapeutic services to support individuals, couples, families, and organizations in improving mental well-being and quality of life.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="primary" 
                className="bg-primary-dark hover:bg-primary-dark/90 border-primary-dark"
              >
                Book an Appointment
              </Button>
              <Button 
                variant="outline" 
                className="text-primary-dark border-primary-dark hover:bg-primary-dark/10"
              >
                Talk to a Professional
              </Button>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative hidden lg:block h-hero-image">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-[570px] h-hero-image rounded-3xl overflow-hidden bg-muted">
              <Image
                src="/compassionate-mental-health-professional.png"
                alt="Professional psychotherapy session"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 570px"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
