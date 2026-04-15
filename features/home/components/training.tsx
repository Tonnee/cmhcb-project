import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

function CheckIcon(): React.JSX.Element {
  return (
    <div className="flex-shrink-0 w-6 h-6 mt-0.5 overflow-hidden relative">
      <svg className="block w-full h-full text-primary" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1.15-5.603l5.5-6a1 1 0 00-1.478-1.355l-4.8 5.236-2.316-2.317a1 1 0 10-1.414 1.414l3.05 3.05a1.002 1.002 0 001.458-.028z" />
      </svg>
    </div>
  );
}

interface TrainingItemProps {
  title: string;
  description: string;
}

const TRAINING_DATA: TrainingItemProps[] = [
  {
    title: "Basic Counseling Skills Training",
    description: "Learn foundational techniques for effective, empathetic, and ethical communication in mental health settings.",
  },
  {
    title: "Child & Adolescent Mental Health",
    description: "Understand psychological development, behavior management, and therapeutic strategies for young individuals.",
  },
  {
    title: "Trauma-Informed Care",
    description: "Equip yourself with the knowledge and tools to support individuals dealing with trauma and PTSD.",
  },
];

function TrainingItem({ title, description }: TrainingItemProps): React.JSX.Element {
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

export default function Training(): React.JSX.Element {
  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-y-12 gap-x-5">
          {/* Left: Content */}
          <div className="flex flex-col flex-1 w-full lg:pr-10 xl:pr-16">
            <p className="font-sans text-accent font-medium text-base mb-3 tracking-wide">
              Our Training Programs
            </p>

            <h2 className="font-marcellus text-4xl lg:text-[42px] text-dark leading-[1.2] mb-8">
              Want to Make a <span className="text-primary-dark">Difference</span>
              <br className="hidden md:block" /> in Mental Health?
            </h2>

            <p className="font-sans text-base text-light-ash leading-relaxed max-w-[568px] mb-10">
              Our specialized trainings equip professionals, educators, and
              caregivers with the tools needed to foster mental well-being in
              their communities.
            </p>

            <div className="flex flex-col gap-8 mb-12">
              {TRAINING_DATA.map((item) => (
                <TrainingItem key={item.title} {...item} />
              ))}
            </div>

            <Button
              variant="primary"
              className="self-start"
              href="/training"
            >
              Explore More
            </Button>
          </div>

          {/* Right: Image */}
          <div className="flex-shrink-0 w-full lg:w-[470px]">
            <div className="relative rounded-3xl overflow-hidden aspect-[3/4] lg:h-[664px] lg:w-[470px] shadow-sm">
              <Image
                src="/mental-health-training-program.png"
                alt="Mental health professional"
                fill
                sizes="(max-width: 1024px) 100vw, 470px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
