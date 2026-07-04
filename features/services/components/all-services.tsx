import * as React from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { LinkButton } from "@/components/ui/link-button";
import { ServicesApproachBlock } from "@/features/services/components/services-approach-block";

interface ServiceItem {
  title: string;
  slug: string;
  shortDescription: string;
  duration?: string | null;
  fees?: string | null;
}

interface AllServicesProps {
  services: ServiceItem[];
}

export function AllServices({ services }: AllServicesProps): React.JSX.Element {
  return (
    <section aria-labelledby="services-heading" className="py-16 md:py-24">
      <Container>
        <SectionHeading
          id="services-heading"
          title="Our Psychotherapeutic Services"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <article
              key={service.slug}
              className="group relative w-full bg-white rounded-3xl p-8 md:p-10 border border-muted/30 hover:border-primary-dark/60 transition-all duration-300 flex flex-col justify-between min-h-[300px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
            >
              <div>
                {/* Top Accent Line */}
                <div className="w-8 h-1 bg-accent/40 group-hover:w-16 group-hover:bg-primary-dark transition-all duration-300 mb-8 rounded-full" />
                
                {/* Heading */}
                <h3 className="font-marcellus text-2xl md:text-3xl text-dark mb-6 tracking-wide leading-snug group-hover:text-primary-dark transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="font-sans font-normal text-base text-light-ash/80 leading-relaxed mb-8">
                  {service.shortDescription}
                </p>
              </div>

              {/* Footer Info & CTA */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-muted/20 mt-auto">
                <p className="font-sans font-semibold text-xs tracking-wider text-light-ash/60 uppercase">
                  {service.duration && service.fees
                    ? `${service.duration} / ${service.fees}`
                    : service.duration || service.fees || "Evidence-Based Support"}
                </p>
                <LinkButton href={`/services/${service.slug}`} label={`Learn more about ${service.title}`} variant="marcellus">
                  Learn More
                </LinkButton>
              </div>
            </article>
          ))}
          <ServicesApproachBlock />
        </div>
      </Container>
    </section>
  );
}
