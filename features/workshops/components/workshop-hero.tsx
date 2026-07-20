import * as React from "react";
import Image from "next/image";
import { Event } from "@/features/events/data/events";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import { RightArrowIcon } from "@/components/ui/icons";
import { Tag } from "@/components/ui/tag";
import { HiCalendarDays, HiClock, HiMapPin } from "react-icons/hi2";

interface WorkshopHeroProps {
  featuredWorkshop: Event;
}

export default function WorkshopHero({ featuredWorkshop }: WorkshopHeroProps): React.JSX.Element {
  const now = new Date().getTime();
  const isUpcoming = new Date(featuredWorkshop.date).getTime() >= now;

  return (
    <section className="mb-40 pt-12">
      <Container>
        <Breadcrumb
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
            { label: "Workshops", href: "/workshops" },
          ]}
        />

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-86">
          {/* Left side - Featured Image */}
          <div className="shrink-0 w-full lg:w-474 flex flex-col">
            <div className="relative w-full min-h-350 flex-1 rounded-3xl overflow-hidden bg-gray-100 group">
              <Image
                src={featuredWorkshop.image}
                alt={featuredWorkshop.title}
                fill
                sizes="(max-width: 1024px) 100vw, 474px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute top-6 left-6 flex gap-2 flex-wrap">
                {featuredWorkshop.tags.map((tag) => (
                  <Tag key={tag} variant="glass-light">
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Featured Content */}
          <div className="flex-1 flex flex-col justify-center">
            <p className="font-sans font-medium text-base text-accent mb-6 uppercase tracking-wider">
              {isUpcoming ? "Upcoming Workshop" : "Past Workshop"}
            </p>

            <h1 className="font-marcellus text-3xl md:text-40px leading-tight text-dark mb-6 max-w-500">
              {featuredWorkshop.title}
            </h1>

            <p className="font-sans text-base text-light-ash mb-8 md:mb-12 max-w-xl leading-relaxed">
              {featuredWorkshop.description}
            </p>

            {/* Meta info */}
            <div className="flex flex-col gap-6 mb-8 md:mb-10">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HiCalendarDays className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans font-semibold text-base text-dark">
                    {new Date(featuredWorkshop.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HiClock className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans font-semibold text-base text-dark">
                    {featuredWorkshop.time}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HiMapPin className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans font-semibold text-base text-dark">
                    {featuredWorkshop.location}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Button href={`/workshops/${featuredWorkshop.slug}`} variant="primary" className="group">
                <span className="flex items-center gap-2">
                  {isUpcoming ? "Register Now" : "Read More"}
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
  );
}
