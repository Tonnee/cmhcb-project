"use client";

import * as React from "react";
import Image from "next/image";
import type { Testimonial } from "@/data/testimonials";
import { Pagination } from "@/components/shared/pagination";

interface PaginatedStoriesProps {
  testimonials: Testimonial[];
  itemsPerPage?: number;
}

export function PaginatedStories({ testimonials, itemsPerPage = 6 }: PaginatedStoriesProps): React.JSX.Element {
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTestimonials = testimonials.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Optional: scroll back to top of the section
    const element = document.getElementById("stories");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTestimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-3xl p-8 md:p-10 border border-muted hover:border-accent hover:shadow-md transition-all flex flex-col h-full"
          >
            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden shrink-0 bg-gray-100">
                <Image
                  src={testimonial.avatar}
                  alt={`${testimonial.name} - ${testimonial.role}`}
                  fill
                  sizes="60px"
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-sans font-semibold text-lg text-dark">
                  {testimonial.name}
                </h3>
                <p className="font-sans text-sm text-light-ash">
                  {testimonial.role}
                </p>
              </div>
            </div>

            <blockquote className="font-sans text-base leading-relaxed text-dark flex-grow italic">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-4"
      />
    </div>
  );
}
