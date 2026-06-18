import * as React from "react";
import Image from "next/image";
import { Event } from "@/features/events/data/events";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SectionHeading } from "@/components/shared/section-heading";
import { PageHero } from "@/components/shared/page-hero";
import { Tag } from "@/components/ui/tag";
import { HiCalendarDays, HiClock, HiUser, HiMapPin } from "react-icons/hi2";
import WorkshopCard from "./workshop-card";
import WorkshopRegistrationForm from "./workshop-registration-form";

interface WorkshopDetailProps {
  workshop: Event;
  otherWorkshops: Event[];
}

export default function WorkshopDetail({
  workshop,
  otherWorkshops,
}: WorkshopDetailProps): React.JSX.Element {
  const isPast = new Date(workshop.date).getTime() < new Date().getTime();

  if (isPast) {
    return (
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Workshops", href: "/workshops" },
          ]}
          currentPage={workshop.title}
          title={workshop.title}
          description={workshop.description}
          ctaLabel=""
          className="bg-dark-green"
        >
          <div className="flex flex-col items-center gap-6 mt-8">
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 font-sans text-base">
              <div className="flex items-center gap-2">
                <HiUser className="w-5 h-5 shrink-0 text-accent" />
                <span className="font-medium">Hosted by {workshop.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiCalendarDays className="w-5 h-5 shrink-0 text-accent" />
                <span>
                  {new Date(workshop.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HiMapPin className="w-5 h-5 shrink-0 text-accent" />
                <span>{workshop.location}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {workshop.tags.map((tag) => (
                <Tag key={tag} variant="glass">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </PageHero>

        <Container className="py-20">
          <article
            className="max-w-3xl mx-auto font-sans text-dark text-lg leading-relaxed [&>p]:mb-8 [&>h3]:font-marcellus [&>h3]:text-3xl [&>h3]:text-dark [&>h3]:mb-6 [&>h3]:mt-12 [&>h3]:leading-tight"
            dangerouslySetInnerHTML={{ __html: workshop.content || workshop.description }}
          />
        </Container>

        {/* Photo Gallery Section */}
        {workshop.gallery && workshop.gallery.length > 0 && (
          <section className="py-20 bg-gray-50 border-t border-b border-gray-100">
            <Container>
              <SectionHeading
                subtitle="Workshop Highlights"
                title={<>Captured <span className="text-primary-dark">Moments</span></>}
                className="mb-16"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {workshop.gallery.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-[24px] overflow-hidden group shadow-sm bg-muted">
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

        {/* Other Workshops Section */}
        <section className="py-24 bg-white">
          <Container>
            <SectionHeading
              subtitle="More Opportunities"
              title={<>Explore Other <span className="text-primary-dark">Workshops</span></>}
              className="mb-16"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherWorkshops.map((e) => (
                <WorkshopCard key={e.id} workshop={e} />
              ))}
            </div>
          </Container>
        </section>
      </main>
    );
  }

  // Upcoming Workshop Layout
  return (
    <main className="pt-12 pb-24">
      <Container>
        <Breadcrumb
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
            { label: "Workshops", href: "/workshops" },
            { label: workshop.title },
          ]}
        />

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left Side: Essential Details */}
          <div className="flex-1">
            <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[510px] rounded-[32px] overflow-hidden bg-gray-100 mb-10 shadow-sm">
              <Image
                src={workshop.image}
                alt={workshop.title}
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
                priority
              />
            </div>

            <SectionHeading
              subtitle="Upcoming Workshop"
              title={workshop.title}
              align="left"
              className="mb-6"
            />

            <p className="font-sans text-base text-light-ash mb-10 leading-relaxed max-w-2xl">
              {workshop.description}
            </p>

            <div className="flex flex-col gap-6">
              {/* Date */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HiCalendarDays className="w-6 h-6" />
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-dark text-lg mb-1">Date</h3>
                  <p className="font-sans text-base text-light-ash">
                    {new Date(workshop.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HiClock className="w-6 h-6" />
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-dark text-lg mb-1">Time</h3>
                  <p className="font-sans text-base text-light-ash">{workshop.time}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HiMapPin className="w-6 h-6" />
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-dark text-lg mb-1">Location</h3>
                  <p className="font-sans text-base text-light-ash leading-relaxed">
                    {workshop.location}
                  </p>
                </div>
              </div>
            </div>

            {workshop.content && (
              <div className="mt-12 pt-10 border-t border-gray-100">
                <h2 className="font-marcellus text-2xl text-dark mb-6">
                  Workshop Highlights
                </h2>
                <article
                  className="font-sans text-dark text-base md:text-lg leading-relaxed [&>p]:mb-6 [&>h3]:font-marcellus [&>h3]:text-2xl [&>h3]:text-dark [&>h3]:mb-4 [&>h3]:mt-8 [&>h3]:leading-tight [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:mb-6 [&>ul]:font-sans [&>ul]:text-base [&>ul]:text-light-ash"
                  dangerouslySetInnerHTML={{ __html: workshop.content }}
                />
              </div>
            )}
          </div>

          {/* Right Side: Registration Form */}
          <div className="w-full lg:w-[450px]">
            <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-gray-100 shadow-xl shadow-gray-200/50 sticky top-24 animate-fade-in">
              <div className="mb-8">
                <h2 className="font-marcellus text-3xl text-dark mb-2">Register Now</h2>
                <p className="font-sans text-sm text-light-ash">
                  Fill out the form below to secure your spot.
                </p>
              </div>

              <WorkshopRegistrationForm workshopTitle={workshop.title} />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
