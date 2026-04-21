"use client";

// Justification: requires useState, useEffect, useCallback for Embla carousel interactivity

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import type { Testimonial } from "@/data/testimonials";

interface ReviewCarouselProps {
  testimonials: Testimonial[];
}

export function ReviewCarousel({
  testimonials,
}: ReviewCarouselProps): React.JSX.Element {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
  });
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const onInit = React.useCallback(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onInit();
    onSelect();
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  const scrollTo = React.useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const activeTestimonial = testimonials[activeIndex];

  if (!activeTestimonial) return <></>;

  return (
    <div className="flex-1 pt-16">
      {/* Section label */}
      <p className="font-sans font-medium text-base text-accent mb-4">
        Clients Feedback
      </p>

      {/* Heading */}
      <h2 className="font-marcellus text-4xl leading-normal text-dark mb-14">
        Our Client Stories of{" "}
        <span className="text-primary">Healing</span> and{" "}
        <span className="text-accent">Growth</span>
      </h2>

      {/* Embla viewport — hidden, drives state only */}
      <div className="overflow-hidden" ref={emblaRef} aria-hidden="true">
        <div className="flex">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="min-w-0 shrink-0 grow-0 basis-full">
              {/* Slide content is rendered outside for layout control */}
              <span className="sr-only">{testimonial.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative w-[67px] h-[67px] rounded-full overflow-hidden shrink-0">
          <Image
            src={activeTestimonial.avatar}
            alt={`${activeTestimonial.name} - ${activeTestimonial.role} testimonial`}
            fill
            sizes="67px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-sans font-semibold text-base leading-6 text-dark">
            {activeTestimonial.name}
          </p>
          <p className="font-sans text-xs leading-6 text-light-ash">
            {activeTestimonial.role}
          </p>
        </div>
      </div>

      {/* Quote */}
      <blockquote className="font-sans text-base leading-6 text-dark mt-6 mb-6">
        &ldquo;{activeTestimonial.quote}&rdquo;
      </blockquote>

      {/* Pagination dots */}
      <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial navigation">
        {scrollSnaps.map((_, idx) => (
          <button
            key={idx}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent ${
              activeIndex === idx
                ? "bg-accent opacity-100 scale-110"
                : "bg-gray-300 opacity-60 hover:bg-gray-400"
            }`}
            aria-label={`View testimonial ${idx + 1}`}
            aria-selected={activeIndex === idx}
            role="tab"
            onClick={() => scrollTo(idx)}
          />
        ))}
      </div>
    </div>
  );
}
