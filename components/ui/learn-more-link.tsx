import * as React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { type FeatureCardVariant } from "@/components/shared/feature-card";

interface LearnMoreLinkProps {
  href: string;
  label: string;
  variant?: FeatureCardVariant;
}

const VARIANT_COLOR: Record<FeatureCardVariant, string> = {
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
      className={`inline-flex items-center gap-3 transition-all hover:gap-6 ${VARIANT_COLOR[variant]}`}
      aria-label={`Learn more about ${label}`}
    >
      <span className="font-marcellus text-xl">Learn More</span>
      <FiArrowRight className="w-5 h-5" aria-hidden="true" />
    </Link>
  );
}
