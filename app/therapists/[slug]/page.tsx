import * as React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { THERAPISTS_DATA } from "@/features/therapists/data/therapists";
import { SERVICES } from "@/features/services/data/services";
import { ServiceCard } from "@/components/shared/service-card";
import { BookAppointmentButton } from "@/components/shared/book-appointment-button";

function CheckIcon(): React.JSX.Element {
  return (
    <div className="flex-shrink-0 w-6 h-6 mt-0.5 overflow-hidden relative">
      <svg className="block w-full h-full text-primary" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1.15-5.603l5.5-6a1 1 0 00-1.478-1.355l-4.8 5.236-2.316-2.317a1 1 0 10-1.414 1.414l3.05 3.05a1.002 1.002 0 001.458-.028z" />
      </svg>
    </div>
  );
}

function TherapistDetailItem({ title, description }: { title: string; description: string }): React.JSX.Element {
  return (
    <div className="flex gap-4 items-start">
      <CheckIcon />
      <div className="flex flex-col gap-[6px]">
        <p className="font-marcellus text-[17px] text-dark leading-snug">
          {title}
        </p>
        <p className="font-sans text-[15px] text-light-ash leading-relaxed max-w-lg">
          {description}
        </p>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return THERAPISTS_DATA.map((t) => ({ slug: t.id }));
}

export default async function TherapistProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;
  const therapist = THERAPISTS_DATA.find((t) => t.id === slug);

  if (!therapist) {
    notFound();
  }

  return (
    <main className="pt-24 pb-24">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-y-12 gap-x-5">
          {/* Left: Content */}
          <div className="flex flex-col flex-1 w-full lg:pr-10 xl:pr-16">
            <p className="font-sans text-accent font-medium text-base mb-3 tracking-wide uppercase">
              {therapist.role}
            </p>

            <h1 className="font-marcellus text-4xl lg:text-[42px] text-dark leading-[1.2] mb-8">
              {therapist.name}
            </h1>

            <p className="font-sans text-base text-light-ash leading-relaxed max-w-[568px] mb-10">
              {therapist.bio || "Detailed biography coming soon."}
            </p>

            <div className="flex flex-col gap-8 mb-12">
              <TherapistDetailItem
                title="Education"
                description="MBBS from Dhaka Medical College, followed by specialized fellowship and FCPS in Psychiatry."
              />
              <TherapistDetailItem
                title="Training"
                description="Advanced certification in Cognitive Behavioral Therapy (CBT) and Trauma-Informed Care."
              />
              <TherapistDetailItem
                title="Service Hours"
                description="Available for appointments Sunday to Thursday from 10:00 AM to 6:00 PM."
              />
            </div>

            <div className="self-start">
              <BookAppointmentButton />
            </div>
          </div>

          {/* Right: Image */}
          <div className="shrink-0 w-full lg:w-[470px]">
            <div className="relative rounded-3xl overflow-hidden aspect-[3/4] lg:h-[664px] lg:w-[470px] bg-gray-100 shadow-sm">
              <Image
                src={therapist.image}
                alt={therapist.name}
                fill
                sizes="(max-width: 1024px) 100vw, 470px"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Services Section */}
      {therapist.services && therapist.services.length > 0 && (
        <Container className="mb-24 mt-40">
          <div className="text-center mb-14 px-4">
            <p className="font-sans font-medium text-base text-accent mb-3 tracking-wide">
              Areas of Expertise
            </p>
            <h2 className="font-marcellus text-3xl md:text-4xl text-dark leading-snug">
              Services Provided by <span className="text-primary-dark">{therapist.name}</span>
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-5 lg:gap-8">
            {therapist.services
              .map(slug => SERVICES.find(s => s.slug === slug))
              .filter(Boolean)
              .map((service) => (
                <div key={service!.slug} className="w-full md:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-2rem)] max-w-md">
                  <ServiceCard item={service!} />
                </div>
              ))
            }
          </div>
        </Container>
      )}
    </main>
  );
}
