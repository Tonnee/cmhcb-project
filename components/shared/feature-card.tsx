import * as React from "react";
import { LinkButton } from "@/components/ui/link-button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FeatureCardVariant = "primary" | "secondary" | "accent";

interface FeatureCardProps {
  title: string;
  description?: string;
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
  description,
  features,
  duration,
  fees,
  href,
  variant = "primary",
}: FeatureCardProps): React.JSX.Element {
  const isAccent = variant === "accent";

  return (
    <article className={`group relative w-full rounded-3xl p-8 md:p-10 border transition-all duration-300 flex flex-col justify-between min-h-80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] ${
      isAccent
        ? "bg-accent border-accent/20 text-dark-green"
        : "bg-white border-muted/30 hover:border-primary-dark/60"
    }`}>
      <div>
        {/* Top Accent Line */}
        <div className={`w-8 h-1 transition-all duration-300 mb-8 rounded-full ${
          isAccent
            ? "bg-white/40 group-hover:w-16 group-hover:bg-white"
            : "bg-accent/40 group-hover:w-16 group-hover:bg-primary-dark"
        }`} />
        
        {/* Heading */}
        <h3 className={`font-marcellus text-2xl md:text-3xl mb-6 tracking-wide leading-snug transition-colors duration-300 ${
          isAccent
            ? "text-dark-green group-hover:text-white"
            : "text-dark group-hover:text-primary-dark"
        }`}>
          {title}
        </h3>

        {/* Short Description */}
        {description && (
          <p className={`font-sans font-normal text-base leading-relaxed mb-8 ${
            isAccent ? "text-dark-green/80" : "text-light-ash/80"
          }`}>
            {description}
          </p>
        )}

        {/* Features List */}
        {features && features.length > 0 && (
          <ul className="space-y-3.5 mb-8">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2.5 ${
                  isAccent ? "bg-white/40" : "bg-primary/40"
                }`} aria-hidden="true" />
                <span className={`font-sans font-normal text-base leading-relaxed ${
                  isAccent ? "text-dark-green/90" : "text-light-ash/80"
                }`}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer Info & CTA */}
      <div className={`flex flex-wrap items-center justify-between gap-4 pt-6 border-t mt-auto ${
        isAccent ? "border-white/20" : "border-muted/20"
      }`}>
        <p className={`font-sans font-semibold text-xs tracking-wider uppercase ${
          isAccent ? "text-dark-green/60" : "text-light-ash/60"
        }`}>
          {duration} &bull; {fees}
        </p>
        <LinkButton
          href={href}
          label={`Learn more about ${title}`}
          variant={isAccent ? "text" : "marcellus"}
          className={isAccent ? "font-sans font-bold text-dark-green group-hover:text-white hover:text-white" : ""}
        >
          Learn More
        </LinkButton>
      </div>
    </article>
  );
}
