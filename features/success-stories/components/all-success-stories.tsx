import * as React from "react";
import { TESTIMONIALS } from "@/data/testimonials";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { PaginatedStories } from "./paginated-stories";

export function AllSuccessStories(): React.JSX.Element {
  return (
    <section className="py-20 bg-page-bg" id="stories">
      <Container>
        <SectionHeading
          title="Inspiring Journeys of Healing"
          subtitle="Real Client Stories"
          align="center"
          className="mb-14"
        />

        <PaginatedStories testimonials={TESTIMONIALS} />
      </Container>
    </section>
  );
}
