import * as React from "react";
import { HiCalendarDays, HiClock } from "react-icons/hi2";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { LocationPinIcon } from "@/components/layout/footer-icons";

function CalendarIcon({ className = "" }: { className?: string }): React.JSX.Element {
  return <HiCalendarDays className={className} />;
}

function ClockIcon({ className = "" }: { className?: string }): React.JSX.Element {
  return <HiClock className={className} />;
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
        <div className="flex flex-col gap-5">
          {date && (
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                colorMode === "accent" ? "bg-dark/10" : "bg-white/10"
              }`}>
                <CalendarIcon className={`w-6 h-6 ${textClass}`} />
              </div>
              <span className={`font-sans text-base leading-normal ${textClass}`}>
                {date}
              </span>
            </div>
          )}
          {time && (
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                colorMode === "accent" ? "bg-dark/10" : "bg-white/10"
              }`}>
                <ClockIcon className={`w-6 h-6 ${textClass}`} />
              </div>
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
    <section className="py-20">
      <div className="container">
        {/* Featured Event */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-[86px] mb-20">
          {/* Left side - Event details */}
          <div className="flex-1 flex flex-col justify-center">
            <SectionHeading 
              subtitle="Upcoming Events"
              title={<>&quot;Understanding Anxiety: <br className="hidden lg:block" /> Tools for Everyday Coping&quot;</>}
              align="left"
              className="mb-6"
            />

            <p className="font-sans text-base text-light-ash mb-12 max-w-xl leading-relaxed">
              Join our interactive workshop to explore the roots of anxiety and learn practical coping
              strategies for daily life. Ideal for individuals, caregivers, and professionals seeking to
              better understand emotional regulation and stress.
            </p>

            {/* Event meta info */}
            <div className="flex flex-col gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-marcellus text-lg text-dark leading-tight">
                    Saturday, July 20, 2025
                  </span>
                  <span className="font-sans text-sm text-light-ash">Date of Event</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-marcellus text-lg text-dark leading-tight">
                    10:00 AM – 1:00 PM
                  </span>
                  <span className="font-sans text-sm text-light-ash">Time of Session</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <LocationPinIcon />
                </div>
                <div className="flex flex-col">
                  <span className="font-marcellus text-lg text-dark leading-tight">
                    Trauma-Informed Care
                  </span>
                  <span className="font-sans text-sm text-light-ash">Category / Type</span>
                </div>
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
