import * as React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EVENTS_DATA } from "@/features/events/data/events";
import { EventList } from "@/features/events/components/event-list";
import { Button } from "@/components/ui/button";
import { RightArrowIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/shared/section-heading";
import { LocationPinIcon } from "@/components/layout/footer-icons";

// Simple icon components for the meta details
function CalendarIcon({ className = "" }: { className?: string }): React.JSX.Element {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}



function ClockIcon({ className = "" }: { className?: string }): React.JSX.Element {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Upcoming Mental Health Events & Workshops | CMHC,B",
  description: "Join our upcoming workshops, seminars, and events focused on mental well-being and psychological support.",
};

export default function EventsPage(): React.JSX.Element {
  const now = new Date().getTime();

  // Sort events by date: nearest future event first, then latest past event
  const sortedEvents = [...EVENTS_DATA].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();

    const isAUpcoming = timeA >= now;
    const isBUpcoming = timeB >= now;

    if (isAUpcoming && isBUpcoming) return timeA - timeB; // Nearest future first
    if (!isAUpcoming && !isBUpcoming) return timeB - timeA; // Latest past first
    return isAUpcoming ? -1 : 1; // Upcoming always before past
  });

  const featuredEvent = sortedEvents[0];
  const remainingEvents = sortedEvents.slice(1);

  return (
    <main className="pt-12 pb-24">
      {/* Featured Event Section */}
      <section className="mb-40">
        <Container>
          <Breadcrumb
            className="mb-8"
            items={[
              { label: "Home", href: "/" },
              { label: "Events", href: "/events" },
            ]}
          />
          
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-[86px]">
            {/* Left side - Featured Image */}
            <div className="shrink-0 w-full lg:w-[474px] flex flex-col">
              <div className="relative w-full min-h-[350px] flex-1 rounded-[24px] overflow-hidden bg-gray-100 group">
                <Image
                  src={featuredEvent.image}
                  alt={featuredEvent.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 474px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute top-6 left-6 flex gap-2 flex-wrap">
                  {featuredEvent.tags.map(tag => (
                    <span key={tag} className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-dark rounded-full font-sans text-xs font-semibold shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Featured Content */}
            <div className="flex-1 flex flex-col justify-center">
              <p className="font-sans font-medium text-base text-accent mb-6 uppercase tracking-wider">
                {new Date(featuredEvent.date).getTime() >= now ? "Upcoming Event" : "Past Event"}
              </p>

              <h1 className="font-marcellus text-[40px] leading-tight text-dark mb-6 max-w-[500px]">
                {featuredEvent.title}
              </h1>

              <p className="font-sans text-base text-light-ash mb-12 max-w-xl leading-relaxed">
                {featuredEvent.description}
              </p>

              {/* Meta info */}
              <div className="flex flex-col gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans font-semibold text-base text-dark">
                      {new Date(featuredEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ClockIcon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans font-semibold text-base text-dark">
                      {featuredEvent.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <LocationPinIcon />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans font-semibold text-base text-dark">
                      {featuredEvent.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div>
                <Button href={`/events/${featuredEvent.slug}`} variant="primary" className="group">
                  <span className="flex items-center gap-2">
                    {new Date(featuredEvent.date).getTime() >= now ? "Register Now" : "Read More"}
                    <span className="transition-transform group-hover:translate-x-1">
                      <RightArrowIcon className="w-4 h-4" />
                    </span>
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* All Events List Section */}
      <section>
        <Container>
          <SectionHeading
            subtitle="Upcoming Events"            
            title={<>Our Latest <span className="text-primary-dark">Workshops</span> & Seminars</>}
            className="mt-20 mb-10"
          />
          
          <EventList events={remainingEvents} />
        </Container>
      </section>
    </main>
  );
}
