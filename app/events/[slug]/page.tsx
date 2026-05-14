import * as React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EVENTS_DATA } from "@/features/events/data/events";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { PageHero } from "@/components/shared/page-hero";
import { EventCard } from "@/features/events/components/event-card";
import Link from "next/link";

import {
  LocationPinIcon,
} from "@/components/layout/footer-icons";

// Shared icons for the page
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

function UserIcon({ className = "" }: { className?: string }): React.JSX.Element {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

export async function generateStaticParams() {
  return EVENTS_DATA.map((event) => ({
    slug: event.slug,
  }));
}

export default async function EventRegistrationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = EVENTS_DATA.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  const isPast = new Date(event.date).getTime() < new Date().getTime();
  const otherEvents = EVENTS_DATA.filter((e) => e.slug !== slug).slice(0, 3);

  if (isPast) {
    return (
      <main>
        <PageHero
          breadcrumbs={[{ label: "Events", href: "/events" }]}
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
                <span key={tag} className="px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full text-xs font-medium tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </PageHero>

        <Container className="py-20">
          <article 
            className="font-sans text-dark text-lg leading-relaxed [&>p]:mb-8 [&>h3]:font-marcellus [&>h3]:text-3xl [&>h3]:text-dark [&>h3]:mb-6 [&>h3]:mt-12 [&>h3]:leading-tight"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <div className="relative w-full h-[350px] lg:h-[510px] rounded-[32px] overflow-hidden bg-gray-100 mb-10 shadow-sm">
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

            <div className="flex flex-col gap-8 ">
              {/* Date */}
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
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
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
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
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <LocationPinIcon />
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

              <form className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="font-sans text-sm font-semibold text-dark ml-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your Full Name"
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans text-base transition-all bg-gray-50/30"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact" className="font-sans text-sm font-semibold text-dark ml-1">Contact Number</label>
                  <input
                    type="tel"
                    id="contact"
                    placeholder="+880"
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans text-base transition-all bg-gray-50/30"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-sans text-sm font-semibold text-dark ml-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="example@email.com"
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans text-base transition-all bg-gray-50/30"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="notes" className="font-sans text-sm font-semibold text-dark ml-1">Notes (Optional)</label>
                  <textarea
                    id="notes"
                    placeholder="Any specific questions or requirements?"
                    rows={4}
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans text-base transition-all bg-gray-50/30 resize-none"
                  />
                </div>

                <Button type="submit" variant="primary" className="mt-4 w-full justify-center h-14 text-lg rounded-2xl">
                  Confirm Registration
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
