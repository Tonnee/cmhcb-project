import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { LinkButton } from "@/components/ui/link-button";
import { ServicesApproachBlock, type ServicesApproachBlockProps } from "@/features/services/components/services-approach-block";
import { SERVICE_IMAGES } from "@/components/shared/service-card";

interface ServiceItem {
  title: string;
  slug: string;
  shortDescription: string;
  duration?: string | null;
  fees?: string | null;
  feesOnsite?: string | null;
  feesOnline?: string | null;
  image?: string | null;
}

interface AllServicesProps {
  services: ServiceItem[];
  approachData?: ServicesApproachBlockProps;
  sectionTitle?: string | null;
}

export function AllServices({ services, approachData, sectionTitle }: AllServicesProps): React.JSX.Element {
  const isOdd = services.length % 2 !== 0;
  const firstService = services[0];
  const firstServiceThumbnail =
    firstService?.image ||
    (firstService?.slug ? SERVICE_IMAGES[firstService.slug] : undefined) ||
    "/home-service-images/psychometric-assessment.png";

  return (
    <section aria-labelledby="services-heading" className="py-16 md:py-24">
      <Container>
        <SectionHeading
          id="services-heading"
          title={sectionTitle || "Our Psychotherapeutic Services"}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const isAccent = index === 0;
            const onSiteFee = service.feesOnsite || service.fees;
            const onlineFee = service.feesOnline || service.fees;

            return (
              <article
                key={service.slug}
                className={`group relative w-full rounded-3xl p-8 md:p-10 border transition-all duration-300 flex flex-col justify-between min-h-[300px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] ${
                  isAccent
                    ? "bg-accent border-accent/20 text-dark-green"
                    : "bg-white border-muted/30 hover:border-primary-dark/60"
                }`}
              >
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
                    {service.title}
                  </h3>

                  {/* Short Description */}
                  <p className={`font-sans font-normal text-base leading-relaxed mb-6 ${
                    isAccent ? "text-dark-green/80" : "text-light-ash/80"
                  }`}>
                    {service.shortDescription}
                  </p>
                </div>

                {/* On-site & Online Fee comparison pills */}
                <div className="grid grid-cols-2 gap-3 mb-6 font-sans">
                  <div className={`rounded-2xl p-3 border ${
                    isAccent
                      ? "bg-white/20 border-white/30 text-dark-green"
                      : "bg-[#f0f7ef] border-primary/20 text-dark-green"
                  }`}>
                    <div className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-90">
                      <span className={`w-1.5 h-1.5 rounded-full ${isAccent ? "bg-dark-green" : "bg-primary"}`} />
                      On-site Fee
                    </div>
                    <div className="text-sm font-bold mt-1">
                      {onSiteFee || "Available"}
                    </div>
                  </div>
                  <div className={`rounded-2xl p-3 border ${
                    isAccent
                      ? "bg-white/20 border-white/30 text-dark-green"
                      : "bg-[#f2f8fc] border-sky-600/20 text-dark"
                  }`}>
                    <div className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-90">
                      <span className={`w-1.5 h-1.5 rounded-full ${isAccent ? "bg-dark-green" : "bg-sky-600"}`} />
                      Online Fee
                    </div>
                    <div className="text-sm font-bold mt-1">
                      {onlineFee || "Available"}
                    </div>
                  </div>
                </div>

                {/* Footer Info & CTA */}
                <div className={`flex flex-wrap items-center justify-between gap-4 pt-4 border-t mt-auto ${
                  isAccent ? "border-white/20" : "border-muted/20"
                }`}>
                  <p className={`font-sans font-medium text-xs ${
                    isAccent ? "text-dark-green/80" : "text-light-ash"
                  }`}>
                    {service.duration ? `Duration: ${service.duration}` : "Available Online & On-site"}
                  </p>
                  <LinkButton
                    href={`/services/${service.slug}`}
                    label={`Learn more about ${service.title}`}
                    variant={isAccent ? "text" : "marcellus"}
                    className={isAccent ? "font-sans font-bold text-dark-green group-hover:text-white hover:text-white" : ""}
                  >
                    Learn More
                  </LinkButton>
                </div>
              </article>
            );
          })}

          {/* If services count is odd, fill the empty grid column with an image */}
          {isOdd && (
            <div className="relative w-full rounded-3xl overflow-hidden min-h-75 h-full border border-muted/30 group">
              <Image
                src={firstServiceThumbnail}
                alt={firstService?.title ? `${firstService.title} thumbnail` : "Psychotherapeutic services thumbnail"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}

          <ServicesApproachBlock {...approachData} />
        </div>
      </Container>
    </section>
  );
}
