import * as React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { EVENTS_DATA } from "@/features/events/data/events";
import WorkshopHero from "@/features/workshops/components/workshop-hero";
import WorkshopList from "@/features/workshops/components/workshop-list";

export const metadata: Metadata = {
  title: "Upcoming Mental Health Workshops | CMHCB",
  description: "Join our upcoming workshops and seminars focused on mental well-being and psychological support.",
};

export default function WorkshopsPage(): React.JSX.Element {
  const now = new Date().getTime();

  // Filter only workshops
  const workshops = EVENTS_DATA.filter((event) =>
    event.tags.some((tag) => tag.toLowerCase() === "workshop")
  );

  if (workshops.length === 0) {
    return (
      <main className="py-24">
        <Container>
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
            <p className="font-marcellus text-2xl text-dark mb-2">No Workshops Available</p>
            <p className="font-sans text-light-ash">Please check back later.</p>
          </div>
        </Container>
      </main>
    );
  }

  // Sort workshops by date: nearest future workshop first, then latest past workshop
  const sortedWorkshops = [...workshops].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();

    const isAUpcoming = timeA >= now;
    const isBUpcoming = timeB >= now;

    if (isAUpcoming && isBUpcoming) return timeA - timeB; // Nearest future first
    if (!isAUpcoming && !isBUpcoming) return timeB - timeA; // Latest past first
    return isAUpcoming ? -1 : 1; // Upcoming always before past
  });

  const featuredWorkshop = sortedWorkshops[0];
  const remainingWorkshops = sortedWorkshops.slice(1);

  return (
    <main className="pb-24">
      {/* Featured Workshop Hero Section */}
      <WorkshopHero featuredWorkshop={featuredWorkshop} />

      {/* All Workshops List Section */}
      <section>
        <Container>
          <SectionHeading
            subtitle="All Workshops"
            title={<>Explore Our <span className="text-primary-dark">Interactive</span> Sessions</>}
            className="mt-20 mb-10"
          />

          <WorkshopList workshops={remainingWorkshops} />
        </Container>
      </section>
    </main>
  );
}

