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
  return (
    <article className="group relative w-full bg-white rounded-3xl p-8 md:p-10 border border-muted/30 hover:border-primary-dark/60 transition-all duration-300 flex flex-col justify-between min-h-[320px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      <div>
        {/* Top Accent Line */}
        <div className="w-8 h-1 bg-accent/40 group-hover:w-16 group-hover:bg-primary-dark transition-all duration-300 mb-8 rounded-full" />
        
        {/* Heading */}
        <h3 className="font-marcellus text-2xl md:text-3xl text-dark mb-6 tracking-wide leading-snug group-hover:text-primary-dark transition-colors duration-300">
          {title}
        </h3>

        {/* Features List */}
        {features && features.length > 0 && (
          <ul className="space-y-3.5 mb-8">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0 mt-[10px]" aria-hidden="true" />
                <span className="font-sans font-normal text-base text-light-ash/80 leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer Info & CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-muted/20 mt-auto">
        <p className="font-sans font-semibold text-xs tracking-wider text-light-ash/60 uppercase">
          {duration} &bull; {fees}
        </p>
        <LearnMoreLink href={href} label={title} variant={variant} />
      </div>
    </article>
  );
}
