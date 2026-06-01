import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Breadcrumb, type BreadcrumbItem } from "@/components/shared/breadcrumb";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FeatureHeroCta {
  label: string;
  href: string;
  variant: "primary" | "primary-dark" | "outline";
  className?: string;
}

interface PageFeatureHeroImage {
  src: string;
  alt: string;
}

interface PageFeatureHeroProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description: string;
  image: PageFeatureHeroImage;
  ctas: FeatureHeroCta[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PageFeatureHero({
  breadcrumbs,
  title,
  description,
  image,
  ctas,
}: PageFeatureHeroProps): React.JSX.Element {
  return (
    <section className="relative w-full min-h-[500px] lg:h-[500px] py-12 lg:py-16">
      <Container className="relative h-full">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-6 items-center h-full">
          {/* Content Column */}
          <div className="relative z-10 flex flex-col justify-center mr-20">
            <Breadcrumb className="mb-6" items={breadcrumbs} />

            <h1 className="font-marcellus text-3xl md:text-4xl leading-tight text-footer-bg mb-6 max-w-lg">
              {title}
            </h1>

            <p className="font-sans font-normal text-base leading-snug text-light-ash/80 mb-8 max-w-lg">
              {description}
            </p>

            <div className="flex flex-wrap gap-6">
              {ctas.map((cta) => (
                <Button
                  key={cta.label}
                  variant={cta.variant}
                  href={cta.href}
                  className={cta.className}
                >
                  {cta.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Image Column */}
          <div className="relative hidden lg:block h-hero-image">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-[570px] h-hero-image rounded-3xl overflow-hidden bg-muted">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 570px"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
