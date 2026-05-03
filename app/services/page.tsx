import * as React from "react";
import { PsychotherapyHero } from "@/features/services/components/psychotherapy-hero";
import { AllServices } from "@/features/services/components/all-services";
import { ServiceInfoSection } from "@/features/services/components/service-info-section";

export default function ServicesPage(): React.JSX.Element {
  return (
    <main>
      <PsychotherapyHero />
      <AllServices />
      <ServiceInfoSection />
    </main>
  );
}
