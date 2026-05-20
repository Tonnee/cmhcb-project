import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { RightArrowIcon } from "@/components/ui/icons";

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
      {/* Photo */}
      <div className={`relative w-full rounded-3xl overflow-hidden aspect-4/5 md:h-[320px] md:aspect-auto ${imageClassName}`}>
        <Link href={`/therapists/${therapist.id}`} className="block w-full h-full relative z-0">
          <Image
            src={therapist.image}
            alt={therapist.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-500 group-hover/card:scale-105"
          />
        </Link>

        {/* Appointment CTA Button */}
        {interactive && (
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <Link
              href="/appointment"
              draggable={false}
              className="w-full inline-flex items-center justify-center font-marcellus h-10 px-5 text-sm rounded-xl bg-primary text-white hover:bg-primary-dark hover:text-white transition-all duration-300 font-medium group/btn shadow-sm hover:shadow-md select-none"
            >
              <span className="flex items-center justify-center gap-2">
                Make Appointment
                <RightArrowIcon className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* Name & Role */}
      <div className="flex flex-col items-center mt-4 gap-[4px]">
        <Link 
          href={`/therapists/${therapist.id}`}
          className="font-marcellus font-semibold text-base text-dark hover:text-primary transition-colors whitespace-nowrap tracking-wide"
        >
          {therapist.name}
        </Link>
        <p className="font-sans font-medium text-[15px] text-accent whitespace-nowrap">
          {therapist.role.split("|")[0].trim()}
        </p>
      </div>
    </div>
  );
}
