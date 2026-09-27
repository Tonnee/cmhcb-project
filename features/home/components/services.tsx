import * as React from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard } from "@/components/shared/service-card";

interface ServiceItem {
  title: string;
  slug: string;
  shortDescription: string;
  image?: string | null;
  duration?: string | null;
  fees?: string | null;
}

export interface ServicesProps {
  services: ServiceItem[];
  subtitle?: string | null;
  title?: string | null;
}

export const DEFAULT_SERVICES_SUBTITLE = "Services We Provide";
export const DEFAULT_SERVICES_TITLE =
  "<span class=\"text-primary-dark\">Professional</span> Psychology Therapy <span class=\"text-accent\">Services</span><br class=\"hidden md:block\" /> You Can Choose";

export default function Services({
  services,
  subtitle = DEFAULT_SERVICES_SUBTITLE,
  title = DEFAULT_SERVICES_TITLE,
}: ServicesProps): React.JSX.Element {
  const currentSubtitle = subtitle || DEFAULT_SERVICES_SUBTITLE;
  const currentTitle = title || DEFAULT_SERVICES_TITLE;

  return (
    <section className="py-16 lg:py-24">
      <Container>
        {/* Header */}
        <SectionHeading 
          subtitle={currentSubtitle}
          title={<span dangerouslySetInnerHTML={{ __html: currentTitle }} />}
          className="mb-14 px-4"
        />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {services.map((service) => (
            <ServiceCard key={service.slug} item={service} />
          ))}
        </div>
      </Container>
    </section>
  );
}
