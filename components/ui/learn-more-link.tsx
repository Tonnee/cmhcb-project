import * as React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { type ServiceCardVariant } from "@/features/services/components/service-card";

interface LearnMoreLinkProps {
  href: string;
  label: string;
  variant?: ServiceCardVariant;
}

const VARIANT_COLOR: Record<ServiceCardVariant, string> = {
  primary: "text-black",
  secondary: "text-primary-dark",
};

export function LearnMoreLink({
  href,
  label,
  variant = "primary",
}: LearnMoreLinkProps): React.JSX.Element {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 transition-all hover:gap-5 ${VARIANT_COLOR[variant]}`}
      aria-label={`Learn more about ${label}`}
    >
      <span className="font-marcellus text-xl">Learn More</span>
      <FiArrowRight className="w-5 h-5" aria-hidden="true" />
    </Link>
  );
}
