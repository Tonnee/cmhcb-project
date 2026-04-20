import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function LocationIcon({ className = "" }: { className?: string }): React.JSX.Element {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

interface EventCardProps {
  title: string;
  date?: string;
  time?: string;
  colorMode: "primary" | "accent";
  description?: string;
  isInfoCard?: boolean;
}

function EventCard({ title, date, time, colorMode, description, isInfoCard = false }: EventCardProps): React.JSX.Element {
  const bgClass = colorMode === "accent" ? "bg-accent" : "bg-primary-dark";
  const textClass = colorMode === "accent" ? "text-dark" : "text-white";

  return (
    <div className={`h-[280px] rounded-[24px] p-6 flex flex-col justify-between ${bgClass}`}>
      {isInfoCard ? (
        <>
          <h3 className={`font-marcellus text-2xl leading-8 ${textClass}`}>
            {title}
          </h3>
          <p className={`font-sans text-sm leading-normal ${textClass}`}>
            {description}
          </p>
        </>
      ) : (
        <>
          <h3 className={`font-marcellus text-2xl leading-8 ${textClass}`}>
            {title}
          </h3>
          <div className="flex flex-col gap-4">
            {date && (
              <div className="flex items-center gap-2">
                <CalendarIcon className={`w-5 h-5 shrink-0 ${textClass}`} />
                <span className={`font-sans text-base leading-normal ${textClass}`}>
                  {date}
                </span>
              </div>
            )}
            {time && (
              <div className="flex items-center gap-1.5">
                <ClockIcon className={`w-5 h-5 shrink-0 ${textClass}`} />
                <span className={`font-sans text-base leading-normal ${textClass}`}>
                  {time}
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function UpcomingEvents(): React.JSX.Element {
  const upcomingEvents: EventCardProps[] = [
    {
      title: "More Events",
      description: "Join us in our upcoming events to learn, connect, and grow together in a supportive environment. Your journey to mental wellness and awareness starts here.",
      colorMode: "accent",
      isInfoCard: true,
    },
    {
      title: "\"Building Resilience in Children\"",
      date: "August 3, 2025",
      time: "10:00 AM – 1:00 PM",
      colorMode: "primary",
    },
    {
      title: "\"Basics of Psychological First Aid (PFA)\"",
      date: "August 3, 2025",
      time: "10:00 AM – 1:00 PM",
      colorMode: "primary",
    },
    {
      title: "\"Introduction to Cognitive Behavioral Ther...\"",
      date: "August 3, 2025",
      time: "10:00 AM – 1:00 PM",
      colorMode: "primary",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="container">
        {/* Featured Event */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-[86px] mb-20">
          {/* Left side - Event details */}
          <div className="flex-1 flex flex-col justify-center">
            <p className="font-sans font-medium text-base text-accent mb-6">
              Upcoming Events
            </p>

            <h2 className="font-marcellus text-4xl lg:text-5xl leading-tight text-dark mb-6 max-w-[500px]">
              &quot;Understanding Anxiety: { " " }
              <br className="hidden lg:block" />
              Tools for Everyday Coping&quot;
            </h2>

            <p className="font-sans text-base text-light-ash mb-12 max-w-xl leading-relaxed">
              Join our interactive workshop to explore the roots of anxiety and learn practical coping
              strategies for daily life. Ideal for individuals, caregivers, and professionals seeking to
              better understand emotional regulation and stress.
            </p>

            {/* Event meta info */}
            <div className="flex flex-col gap-4 mb-10">
              <div className="flex items-center gap-2 text-primary">
                <CalendarIcon className="w-5 h-5 shrink-0" />
                <span className="font-sans text-base text-dark">
                  Saturday, July 20, 2025
                </span>
              </div>

              <div className="flex items-center gap-2 text-primary">
                <ClockIcon className="w-5 h-5 shrink-0" />
                <span className="font-sans text-base text-dark">
                  10:00 AM – 1:00 PM
                </span>
              </div>

              <div className="flex items-center gap-2 text-primary">
                <LocationIcon className="w-5 h-5 shrink-0" />
                <span className="font-sans text-base text-dark">
                  Trauma-Informed Care
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Button href="#register" variant="primary">
                Register Now
              </Button>
            </div>
          </div>

          {/* Right side - Event image */}
          <div className="shrink-0 w-full lg:w-[474px]">
            <div className="relative w-full h-[350px] lg:h-[510px] rounded-[24px] overflow-hidden bg-gray-100">
              <Image
                src="/understanding-anxiety-workshop-event.png"
                alt="Understanding Anxiety Workshop"
                fill
                sizes="(max-width: 1024px) 100vw, 474px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {upcomingEvents.map((event) => (
            <EventCard key={event.title} {...event} />
          ))}
        </div>

        {/* Bottom CTA section */}
        <div className="mt-24 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <p className="font-marcellus text-lg md:text-xl leading-relaxed text-dark mb-10">
            Stay informed and engaged with CMHC,B&apos;s year-round programs, workshops, and awareness events. Our
            annual event calendar highlights key training sessions, mental health awareness days, and community
            initiatives designed to educate, support, and empower individuals across all age groups.
          </p>
          <Button href="/events" variant="primary">
            Explore yearly Event Calendar
          </Button>
        </div>
      </div>
    </section>
  );
}
