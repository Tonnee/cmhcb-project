import * as React from "react";
import { LearnMoreLink } from "@/components/ui/learn-more-link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FeatureCardVariant = "primary" | "secondary";

interface FeatureCardProps {
  title: string;
  features?: string[];
  duration: string;
  fees: string;
  href: string;
  variant?: FeatureCardVariant;
}

const VARIANT_CLASSES = {
  primary: {
    card: "bg-accent",
    bullet: "bg-white",
    label: "text-white",
    value: "text-black",
  },
  secondary: {
    card: "bg-card-secondary",
    bullet: "bg-light-ash/80",
    label: "text-black",
    value: "text-primary-dark",
  },
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FeatureCard({
  title,
  features,
  duration,
  fees,
  href,
  variant = "primary",
}: FeatureCardProps): React.JSX.Element {
  const v = VARIANT_CLASSES[variant];

  return (
    <article className={`relative w-full rounded-3xl p-10 md:p-12 ${v.card}`}>
      <h3 className="font-marcellus text-3xl md:text-4xl leading-snug text-black mb-8">
        {title}
      </h3>

      {features && features.length > 0 && (
        <ul className="space-y-3 mb-8">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-5">
              <span className={`w-3 h-3 rounded-full shrink-0 ${v.bullet}`} aria-hidden="true" />
              <span className="font-sans font-normal text-xl leading-8 text-black">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="font-sans font-semibold text-xl leading-8 mb-6">
        <span className={v.label}>Duration: </span>
        <span className={v.value}>{duration}, </span>
        <span className={v.label}>Fees: </span>
        <span className={v.value}>{fees}</span>
      </p>

      <LearnMoreLink href={href} label={title} variant={variant} />
    </article>
  );
}
