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
  const [selectedTag, setSelectedTag] = React.useState("all");
  const [sortOrder, setSortOrder] = React.useState<"default" | "newest" | "oldest">("default");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 9;

  // Extract unique tags sorted alphabetically
  const allTags = React.useMemo(() => {
    const tagsSet = new Set<string>();
    events.forEach((event) => {
      event.tags?.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet).sort((a, b) => a.localeCompare(b));
  }, [events]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTag(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "default" | "newest" | "oldest");
    setCurrentPage(1);
  };

  // Filter and sort the events
  const filteredAndSortedEvents = React.useMemo(() => {
    let result = [...events];

    // Search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Tag filter
    if (selectedTag !== "all") {
      result = result.filter((event) => event.tags.includes(selectedTag));
    }

    // Sort: if 'default', retain the admin serial order passed via props
    if (sortOrder === "newest") {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortOrder === "oldest") {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return result;
  }, [events, searchQuery, selectedTag, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredAndSortedEvents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById("events-list");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="events-list" className="flex flex-col gap-10">
      {/* Controls Section */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <input
            type="text"
            placeholder="Search workshops by title, topic, or tag..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans text-sm transition-shadow"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <HiMagnifyingGlass className="w-5 h-5" />
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          {/* Topic / Tag Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label htmlFor="tag-filter" className="font-sans text-sm text-dark font-medium whitespace-nowrap">
              Topic:
            </label>
            <Select
              id="tag-filter"
              value={selectedTag}
              onChange={handleTagChange}
              className="sm:w-auto min-w-[160px]"
            >
              <option value="all">All Topics</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label htmlFor="sort-order" className="font-sans text-sm text-dark font-medium whitespace-nowrap">
              Sort by:
            </label>
            <Select
              id="sort-order"
              value={sortOrder}
              onChange={handleSortChange}
              className="sm:w-auto min-w-[150px]"
            >
              <option value="default">Default Order</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      {paginatedEvents.length > 0 ? (
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <p className="font-marcellus text-2xl text-dark mb-2">No workshops found</p>
          <p className="font-sans text-light-ash">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );
}
