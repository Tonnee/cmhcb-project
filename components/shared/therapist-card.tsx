import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { TherapistAppointmentButton, TherapistProfileButton } from "@/components/ui/therapist-buttons";

export interface TherapistFeeItem {
  label: string;
  amount: string;
  note?: string;
}

export interface TherapistFeeCategory {
  category: string;
  items: TherapistFeeItem[];
}

export interface Therapist {
  id: string;
  image: string;
  name: string;
  role: string;
  bio?: string;
  activities?: string[];
  services?: string[];
  education?: string[];
  training?: string[];
  expertise?: string[];
  experience?: string[];
  fees?: TherapistFeeCategory[];
}

export interface TherapistCardProps {
  therapist: Therapist;
  /**
   * Optional custom class for the wrapper
   */
  className?: string;
  /**
   * Optional custom class for the image wrapper
   */
  imageClassName?: string;
  /**
   * Whether to enable the interactive hover overlay
   */
  interactive?: boolean;
}


export function TherapistCard({
  therapist,
  className = "",
  imageClassName = "",
  interactive = true,
}: TherapistCardProps): React.JSX.Element {
  return (
    <div className={`group/card flex flex-col items-center min-w-0 ${className}`}>
      {/* Photo Container */}
      <div className={`relative w-full rounded-[32px] overflow-hidden aspect-4/5 md:h-[340px] md:aspect-auto bg-gray-50 ${imageClassName}`}>
        <Link href={`/therapists/${therapist.id}`} className="block w-full h-full relative z-0">
          <Image
            src={therapist.image}
            alt={therapist.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-top transition-transform duration-500 group-hover/card:scale-105"
          />
        </Link>

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-primary-dark/10 opacity-0 group-hover/card:opacity-100 transition-all duration-300 pointer-events-none z-10" />

        {/* Hover Action Buttons */}
        {interactive && (
          <div className="absolute inset-x-4 bottom-4 z-20 flex flex-col gap-2 opacity-0 translate-y-4 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300">
            <TherapistProfileButton href={`/therapists/${therapist.id}`} />
            <TherapistAppointmentButton href={`/appointment?therapist=${therapist.id}`} />
          </div>
        )}
      </div>

      {/* Name & Role */}
      <div className="flex flex-col items-center mt-4 gap-1.5">
        <Link 
          href={`/therapists/${therapist.id}`}
          className="font-marcellus font-medium text-lg text-dark hover:text-accent transition-colors tracking-wide text-center"
        >
          {therapist.name}
        </Link>
        <p className="font-sans text-xs font-semibold tracking-wider text-light-ash/60 uppercase text-center">
          {therapist.role.split("|")[0].trim()}
        </p>
      </div>
    </div>
  );
}
