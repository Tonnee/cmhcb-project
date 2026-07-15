import * as React from "react";
import { HiCheck } from "react-icons/hi2";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";

function CheckIcon({ className = "" }: { className?: string }): React.JSX.Element {
  return <HiCheck className={className} />;
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
    <div className="flex gap-6">
      <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <CheckIcon className="w-6 h-6" />
      </div>
      <div className="flex flex-col">
        <h4 className="font-marcellus text-lg text-dark">
          {title}
        </h4>
        <p className="font-sans text-[15px] text-light-ash leading-relaxed max-w-lg">
          {description}
        </p>
      </div>
    </div>
  );
}

interface TrainingProps {
  headline: string;
  subtitle: string;
  image: string;
}

export default function Training({
  headline,
  subtitle,
  image,
}: TrainingProps): React.JSX.Element {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-y-12 gap-6">
          {/* Left: Content */}
          <div className="flex flex-col flex-1 w-full lg:pr-10 xl:pr-16">
            <SectionHeading
              subtitle="Our Training Programs"
              title={<span dangerouslySetInnerHTML={{ __html: headline }} />}
              align="left"
              size="md"
              className="mb-8"
            />

            <p className="font-sans text-base text-light-ash leading-relaxed max-w-[568px] mb-10">
              {subtitle}
            </p>

            <div className="flex flex-col gap-6 mb-12">
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
          <div className="shrink-0 w-full lg:w-[470px]">
            <div className="relative rounded-3xl overflow-hidden aspect-3/4 lg:h-[664px] lg:w-[470px]">
              <Image
                src={image}
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
