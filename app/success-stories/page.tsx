import * as React from "react";
import { type Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { AllSuccessStories } from "@/features/success-stories/components/all-success-stories";
import { getRequiredAdminSession } from "@/app/(admin)/admin/admin-management";
import { Container } from "@/components/layout/container";
import prisma from "@/lib/prisma";

import { TESTIMONIALS, type Testimonial } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Success Stories & Client Feedback | CMHCB",
  description: "Read inspiring stories from our clients. Discover how therapy, training, and mental health support at CMHCB have changed lives.",
};

export const dynamic = "force-dynamic";

export default async function SuccessStoriesPage(): Promise<React.JSX.Element> {
  let isAdmin = false;
  try {
    await getRequiredAdminSession();
    isAdmin = true;
  } catch {
    isAdmin = false;
  }

  let testimonials: Testimonial[] = [];
  let pageContent: {
    heroTitle?: string;
    heroDescription?: string;
    heroImage?: string;
    heroImageAlt?: string | null;
    ctaLabel?: string | null;
    ctaHref?: string | null;
  } | null = null;

  try {
    const [dbTestimonials, dbPageContent] = await Promise.all([
      prisma.testimonial.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
      prisma.successStoriesPageContent.findFirst(),
    ]);

    if (dbTestimonials && dbTestimonials.length > 0) {
      testimonials = dbTestimonials as Testimonial[];
    }
    pageContent = dbPageContent;
  } catch (error) {
    console.error("Failed to fetch testimonials/content from database:", error);
    testimonials = TESTIMONIALS;
  }

  const heroTitle = pageContent?.heroTitle || "Real experiences, real impact";
  const heroDescription =
    pageContent?.heroDescription ||
    "Our clients share their journeys of transformation — honest reflections on the care, empathy, and support they received at CMHCB. Read how mental health care has empowered them to reclaim their lives.";
  const heroImage = pageContent?.heroImage || "/home-review/mental-health-therapy-client-woman.png";
  const heroImageAlt =
    pageContent?.heroImageAlt || "A happy client sharing their successful journey with CMHCB";
  const ctaLabel = pageContent?.ctaLabel || "Read Stories";
  const ctaHref = pageContent?.ctaHref || "#stories";

  return (
    <main>
      {isAdmin && (
        <div className="bg-primary/10 border-b border-primary/20 py-3 text-center text-sm">
          <Container className="flex items-center justify-between">
            <span className="font-medium text-primary-dark font-sans">
              You are logged in as an Administrator.
            </span>
            <a
              href="/admin/pages/success-stories"
              className="px-4 py-1.5 bg-primary-dark hover:bg-primary-dark/90 text-white rounded-lg font-semibold transition-all text-xs font-sans"
            >
              Edit Page Content
            </a>
          </Container>
        </div>
      )}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
        ]}
        currentPage="Success Stories"
        title={heroTitle}
        description={heroDescription}
        imageSrc={heroImage}
        imageAlt={heroImageAlt}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
      />
      <AllSuccessStories testimonials={testimonials} />
    </main>
  );
}
