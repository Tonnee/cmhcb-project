import * as React from "react";
import { type Metadata } from "next";
import { PageFeatureHero } from "@/components/shared/page-feature-hero";
import { FaqTabsSection } from "@/features/faqs/components/faq-tabs-section";

import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | CMHCB",
  description: "Find answers to your questions about our therapy services, appointments, billing, and privacy policies at CMHCB.",
};

export default async function FaqsPage(): Promise<React.JSX.Element> {
  const dbContent = await prisma.faqPageContent.findFirst();

  const title = dbContent?.heroTitle || "We are here to answer your questions";
  const description = dbContent?.heroDescription || "Whether you're new to therapy or an existing client, we've compiled a list of common questions to help you understand our services, payment methods, and privacy policies.";
  const imageSrc = dbContent?.heroImage || "/understanding-anxiety-workshop-event.png";

  let faqItems = [];
  if (dbContent?.items) {
    try {
      faqItems = JSON.parse(dbContent.items);
    } catch (e) {
      console.error("Failed to parse FAQ items:", e);
    }
  }

  return (
    <main>
      <PageFeatureHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "FAQs", href: "/faqs" },
        ]}
        title={title}
        description={description}
        image={{
          src: imageSrc,
          alt: "CMHCB support team and licensed therapist ready to answer your questions",
        }}
        ctas={[
          {
            label: "Search FAQs",
            variant: "primary",
            href: "#faq-section",
            className: "bg-primary-dark hover:bg-primary-dark/90 border-primary-dark",
          },
          {
            label: "Contact Support",
            variant: "outline",
            href: "/contact",
            className: "text-primary-dark border-primary-dark hover:bg-primary-dark/10",
          },
        ]}
      />
      <div id="faq-section">
        <FaqTabsSection initialItems={faqItems} />
      </div>
    </main>
  );
}
