import * as React from "react";
import { HiCalendarDays, HiClock, HiUser, HiMapPin } from "react-icons/hi2";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EVENTS_DATA, type Event } from "@/features/events/data/events";
import { SectionHeading } from "@/components/shared/section-heading";
import { PageHero } from "@/components/shared/page-hero";
import { EventCard } from "@/features/events/components/event-card";
import { Tag } from "@/components/ui/tag";
import EventRegistrationForm from "@/features/events/components/event-registration-form";
import prisma from "@/lib/prisma";

// Shared icons for the page
function CalendarIcon({ className = "" }: { className?: string }): React.JSX.Element {
  return <HiCalendarDays className={className} />;
}

function ClockIcon({ className = "" }: { className?: string }): React.JSX.Element {
  return <HiClock className={className} />;
}

/*************  65b4c10a-3197-40ad-be1b-80dfccfb2380  *************/
function UserIcon({ className = "" }: { className?: string }): React.JSX.Element {
  return <HiUser className={className} />;
}

function LocationPinIcon({ className = "" }: { className?: string }): React.JSX.Element {
  return <HiMapPin className={className} />;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let event = EVENTS_DATA.find((e) => e.slug === slug);
  if (!event) {
    const dbEvent = await prisma.workshop.findUnique({ where: { slug } });
    if (dbEvent) {
      event = {
        id: dbEvent.id,
        slug: dbEvent.slug,
        title: dbEvent.title,
        description: dbEvent.description,
        image: dbEvent.image,
        date: dbEvent.date,
        time: dbEvent.time,
        location: dbEvent.location,
        author: dbEvent.author,
        tags: [],
      };
    }
  }

  if (!event) return {};
  return {
    title: `${event.title} | Events | CMHCB`,
    description: event.description,
  };
}

export default async function EventRegistrationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let event: Event | undefined;

  // 1. Try fetching from database first
  const dbEvent = await prisma.workshop.findUnique({ where: { slug } });
  if (dbEvent) {
    event = {
      id: dbEvent.id,
      slug: dbEvent.slug,
      title: dbEvent.title,
      description: dbEvent.description,
      image: dbEvent.image,
      date: dbEvent.date,
      time: dbEvent.time,
      location: dbEvent.location,
      author: dbEvent.author,
      tags: (() => {
        try {
          const parsed = JSON.parse(dbEvent.tags);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })(),
      content: dbEvent.content || undefined,
      gallery: (() => {
        try {
          const parsed = JSON.parse(dbEvent.gallery || "[]");
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })(),
    };
  } else {
    // 2. Fallback to static data
    event = EVENTS_DATA.find((e) => e.slug === slug);
  }

  if (!event) {
    notFound();
  }

  const isPast = new Date(event.date).getTime() < new Date().getTime();

  // Load other events
  const dbOthers = await prisma.workshop.findMany({
    where: { slug: { not: slug } },
    take: 3,
  });

  const parsedOthers = dbOthers.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    description: e.description,
    image: e.image,
    date: e.date,
    time: e.time,
    location: e.location,
    author: e.author,
    tags: (() => {
      try {
        const parsed = JSON.parse(e.tags);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })(),
  }));

  const otherEvents = parsedOthers.length > 0 ? parsedOthers : EVENTS_DATA.filter((e) => e.slug !== slug).slice(0, 3);

  if (isPast) {
    return (
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Events", href: "/events" },
          ]}
          currentPage={event.title}
          title={event.title}
          description={event.description}
          ctaLabel=""
          className="bg-dark-green"
        >
          <div className="flex flex-col items-center gap-6 mt-8">
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 font-sans text-base">
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 shrink-0 text-accent" />
                <span className="font-medium">Hosted by {event.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 shrink-0 text-accent" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <LocationPinIcon />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {event.tags.map(tag => (
                <Tag key={tag} variant="glass">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </PageHero>

        <Container className="py-20">
          <article
            className="mx-auto font-sans text-dark text-lg leading-relaxed [&>p]:mb-8 [&>h3]:font-marcellus [&>h3]:text-3xl [&>h3]:text-dark [&>h3]:mb-6 [&>h3]:mt-12 [&>h3]:leading-tight [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-8 [&_li]:mb-2"
            dangerouslySetInnerHTML={{ __html: event.content || event.description }}
          />
        </Container>

        {/* Photo Gallery Section */}
        {event.gallery && event.gallery.length > 0 && (
          <section className="py-20">
            <Container>
              <SectionHeading
                subtitle="Event Highlights"
                title={<>Captured <span className="text-primary-dark">Moments</span></>}
                className="mb-16"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {event.gallery.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-[24px] overflow-hidden group">
                    <Image
                      src={img}
                      alt={`Gallery image ${idx + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* Other Events Section */}
        <section className="py-24 bg-white">
          <Container>
            <SectionHeading
              subtitle="More Opportunities"
              title={<>Explore Other <span className="text-primary-dark">Events</span></>}
              className="mb-16"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </Container>
        </section>
      </main>
    );
  }

  // Upcoming Event Layout (Existing)
  return (
    <main className="pt-12 pb-24">
      <Container>
        <Breadcrumb
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
            { label: "Events", href: "/events" },
            { label: event.title },
          ]}
        />

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left Side: Essential Event Details */}
          <div className="flex-1">
            <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[510px] rounded-[32px] overflow-hidden bg-gray-100 mb-10 shadow-sm">
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
                priority
              />
            </div>

            <SectionHeading
              subtitle="Upcoming Event"
              title={event.title}
              align="left"
              className="mb-6"
            />

            <p className="font-sans text-base text-light-ash mb-10 leading-relaxed max-w-2xl">
              {event.description}
            </p>

            <div className="flex flex-col gap-6 ">
              {/* Date */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-dark text-lg mb-1">Date</h3>
                  <p className="font-sans text-base text-light-ash">
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-dark text-lg mb-1">Time</h3>
                  <p className="font-sans text-base text-light-ash">
                    {event.time}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <LocationPinIcon className="w-6 h-6" />
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-dark text-lg mb-1">Location</h3>
                  <p className="font-sans text-base text-light-ash leading-relaxed">
                    {event.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Registration Now */}
          <div className="w-full lg:w-[450px]">
            <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-gray-100 shadow-xl shadow-gray-200/50 sticky top-24">
              <div className="mb-8">
                <h2 className="font-marcellus text-3xl text-dark mb-2">
                  Register Now
                </h2>
                <p className="font-sans text-sm text-light-ash">
                  Fill out the form below to secure your spot.
                </p>
              </div>

              <EventRegistrationForm eventTitle={event.title} />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
