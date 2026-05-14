import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { RightArrowIcon } from "@/components/ui/icons";

export interface Therapist {
  id: string;
  image: string;
  name: string;
  role: string;
  bio?: string;
  activities?: string[];
  services?: string[];
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

        {/* Make Appointment overlay */}
        {interactive && (
          <Link
            href="/book"
            draggable={false}
            className="absolute bottom-0 left-0 right-0 h-[87px] flex items-center px-6 gap-2.5 bg-dark-green-overlay backdrop-blur-[2px] opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all duration-300 hover:bg-dark-green/95 group/link z-10"
          >
            <p className="font-marcellus text-xl text-accent flex-1">Make Appointment</p>
            <div className="transition-transform duration-300 group-hover/link:translate-x-1">
              <RightArrowIcon className="text-white w-5 h-5" />
            </div>
          </Link>
        )}
      </div>

      {/* Name & Role */}
      <div className="flex flex-col items-center mt-4 gap-[4px]">
        <Link 
          href={`/therapists/${therapist.id}`}
          className="font-marcellus text-base text-dark hover:text-primary transition-colors whitespace-nowrap tracking-wide"
        >
          {therapist.name}
        </Link>
        <p className="font-sans font-medium text-[15px] text-accent whitespace-nowrap">
          {therapist.role}
        </p>
      </div>
    </div>
  );
}
