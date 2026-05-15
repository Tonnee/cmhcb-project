import * as React from "react";
import { type Metadata } from "next";
import { PageFeatureHero } from "@/components/shared/page-feature-hero";
import { EmergencySupport } from "@/features/support/components/emergency-support";

export const metadata: Metadata = {
  title: "Support & Emergency Contacts | CMHCB",
  description: "Get immediate help and support for mental health crises. Reach out to our emergency contacts or trained professionals for assistance.",
};

export default function SupportPage(): React.JSX.Element {
  return (
    <main>
      <PageFeatureHero
        breadcrumbs={[{ label: "Support", href: "/support" }]}
        title="We are here to support you in times of need"
        description="Whether you are facing a mental health crisis or seeking guidance for a loved one, CMHCB is here to help. Reach out to our emergency contacts or trained professionals for immediate assistance."
        image={{
          src: "/compassionate-mental-health-professional.png",
          alt: "CMHCB mental health professional offering support",
        }}
        ctas={[
          {
            label: "Emergency Contacts",
            variant: "primary",
            href: "#emergency-contacts",
            className: "bg-primary-dark hover:bg-primary-dark/90 border-primary-dark",
          },
          {
            label: "Contact Us",
            variant: "outline",
            href: "/contact",
            className: "text-primary-dark border-primary-dark hover:bg-primary-dark/10",
          },
        ]}
      />
      
      <div id="emergency-contacts">
        <EmergencySupport />
      </div>
    </main>
  );
}
