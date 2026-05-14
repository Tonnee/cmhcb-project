import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Breadcrumb, type BreadcrumbItem } from "@/components/shared/breadcrumb";

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
}

export function PageHero({
  breadcrumbs,
  currentPage,
  title,
  description,
  imageSrc = "/pages-hero-background/1.png",
  imageAlt = "",
  ctaLabel = "Book an Appointment",
  ctaHref = "/book",
  onCtaClick,
  className = "",
  children,
}: PageHeroProps): React.JSX.Element {
  const allBreadcrumbs: BreadcrumbItem[] = [
    ...breadcrumbs,
    { label: currentPage }, // last item — no href, renders as current page text
  ];

  return (
    <section
      className={`relative w-full h-auto min-h-[420px] py-20 overflow-hidden ${className}`}
    >
      {/* Background image */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden={imageAlt === ""}
      />

      {/* Dark overlay — matches Figma: rgba(1, 30, 0, 0.73) */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(1, 30, 0, 0.73)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        {/* Breadcrumb */}
        <Breadcrumb
          items={allBreadcrumbs}
          theme="dark"
          className="mb-6"
        />

        {/* Heading */}
        <h1 className="font-marcellus text-3xl md:text-[40px] leading-snug text-white max-w-[1156px] mb-6">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="font-sans text-base leading-5 text-white/90 max-w-[896px] mb-8">
            {description}
          </p>
        )}

        {/* Extra content */}
        {children && (
          <div className="mb-8">
            {children}
          </div>
        )}

        {/* CTA */}
        {ctaLabel && (
          <Button
            variant="white"
            href={onCtaClick ? undefined : ctaHref}
            onClick={onCtaClick}
          >
            {ctaLabel}
          </Button>
        )}
      </div>
    </section>
  );
}
