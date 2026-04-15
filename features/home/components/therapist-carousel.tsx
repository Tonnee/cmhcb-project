"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

export interface Therapist {
  id: string;
  image: string;
  name: string;
  role: string;
  showOverlay?: boolean;
}

interface TherapistCarouselProps {
  therapists: Therapist[];
}

function ArrowCircleIcon(): React.JSX.Element {
  return (
    <div className="w-[22px] h-[22px] flex-shrink-0">
      <svg viewBox="0 0 22 22" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="11" cy="11" r="10" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.5" />
        <path d="M9 7l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function TherapistCarousel({ therapists }: TherapistCarouselProps): React.JSX.Element {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleScroll = () => {
    if (!scrollRef.current || scrollRef.current.children.length === 0) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    
    // We isolate the horizontal width of the first sliding constituent element 
    // integrating the `gap-x-5` padding parameter natively
    const itemContent = scrollRef.current.children[0] as HTMLElement;
    // Calculate the item width + standard gap metric globally enforced
    const itemWidth = itemContent.offsetWidth + 20; 
    
    const index = Math.round(scrollLeft / itemWidth);
    setActiveIndex(Math.min(index, therapists.length - 1));
  };

  return (
    <div className="w-full">
      {/* Slider Container mapping zero-dependency CSS Native snaps */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-x-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 pt-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {therapists.map((therapist) => (
          <div 
            key={therapist.id} 
            className="flex flex-col items-center flex-shrink-0 min-w-0 snap-start snap-always w-[85vw] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-13px)] xl:w-[calc(25%-15px)]"
          >
            {/* Photo Card Block */}
            <div className="relative w-full rounded-3xl overflow-hidden aspect-[4/5] md:h-[320px] md:aspect-auto">
              <Image
                src={therapist.image}
                alt={therapist.name}
                fill
                sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover object-top"
              />

              {/* Overlay Interactive Sub-Block Trigger */}
              {therapist.showOverlay && (
                <Link
                  href="/book" 
                  className="absolute bottom-0 left-0 right-0 h-[87px] rounded-b-3xl flex items-center px-[18px] gap-2.5 cursor-pointer bg-[#000C00B2] backdrop-blur-[2px] transition-colors hover:bg-dark-green/95 group"
                >
                  <p className="font-marcellus text-xl text-accent flex-1">
                    Make Appointment
                  </p>
                  <div className="transition-transform group-hover:translate-x-1">
                    <ArrowCircleIcon />
                  </div>
                </Link>
              )}
            </div>

            {/* Name & Role */}
            <div className="flex flex-col items-center mt-4 gap-[4px]">
              <p className="font-marcellus text-base text-dark whitespace-nowrap tracking-wide">
                {therapist.name}
              </p>
              <p className="font-sans font-medium text-[15px] text-accent whitespace-nowrap">
                {therapist.role}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Synchronized Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-4 lg:mt-8">
        {therapists.map((_, idx) => (
          <button
            key={idx} 
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent ${activeIndex === idx ? "bg-accent opacity-100 scale-110" : "bg-gray-300 opacity-60 hover:bg-gray-400"}`}
            aria-label={`Navigate to slot ${idx + 1}`}
            aria-current={activeIndex === idx}
            onClick={() => {
                if(scrollRef.current && scrollRef.current.children[idx]) {
                   const target = scrollRef.current.children[idx] as HTMLElement;
                   // Use standard DOM offset to jump cleanly through the grid constraint parameters
                   const offset = target.offsetLeft - scrollRef.current.offsetLeft;
                   scrollRef.current.scrollTo({ left: offset, behavior: 'smooth' });
                }
            }}
          />
        ))}
      </div>
    </div>
  );
}
