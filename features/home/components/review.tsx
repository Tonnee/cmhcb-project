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

export interface ReviewHighlightProps {
  card1Title?: string | null;
  card1Description?: string | null;
  card2Title?: string | null;
  card2Description?: string | null;
  photo1Image?: string | null;
  photo1Alt?: string | null;
  photo2Image?: string | null;
  photo2Alt?: string | null;
}

export interface ReviewHighlightValues {
  card1Title: string;
  card1Description: string;
  card2Title: string;
  card2Description: string;
  photo1Image: string;
  photo1Alt: string;
  photo2Image: string;
  photo2Alt: string;
}

export const DEFAULT_REVIEW_HIGHLIGHTS: ReviewHighlightValues = {
  photo1Image: "/home-review/bangladeshi-woman-mental-health-therapy-client.png",
  photo1Alt: "Happy Bangladeshi woman sharing her positive therapy experience and emotional recovery at CMHCB",
  card1Title: "Real Experiences, Real Impact",
  card1Description: "Discover how our clients' lives have changed through therapy, training, and mental health support at CMHC,B.",
  card2Title: "Voices That Inspire Hope",
  card2Description: "Our clients share their journeys of transformation—honest reflections on the care and support they received at CMHC,B.",
  photo2Image: "/home-review/bangladeshi-man-mental-health-therapy-client.png",
  photo2Alt: "Confident Bangladeshi male client reflecting on successful mental health counseling sessions at CMHCB",
};

interface ReviewProps {
  testimonials: Testimonial[];
  reviewHighlights?: ReviewHighlightProps;
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

export function Review({ testimonials, reviewHighlights }: ReviewProps): React.JSX.Element {
  const highlights: ReviewHighlightValues = {
    photo1Image: reviewHighlights?.photo1Image || DEFAULT_REVIEW_HIGHLIGHTS.photo1Image,
    photo1Alt: reviewHighlights?.photo1Alt || DEFAULT_REVIEW_HIGHLIGHTS.photo1Alt,
    card1Title: reviewHighlights?.card1Title || DEFAULT_REVIEW_HIGHLIGHTS.card1Title,
    card1Description: reviewHighlights?.card1Description || DEFAULT_REVIEW_HIGHLIGHTS.card1Description,
    card2Title: reviewHighlights?.card2Title || DEFAULT_REVIEW_HIGHLIGHTS.card2Title,
    card2Description: reviewHighlights?.card2Description || DEFAULT_REVIEW_HIGHLIGHTS.card2Description,
    photo2Image: reviewHighlights?.photo2Image || DEFAULT_REVIEW_HIGHLIGHTS.photo2Image,
    photo2Alt: reviewHighlights?.photo2Alt || DEFAULT_REVIEW_HIGHLIGHTS.photo2Alt,
  };

  return (
    <section className="py-20">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 xl:gap-20 items-center justify-center">

          {/* Left side — 2×2 grid */}
          <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:w-[50%] xl:w-142">
            <ReviewPhoto
              src={highlights.photo1Image}
              alt={highlights.photo1Alt}
            />

            <InfoCard
              title={highlights.card1Title}
              description={highlights.card1Description}
              variant="primary"
            />

            <InfoCard
              title={highlights.card2Title}
              description={highlights.card2Description}
              variant="accent"
            />

            <ReviewPhoto
              src={highlights.photo2Image}
              alt={highlights.photo2Alt}
            />
          </div>

          {/* Right side — Testimonial carousel (client boundary) */}
          <ReviewCarousel testimonials={testimonials} />

        </div>
      </div>
    </section>
  );
}
