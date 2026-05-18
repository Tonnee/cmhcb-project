import * as React from "react";
import { type Metadata } from "next";
import { SimplePageHeader } from "@/components/shared/simple-page-header";
import { Button } from "@/components/ui/button";
import { EmergencySupport } from "@/features/support/components/emergency-support";

export const metadata: Metadata = {
  title: "Support & Emergency Contacts | CMHCB",
  description: "Get immediate help and support for mental health crises. Reach out to our emergency contacts or trained professionals for assistance.",
};

export default function SupportPage(): React.JSX.Element {
  return (
    <main>
      <SimplePageHeader
        breadcrumbs={[{ label: "Support", href: "/support" }]}
        title="We are here to support you in times of need"
        description="Whether you are facing a mental health crisis or seeking guidance for a loved one, CMHCB is here to help. Reach out to our emergency contacts or trained professionals for immediate assistance."
        className="bg-page-bg py-20"
      >
        <div className="flex flex-wrap items-center gap-4 mt-8">
          <Button href="#emergency-contacts" variant="primary" className="bg-primary-dark hover:bg-primary-dark/90 border-primary-dark">
            Emergency Contacts
          </Button>
          <Button href="/contact" variant="outline" className="text-primary-dark border-primary-dark hover:bg-primary-dark/10 bg-transparent">
            Contact Us
          </Button>
        </div>
      </SimplePageHeader>
      
      <div id="emergency-contacts">
        <EmergencySupport />
      </div>
    </main>
  );
}
