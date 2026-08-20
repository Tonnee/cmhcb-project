import * as React from "react";
import Image from "next/image";
import { ReviewCarousel } from "./review-carousel";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

interface ReviewProps {
  testimonials: Testimonial[];
}

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
    <div className={`min-h-70 h-full w-full rounded-3xl p-6 flex flex-col justify-between gap-6 shrink-0 ${bgClass}`}>
      <h3 className={`font-marcellus text-2xl leading-8 ${textClass}`}>
        {title}
      </h3>
      <p className={`font-sans text-base leading-normal ${descClass}`}>
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
    <div className="relative h-70 sm:h-full w-full rounded-3xl overflow-hidden shrink-0">
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

export function Review({ testimonials }: ReviewProps): React.JSX.Element {
  return (
    <section className="py-20">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 xl:gap-20 items-center justify-center">

          {/* Left side — 2×2 grid */}
          <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:w-[50%] xl:w-142">
            <ReviewPhoto
              src="/home-review/bangladeshi-woman-mental-health-therapy-client.png"
              alt="Happy Bangladeshi woman sharing her positive therapy experience and emotional recovery at CMHCB"
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
              src="/home-review/bangladeshi-man-mental-health-therapy-client.png"
              alt="Confident Bangladeshi male client reflecting on successful mental health counseling sessions at CMHCB"
            />
          </div>

          {/* Right side — Testimonial carousel (client boundary) */}
          <ReviewCarousel testimonials={testimonials} />

        </div>
      </div>
    </section>
  );
}
