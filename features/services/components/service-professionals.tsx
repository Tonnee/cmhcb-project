import * as React from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { TherapistCard, type Therapist } from "@/components/shared/therapist-card";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ServiceProfessionalsProps {
  therapists: Therapist[];
  /**
   * Section heading. Defaults to "Our Professionals".
   */
  heading?: string;
  /**
   * Supporting description. Defaults to the standard copy.
   */
  description?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export function ServiceProfessionals({
  therapists,
  heading = "Our Professionals",
  description = "Sessions are conducted by qualified and experienced mental health professionals who follow ethical guidelines and ensure a safe, non-judgmental environment.",
  className = "",
}: ServiceProfessionalsProps): React.JSX.Element {
  return (
    <section className={`py-12 lg:py-16 ${className}`}>
      <Container className="lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-12 lg:gap-8 items-start">
          {/* Left: text + CTA — 5 of 8 columns */}
          <div className="flex flex-col gap-8 lg:col-span-5 items-start">
            <div className="flex flex-col gap-6">
              <h2 className="font-marcellus text-3xl text-dark">{heading}</h2>
              <p className="font-sans text-xl leading-8 text-dark">{description}</p>
            </div>
            <Button variant="primary-dark" href="/appointment" className="self-start">
              Schedule a Session
            </Button>
          </div>

          {/* Right: therapist cards — 3 of 8 columns, 3-col sub-grid */}
          <div className="grid grid-cols-2 gap-6 lg:col-span-6">
            {therapists.map((therapist) => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
