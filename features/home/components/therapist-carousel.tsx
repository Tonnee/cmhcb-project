"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { TherapistCard, type Therapist } from "@/components/shared/therapist-card";

interface TherapistCarouselProps {
  therapists: Therapist[];
}

export function TherapistCarousel({ therapists }: TherapistCarouselProps): React.JSX.Element {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
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

  return (
    <div className="w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-x-5 pb-6 pt-2 select-none">
          {therapists.map((therapist) => (
            <TherapistCard
              key={therapist.id}
              therapist={therapist}
              className="shrink-0 w-[85vw] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-13.3px)] xl:w-[calc(25%-15px)] cursor-grab active:cursor-grabbing"
            />
          ))}
        </div>
      </div>

      {/* Synchronized Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-4 lg:mt-8">
        {scrollSnaps.map((_, idx) => (
          <button
            key={idx}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent ${
              activeIndex === idx
                ? "bg-accent opacity-100 scale-110"
                : "bg-gray-300 opacity-60 hover:bg-gray-400"
            }`}
            aria-label={`Navigate to slide ${idx + 1}`}
            aria-current={activeIndex === idx}
            onClick={() => scrollTo(idx)}
          />
        ))}
      </div>
    </div>
  );
}
