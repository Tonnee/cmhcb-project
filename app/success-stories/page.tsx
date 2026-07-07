import * as React from "react";
import { type Metadata } from "next";
import { PageFeatureHero } from "@/components/shared/page-feature-hero";
import { AllSuccessStories } from "@/features/success-stories/components/all-success-stories";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Success Stories & Client Feedback | CMHCB",
  description: "Read inspiring stories from our clients. Discover how therapy, training, and mental health support at CMHCB have changed lives.",
};

export const dynamic = "force-dynamic";

export default async function SuccessStoriesPage(): Promise<React.JSX.Element> {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <PageFeatureHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Success Stories", href: "/success-stories" },
        ]}
        title="Real experiences, real impact"
        description="Our clients share their journeys of transformation — honest reflections on the care, empathy, and support they received at CMHCB. Read how mental health care has empowered them to reclaim their lives."
        image={{
          src: "/home-review/mental-health-therapy-client-woman.png",
          alt: "A happy client sharing their successful journey with CMHCB",
        }}
        ctas={[
          {
            label: "Read Stories",
            variant: "primary",
            href: "#stories",
            className: "bg-primary-dark hover:bg-primary-dark/90 border-primary-dark",
          },
          {
            label: "Book Appointment",
            variant: "outline",
            href: "/appointment",
            className: "text-primary-dark border-primary-dark hover:bg-primary-dark/10",
          },
        ]}
      />
      <AllSuccessStories testimonials={testimonials} />
    </main>
  );
}
