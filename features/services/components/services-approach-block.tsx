import * as React from "react";
import Image from "next/image";
import { BookAppointmentButton } from "@/components/shared/book-appointment-button";

export interface ServicesApproachBlockProps {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  imageAlt?: string | null;
}

const DEFAULT_APPROACH = {
  title: "Our Approach",
  description:
    "We follow an evidence-based, client-centred approach that integrates individual experiences while providing ethical, confidential, and culturally sensitive care.",
  image: "/couple-counseling-relationship-help.jpg",
  imageAlt: "Couple counseling and relationship psychotherapy session at CMHCB",
};

export function ServicesApproachBlock({
  title,
  description,
  image,
  imageAlt,
}: ServicesApproachBlockProps = {}): React.JSX.Element {
  const displayTitle = title || DEFAULT_APPROACH.title;
  const displayDescription = description || DEFAULT_APPROACH.description;
  const displayImage = image || DEFAULT_APPROACH.image;
  const displayImageAlt = imageAlt || DEFAULT_APPROACH.imageAlt;

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
        <BookAppointmentButton variant="white" className="self-start" />
      </div>
    </>
  );
}
