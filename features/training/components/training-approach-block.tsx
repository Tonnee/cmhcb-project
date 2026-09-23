import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export interface TrainingApproachBlockProps {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  ctaLabel?: string | null;
  ctaText?: string | null;
  ctaHref?: string | null;
}

const DEFAULT_APPROACH = {
  title: "Our Approach",
  description:
    "Customising programs are available for institutions, professionals, families, individuals, and organizations looking to define issues and related issues around mental health knowledge.",
  image: "/mental-health-training-program.png",
  imageAlt: "Mental health training and workshop program at CMHCB",
  ctaLabel: "Download Brochure",
  ctaHref: "#",
};

export function TrainingApproachBlock({
  title,
  description,
  image,
  imageAlt,
  ctaLabel,
  ctaText,
  ctaHref,
}: TrainingApproachBlockProps = {}): React.JSX.Element {
  const displayTitle = title || DEFAULT_APPROACH.title;
  const displayDescription = description || DEFAULT_APPROACH.description;
  const displayImage = image || DEFAULT_APPROACH.image;
  const displayImageAlt = imageAlt || DEFAULT_APPROACH.imageAlt;
  const displayCta = ctaLabel || ctaText || DEFAULT_APPROACH.ctaLabel;
  const displayHref = ctaHref || DEFAULT_APPROACH.ctaHref;

  return (
    <>
      <div className="relative w-full rounded-3xl overflow-hidden min-h-420">
        <Image
          src={displayImage}
          alt={displayImageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="flex flex-col justify-center rounded-3xl bg-dark-green p-10 md:p-12 min-h-420">
        <h3 className="font-marcellus text-4xl md:text-5xl leading-snug text-white mb-6">
          {displayTitle}
        </h3>
        <p className="font-sans font-normal text-base leading-relaxed text-white/80 mb-10">
          {displayDescription}
        </p>
        <Button href={displayHref} variant="white" className="self-start">
          {displayCta}
        </Button>
      </div>
    </>
  );
}

