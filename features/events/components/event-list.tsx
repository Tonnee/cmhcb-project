"use client";

import * as React from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { Event } from "@/features/events/data/events";
import { EventCard } from "@/features/events/components/event-card";
import { Pagination } from "@/components/shared/pagination";
import { Select } from "@/components/ui/select";

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;

  // Filter and sort the events
  const filteredAndSortedEvents = React.useMemo(() => {
    let result = [...events];

    // Search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [events, searchQuery, sortOrder]);

  // Reset pagination when search or sort changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedEvents.length / itemsPerPage);
  const paginatedEvents = filteredAndSortedEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by title or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans text-sm transition-shadow"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <HiMagnifyingGlass className="w-5 h-5" />
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="sort-order" className="font-sans text-sm text-dark font-medium whitespace-nowrap">
            Sort by:
          </label>
          <Select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            className="sm:w-auto"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </Select>
        </div>
      </div>

      {/* Grid Section */}
      {filteredAndSortedEvents.length > 0 ? (
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <p className="font-marcellus text-2xl text-dark mb-2">No events found</p>
          <p className="font-sans text-light-ash">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );
}
