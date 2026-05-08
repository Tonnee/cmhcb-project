import * as React from "react";
import { PageFeatureHero } from "@/components/shared/page-feature-hero";
import { AllServices } from "@/features/services/components/all-services";
import { ServiceInfoSection } from "@/features/services/components/service-info-section";

export default function ServicesPage(): React.JSX.Element {
  return (
    <main>
      <PageFeatureHero
        breadcrumbs={[{ label: "Services", href: "/services" }]}
        title="Professional, ethical, and evidence-based mental health care"
        description="At CMHC,B, we provide compassionate and confidential psychotherapeutic services to support individuals, couples, families, and organizations in improving mental well-being and quality of life."
        image={{
          src: "/compassionate-mental-health-professional.png",
          alt: "Professional psychotherapy session",
        }}
        ctas={[
          {
            label: "Book an Appointment",
            variant: "primary",
            href: "/book",
            className: "bg-primary-dark hover:bg-primary-dark/90 border-primary-dark",
          },
          {
            label: "Talk to a Professional",
            variant: "outline",
            href: "/support",
            className: "text-primary-dark border-primary-dark hover:bg-primary-dark/10",
          },
        ]}
      />
      <AllServices />
      <ServiceInfoSection />
    </main>
  );
}
