"use client";

import * as React from "react";
import { TherapistCard } from "@/components/shared/therapist-card";
import { THERAPISTS_DATA } from "@/features/therapists/data/therapists";

export function TherapistList(): React.JSX.Element {
  const [activeCategory, setActiveCategory] = React.useState("All");

  const categories = ["All", ...Array.from(new Set(THERAPISTS_DATA.map((t) => t.role)))];

  const filteredTherapists = activeCategory === "All"
    ? THERAPISTS_DATA
    : THERAPISTS_DATA.filter((t) => t.role === activeCategory);

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2.5 rounded-full font-sans text-[15px] font-medium transition-all duration-300 ${
              activeCategory === category
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-dark border border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
        {filteredTherapists.map((therapist) => (
          <TherapistCard
            key={therapist.id}
            therapist={therapist}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
}
