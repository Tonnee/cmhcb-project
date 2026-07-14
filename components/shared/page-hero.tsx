import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Breadcrumb, type BreadcrumbItem } from "@/components/shared/breadcrumb";
import { Container } from "@/components/layout/container";

export interface PageHeroProps {
  /** Array of ancestor breadcrumb items. Each needs a label + href. */
  breadcrumbs: BreadcrumbItem[];
  /** The current page label shown at the end of the breadcrumb trail. */
  currentPage: string;
  /** Main h1 heading. */
  title: string;
  /** Supporting description paragraph. */
  description: string;
  /**
   * Path to the background image (relative to /public).
   * Defaults to the shared pages-hero background.
   */
  imageSrc?: string;
  /** Alt text for the background image (decorative by default). */
  imageAlt?: string;
  /** Label for the CTA button. Defaults to "Book an Appointment". */
  ctaLabel?: string;
  /** href for the CTA button. Defaults to "/book". */
  ctaHref?: string;
  /** Optional click handler for the CTA button. */
  onCtaClick?: () => void;
  /** Additional className for the outer <section>. */
  className?: string;
  /** Optional extra content to render below description. */
  children?: React.ReactNode;
  /** Optional duration text to show. */
  duration?: string;
  /** Optional fees text to show. */
  fees?: string;
}

export function PageHero({
  breadcrumbs,
  currentPage,
  title,
  description,
  imageSrc = "/pages-hero-background/1.png",
  imageAlt = "",
  ctaLabel = "Book an Appointment",
  ctaHref = "/appointment",
  onCtaClick,
  className = "",
  children,
  duration,
  fees,
}: PageHeroProps): React.JSX.Element {
  const allBreadcrumbs: BreadcrumbItem[] = [
    ...breadcrumbs,
    { label: currentPage }, // last item — no href, renders as current page text
  ];

  return (
    <section className={`relative w-full bg-dark-green min-h-[450px] lg:min-h-[500px] py-16 lg:py-24 flex items-center overflow-hidden ${className}`}>
      <Container className="relative w-full">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center w-full">
          {/* Content Column */}
          <div className="relative z-10 flex flex-col justify-center text-left">
            <Breadcrumb className="mb-6" items={allBreadcrumbs} theme="dark" />

            <h1 className="font-marcellus text-3xl md:text-4xl lg:text-5xl leading-tight text-white mb-6">
              {title}
            </h1>

            {description && (
              <p className="font-sans font-normal text-base leading-relaxed text-white/80 mb-6 max-w-xl">
                {description}
              </p>
            )}

            {/* Fees & Duration Metadata */}
            {(duration || fees) && (
              <div className="flex flex-wrap gap-3 items-center mb-8 text-xs font-semibold text-white">
                {duration && (
                  <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 flex items-center gap-1.5 shadow-sm">
                    <span className="text-white/60">Duration:</span> {duration}
                  </span>
                )}
                {fees && (
                  <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 flex items-center gap-1.5 shadow-sm">
                    <span className="text-white/60">Fees:</span> {fees}
                  </span>
                )}
              </div>
            )}

            {children && <div className="mb-8">{children}</div>}

            {/* CTA */}
            {ctaLabel && (
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Button
                  variant="white"
                  href={onCtaClick ? undefined : ctaHref}
                  onClick={onCtaClick}
                  className="w-full sm:w-auto"
                >
                  {ctaLabel}
                </Button>
              </div>
            )}
          </div>

          {/* Image Column */}
          <div className="relative hidden lg:block h-hero-image w-full">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-[570px] h-hero-image rounded-3xl overflow-hidden bg-muted/20">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 570px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
