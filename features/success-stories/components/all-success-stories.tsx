import * as React from "react";
import { TESTIMONIALS, type Testimonial } from "@/data/testimonials";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { PaginatedStories } from "./paginated-stories";

interface AllSuccessStoriesProps {
  testimonials: Testimonial[];
  sectionTitle?: string | null;
  sectionSubtitle?: string | null;
}

export function AllSuccessStories({
  testimonials,
  sectionTitle,
  sectionSubtitle,
}: AllSuccessStoriesProps): React.JSX.Element {
  const displayTestimonials = testimonials.length > 0 ? testimonials : TESTIMONIALS;

  return (
    <section className="py-20 bg-page-bg" id="stories">
      <Container>
        <SectionHeading
          title={sectionTitle || "Inspiring Journeys of Healing"}
          subtitle={sectionSubtitle || "Real Client Stories"}
          align="center"
          className="mb-14"
        />

        <PaginatedStories testimonials={displayTestimonials} />
      </Container>
    </section>
  );
}
