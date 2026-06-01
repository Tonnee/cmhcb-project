import * as React from "react";
import Link from "next/link";
import { HiArrowSmallRight } from "react-icons/hi2";

export interface TherapistButtonProps {
  href: string;
  className?: string;
}

export function TherapistAppointmentButton({
  href,
  className = "",
}: TherapistButtonProps): React.JSX.Element {
  return (
    <Link
      href={href}
      draggable={false}
      className={`w-full inline-flex items-center justify-center font-marcellus h-10 px-5 text-sm rounded-xl bg-primary text-white hover:bg-primary-dark hover:text-white transition-all duration-300 font-medium group/btn shadow-sm hover:shadow-md select-none ${className}`}
    >
      <span className="flex items-center justify-center gap-2">
        Make Appointment
        <HiArrowSmallRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
      </span>
    </Link>
  );
}

export function TherapistProfileButton({
  href,
  className = "",
}: TherapistButtonProps): React.JSX.Element {
  return (
    <Link
      href={href}
      draggable={false}
      className={`w-full inline-flex items-center justify-center font-marcellus h-10 px-5 text-sm rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200 text-dark hover:bg-white hover:text-accent transition-all duration-300 font-medium group/btn shadow-sm hover:shadow-md select-none ${className}`}
    >
      <span>View Profile</span>
    </Link>
  );
}
