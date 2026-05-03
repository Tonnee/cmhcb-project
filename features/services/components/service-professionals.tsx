import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { type Therapist } from "@/features/home/components/therapist-carousel";

// ---------------------------------------------------------------------------
// Re-export Therapist type so consumers can import from one place
// ---------------------------------------------------------------------------
export type { Therapist };

// ---------------------------------------------------------------------------
// Therapist card (mirrors the carousel card design exactly)
// ---------------------------------------------------------------------------

function ArrowCircleIcon(): React.JSX.Element {
  return (
    <div className="w-[22px] h-[22px] flex-shrink-0">
      <svg viewBox="0 0 22 22" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="11" cy="11" r="10" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.5" />
        <path d="M9 7l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function TherapistCard({ therapist }: { therapist: Therapist }): React.JSX.Element {
  return (
    <div className="flex flex-col items-center">
      {/* Photo */}
      <div className="relative w-full rounded-3xl overflow-hidden aspect-4/5 md:h-[320px] md:aspect-auto">
        <Image
          src={therapist.image}
          alt={therapist.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top"
        />

        {/* Make Appointment overlay */}
        <Link
          href="/book"
          className="absolute bottom-0 left-0 right-0 h-[87px] rounded-b-3xl flex items-center px-[18px] gap-2.5 bg-[#000C00B2] backdrop-blur-[2px] transition-colors hover:bg-dark-green/95 group"
        >
          <p className="font-marcellus text-xl text-accent flex-1">Make Appointment</p>
          <div className="transition-transform group-hover:translate-x-1">
            <ArrowCircleIcon />
          </div>
        </Link>
      </div>

      {/* Name & Role */}
      <div className="flex flex-col items-center mt-4 gap-[4px]">
        <p className="font-marcellus text-base text-dark whitespace-nowrap tracking-wide">
          {therapist.name}
        </p>
        <p className="font-sans font-medium text-[15px] text-accent whitespace-nowrap">
          {therapist.role}
        </p>
      </div>
    </div>
  );
}

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
            <Button variant="primary-dark" href="/book" className="self-start">
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
