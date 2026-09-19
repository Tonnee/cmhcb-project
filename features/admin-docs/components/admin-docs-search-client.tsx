"use client";

import * as React from "react";
import { HiMagnifyingGlass, HiXMark, HiExclamationTriangle } from "react-icons/hi2";
import type { AdminDocItem, DocCategory, DocFilterTab } from "@/types/admin-docs";
import AdminDocsCard from "./admin-docs-card";
import AdminDocsStaticNotice from "./admin-docs-static-notice";
import AdminDocsToc from "./admin-docs-toc";

interface AdminDocsSearchClientProps {
  items: AdminDocItem[];
}

const CATEGORY_FILTERS: { label: string; value: DocCategory }[] = [
  { label: "All Topics", value: "all" },
  { label: "Landing & Home", value: "landing" },
  { label: "Services", value: "services" },
  { label: "Trainings", value: "trainings" },
  { label: "Therapists", value: "therapists" },
  { label: "Events & Workshops", value: "events" },
  { label: "Blogs", value: "blogs" },
  { label: "Other Pages", value: "pages" },
  { label: "Appointments", value: "appointments" },
  { label: "Static Code-Only", value: "static" },
];

export default function AdminDocsSearchClient({
  items,
}: AdminDocsSearchClientProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<DocFilterTab>("all");
  const [selectedCategory, setSelectedCategory] = React.useState<DocCategory>("all");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Filter items based on activeTab, category, and search query
  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      // Tab filter
      if (activeTab === "editable" && !item.isEditable) return false;
      if (activeTab === "static" && item.isEditable) return false;

      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      // Search keyword matching
      if (!normalizedQuery) return true;

      const searchableText = [
        item.title,
        item.summary,
        item.category,
        item.livePage.name,
        item.adminPath || "",
        item.codeLocation || "",
        ...item.fields,
        ...item.steps,
        ...(item.proTips || []),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [items, activeTab, selectedCategory, normalizedQuery]);

  // Determine if static content banner should show
  const hasStaticInResults = filteredItems.some((i) => !i.isEditable);
  const showStaticNotice =
    activeTab === "static" ||
    selectedCategory === "static" ||
    (normalizedQuery.length > 0 && hasStaticInResults);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Search Input Bar */}
      <div className="relative w-full">
        <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-ash/80" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search instructions, images, or sections (e.g., 'Hero background', 'FAQ', 'Therapists', 'Guide section')..."
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-muted bg-white text-dark text-sm placeholder:text-light-ash/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-light-ash hover:text-dark rounded-full cursor-pointer"
            aria-label="Clear search"
          >
            <HiXMark className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Primary Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-muted/70 pb-3">
        <div className="flex items-center gap-2 p-1 bg-light/60 rounded-xl border border-muted/60">
          <button
            type="button"
            onClick={() => {
              setActiveTab("all");
              if (selectedCategory === "static") setSelectedCategory("all");
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-dark-green shadow-xs font-bold"
                : "text-light-ash hover:text-dark"
            }`}
          >
            All Guides ({items.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("editable");
              if (selectedCategory === "static") setSelectedCategory("all");
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer ${
              activeTab === "editable"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-light-ash hover:text-dark"
            }`}
          >
            Editable in Dashboard ({items.filter((i) => i.isEditable).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("static")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "static"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-light-ash hover:text-dark"
            }`}
          >
            <HiExclamationTriangle className="w-3.5 h-3.5" />
            <span>Static Content (Code-Only) ({items.filter((i) => !i.isEditable).length})</span>
          </button>
        </div>

        <span className="text-xs text-light-ash font-sans">
          Showing <strong>{filteredItems.length}</strong> matching guide{filteredItems.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-1.5" aria-label="Topic filter">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-colors cursor-pointer border ${
              selectedCategory === cat.value
                ? "bg-primary text-white border-primary font-semibold shadow-xs"
                : "bg-white text-light-ash border-muted/80 hover:bg-light/40 hover:text-dark"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Static System Content Notice (Shown on static tab or when static content matches search) */}
      {showStaticNotice && (
        <AdminDocsStaticNotice searchedQuery={normalizedQuery || undefined} />
      )}

      {/* Layout Grid: Content Cards + Sticky Quick Navigation TOC */}
      <div className="flex items-start gap-8 w-full">
        {/* Main Guides Stream */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <AdminDocsCard key={item.id} item={item} />
            ))
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white border border-muted/80 flex flex-col items-center gap-3">
              <HiMagnifyingGlass className="w-10 h-10 text-light-ash/40" />
              <h3 className="font-marcellus text-xl font-bold text-dark">
                No matching instructions found
              </h3>
              <p className="font-sans text-xs md:text-sm text-light-ash max-w-md">
                We couldn&apos;t find any admin guides matching &quot;{searchQuery}&quot;. Note that if you are looking for hardcoded webpage text, static components do not have an admin editor.
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-light text-dark hover:bg-muted/60 transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("static");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors cursor-pointer"
                >
                  View Static Sections
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sticky Table of Contents */}
        {filteredItems.length > 0 && <AdminDocsToc items={filteredItems} />}
      </div>
    </div>
  );
}
