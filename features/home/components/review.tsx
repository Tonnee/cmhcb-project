import * as React from "react";
import Image from "next/image";
import { TESTIMONIALS } from "@/data/testimonials";
import { ReviewCarousel } from "./review-carousel";

interface InfoCardProps {
  title: string;
  description: string;
  variant: "primary" | "accent";
}

function InfoCard({ title, description, variant }: InfoCardProps): React.JSX.Element {
  const bgClass = variant === "primary" ? "bg-primary-dark" : "bg-accent";
  const textClass = variant === "primary" ? "text-white" : "text-dark";
  const descClass = variant === "primary" ? "text-light" : "text-dark";

  return (
    <div className={`h-[280px] w-full rounded-3xl p-6 flex flex-col gap-4 shrink-0 ${bgClass}`}>
      <h3 className={`font-marcellus text-2xl leading-8 ${textClass}`}>
        {title}
      </h3>
      <p className={`font-sans text-sm leading-normal ${descClass}`}>
        {description}
      </p>
    </div>
  );
}

interface ReviewPhotoProps {
  src: string;
  alt: string;
}

function ReviewPhoto({ src, alt }: ReviewPhotoProps): React.JSX.Element {
  return (
    <div className="relative h-[280px] w-full rounded-3xl overflow-hidden shrink-0">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 274px"
        className="object-cover"
      />
    </div>
  );
}

export function Review(): React.JSX.Element {
  return (
    <section className="bg-white py-20">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-start">

          {/* Left side — 2×2 grid */}
          <div className="shrink-0 grid grid-cols-2 gap-5 w-full lg:w-[568px]">
            <ReviewPhoto
              src="/home-review/mental-health-therapy-client-woman.png"
              alt="Happy mental health therapy client sharing her positive experience at CMHCB"
            />

            <InfoCard
              title="Real Experiences, Real Impact"
              description="Discover how our clients' lives have changed through therapy, training, and mental health support at CMHC,B."
              variant="primary"
            />

            <InfoCard
              title="Voices That Inspire Hope"
              description="Our clients share their journeys of transformation—honest reflections on the care and support they received at CMHC,B."
              variant="accent"
            />

            <ReviewPhoto
              src="/home-review/mental-health-therapy-client-man.png"
              alt="Confident male client after successful mental health therapy sessions at CMHCB"
            />
          </div>

          {/* Right side — Testimonial carousel (client boundary) */}
          <ReviewCarousel testimonials={TESTIMONIALS} />

        </div>
      </div>
    </section>
  );
}
