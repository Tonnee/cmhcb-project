"use client";

import * as React from "react";
import { TherapistCard, type Therapist } from "@/components/shared/therapist-card";

interface TherapistListProps {
  therapists: Therapist[];
}

/** Returns all individual roles and credentials (split by "|") */
function getAllRoles(role: string): string[] {
  if (!role) return [];
  return role
    .split("|")
    .map((r) => r.trim())
    .filter(Boolean);
}

export function TherapistList({ therapists }: TherapistListProps): React.JSX.Element {
  const [activeCategory, setActiveCategory] = React.useState("All");

  // Derive unique categories dynamically from all roles & credentials across therapists
  const categories = [
    "All",
    ...Array.from(new Set(therapists.flatMap((t) => getAllRoles(t.role)))),
  ];

  const filteredTherapists =
    activeCategory === "All"
      ? therapists
      : therapists.filter((t) => getAllRoles(t.role).includes(activeCategory));

  return (
    <div className="w-full">
      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2.5 rounded-full font-sans text-15px font-medium border transition-colors duration-200 cursor-pointer ${
              activeCategory === category
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-dark border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex flex-wrap justify-center gap-6">
        {filteredTherapists.map((therapist) => (
          <div key={therapist.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] max-w-xs sm:max-w-none mx-auto sm:mx-0 mb-10">
            <TherapistCard
              therapist={therapist}
              className="w-full"
            />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredTherapists.length === 0 && (
        <p className="text-center font-sans text-light-ash py-16">
          No therapists found for this category.
        </p>
      )}
    </div>
  );
}
