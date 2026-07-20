import * as React from "react";
import Image from "next/image";
import { BookAppointmentButton } from "@/components/shared/book-appointment-button";

export function ServicesApproachBlock(): React.JSX.Element {
  return (
    <>
      <div className="relative w-full rounded-3xl overflow-hidden min-h-420">
        <Image
          src="/couple-counseling-relationship-help.jpg"
          alt="Couple counseling and relationship psychotherapy session at CMHCB"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="flex flex-col justify-center rounded-3xl bg-dark-green p-10 md:p-12 min-h-420">
        <h3 className="font-marcellus text-4xl md:text-5xl leading-snug text-white mb-6">
          Our Approach
        </h3>
        <p className="font-sans font-normal text-base leading-relaxed text-white/80 mb-10">
          We follow an evidence-based, client-centred approach that integrates individual experiences
          while providing ethical, confidential, and culturally sensitive care.
        </p>
        <BookAppointmentButton variant="white" className="self-start" />
      </div>
    </>
  );
}
