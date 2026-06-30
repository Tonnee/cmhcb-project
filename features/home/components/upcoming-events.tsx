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
    <div className={`min-h-[280px] h-full rounded-[24px] p-6 flex flex-col justify-between ${bgClass}`}>
      {isInfoCard ? (
        <>
          <h3 className={`font-marcellus text-3xl leading-8 ${textClass}`}>
            {title}
          </h3>
          <p className={`font-sans text-base leading-normal ${textClass}`}>
            {description}
          </p>
        </>
      ) : (
        <>
          <h3 className={`font-marcellus text-xl leading-8 ${textClass}`}>
            {title}
          </h3>
        <div className="flex flex-col gap-6">
          {date && (
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${ colorMode === "accent" ? "bg-dark/10" : "bg-white/10"
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
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${ colorMode === "accent" ? "bg-dark/10" : "bg-white/10"
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

interface WorkshopDB {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  author: string;
  tags: string; // JSON string
  isFeatured: boolean;
  content: string | null;
  gallery: string | null; // JSON string
}

interface UpcomingEventsProps {
  featuredWorkshop: WorkshopDB | null;
  gridWorkshops: WorkshopDB[];
}

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatDateShort = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export function UpcomingEvents({
  featuredWorkshop,
  gridWorkshops,
}: UpcomingEventsProps): React.JSX.Element {
  const upcomingEvents: EventCardProps[] = [
    {
      title: "Future Events",
      description: "Join us in our upcoming events to learn, connect, and grow together in a supportive environment. Your journey to mental wellness and awareness starts here.",
      colorMode: "accent",
      isInfoCard: true,
    },
    ...gridWorkshops.map((w) => ({
      title: `"${w.title}"`,
      date: formatDateShort(w.date),
      time: w.time,
      colorMode: "primary" as const,
    })),
  ];

  // Fallback featured workshop values
  const featured = featuredWorkshop || {
    title: "Understanding Anxiety: Tools for Everyday Coping",
    description: "Join our interactive workshop to explore the roots of anxiety and learn practical coping strategies for daily life.",
    date: "2026-07-20T10:00:00Z",
    time: "10:00 AM – 1:00 PM",
    location: "Online via Zoom",
    image: "/understanding-anxiety-workshop-event.png",
    slug: "understanding-anxiety-workshop",
  };

  return (
    <section className="py-20">
      <div className="container">
        {/* Featured Event */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-[86px] mb-20">
          {/* Left side - Event details */}
          <div className="flex-1 flex flex-col justify-center">
            <SectionHeading 
              subtitle="Upcoming Events"
              title={<>&quot;{featured.title}&quot;</>}
              align="left"
              size="md"
              className="mb-6"
            />

            <p className="font-sans text-base text-light-ash mb-12 max-w-xl leading-relaxed">
              {featured.description}
            </p>

            {/* Event meta info */}
            <div className="flex flex-col gap-6 mb-10">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-marcellus text-lg text-dark leading-tight">
                    {formatDate(featured.date)}
                  </span>
                  <span className="font-sans text-sm text-light-ash">Date of Event</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-marcellus text-lg text-dark leading-tight">
                    {featured.time}
                  </span>
                  <span className="font-sans text-sm text-light-ash">Time of Session</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <LocationPinIcon />
                </div>
                <div className="flex flex-col">
                  <span className="font-marcellus text-lg text-dark leading-tight">
                    {featured.location}
                  </span>
                  <span className="font-sans text-sm text-light-ash">Location</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Button href={`/workshops/${featured.slug}`} variant="primary">
                Register Now
              </Button>
            </div>
          </div>

          {/* Right side - Event image */}
          <div className="shrink-0 w-full lg:w-[474px]">
            <div className="relative w-full h-[350px] lg:h-full rounded-[24px] overflow-hidden bg-gray-100">
              <Image
                src={featured.image || "/understanding-anxiety-workshop-event.png"}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 474px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event.title} {...event} />
          ))}
        </div>

        {/* Bottom CTA section */}
        <div className="mt-24 flex flex-col items-center justify-center text-center mx-auto">
          <p className="font-marcellus text-lg md:text-xl leading-relaxed text-dark mb-10">
            Stay informed and engaged with CMHC,B&apos;s year-round programs, workshops, and awareness events. Our
            annual event calendar highlights key training sessions, mental health awareness days, and community
            initiatives designed to educate, support, and empower individuals across all age groups.
          </p>
          <Button href="/workshops" variant="primary">
            Explore all Workshops
          </Button>
        </div>
      </div>
    </section>
  );
}
