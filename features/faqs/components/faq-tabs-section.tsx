"use client";

import * as React from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { FaqAccordionItem } from "@/components/shared/faq";
import { Pagination } from "@/components/shared/pagination";
import { CATEGORIZED_FAQS, FAQ_CATEGORIES } from "@/data/faqs";

interface FaqItem {
  category: string;
  question: string;
  answer: string;
}

interface FaqTabsSectionProps {
  initialItems?: FaqItem[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  sectionDescription?: string;
  pageSize?: number;
}

export function FaqTabsSection({
  initialItems,
  sectionTitle,
  sectionSubtitle,
  sectionDescription,
  pageSize = 10,
}: FaqTabsSectionProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<string>("All");
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const parsedItems = React.useMemo(() => {
    if (initialItems && initialItems.length > 0) {
      return initialItems.map((item, idx) => ({
        id: `${item.category}-${idx}`,
        category: item.category,
        question: item.question,
        answer: item.answer
      }));
    }
    return CATEGORIZED_FAQS;
  }, [initialItems]);

  const categories = React.useMemo(() => {
    if (initialItems && initialItems.length > 0) {
      const cats = Array.from(new Set(initialItems.map((item) => item.category)));
      const order = ["Services", "Trainings", "Therapist", "Therapists", "Others"];
      return cats.sort((a, b) => {
        const idxA = order.indexOf(a);
        const idxB = order.indexOf(b);
        if (idxA === -1 && idxB === -1) return a.localeCompare(b);
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
      });
    }
    return FAQ_CATEGORIES;
  }, [initialItems]);

  // Filter logic
  const filteredFaqs = React.useMemo(() => {
    return parsedItems.filter((faq) => {
      const matchesCategory = activeTab === "All" || faq.category === activeTab;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeTab, parsedItems]);

  // Reset page to 1 when search query or active category tab changes
  React.useEffect(() => {
    setCurrentPage(1);
    setOpenIndex(0);
  }, [activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredFaqs.length / pageSize);

  const paginatedFaqs = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredFaqs.slice(startIndex, startIndex + pageSize);
  }, [filteredFaqs, currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setOpenIndex(0);
    const element = document.getElementById("faq-section");
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-16 md:py-24 bg-page-bg">
      <Container>
        <SectionHeading
          title={sectionTitle || "Frequently Asked Questions"}
          subtitle={sectionSubtitle || "How can we help?"}
          align="center"
        />

        <div className="mb-12">
          <p className="font-sans text-center text-light-ash max-w-2xl mx-auto mb-8 text-lg">
            {sectionDescription || "Find answers to common questions about our therapy services, billing, appointments, and privacy policies. Can't find what you're looking for? Reach out to us directly."}
          </p>

          <div className="relative max-w-xl mx-auto mb-10">
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenIndex(null); // Reset open accordion on search
              }}
              className="w-full h-14 pl-6 pr-12 rounded-full border border-muted focus:border-primary-dark focus:ring-1 focus:ring-primary-dark outline-none font-sans transition-colors shadow-sm"
              aria-label="Search FAQs"
            />
            <HiMagnifyingGlass className="absolute right-6 top-1/2 -translate-y-1/2 text-light-ash w-5 h-5" aria-hidden="true" />
          </div>

          {/* Tabs */}
          <div
            className="flex flex-wrap justify-center gap-3"
            role="tablist"
            aria-label="FAQ Categories"
          >
            <button
              onClick={() => {
                setActiveTab("All");
                setOpenIndex(0);
              }}
              role="tab"
              aria-selected={activeTab === "All"}
              className={`px-6 py-2.5 rounded-full font-sans text-sm font-medium transition-all ${activeTab === "All"
                  ? "bg-primary-dark text-white shadow-sm"
                  : "bg-white text-dark border border-muted hover:border-accent hover:text-accent"
                }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveTab(category);
                  setOpenIndex(0);
                }}
                role="tab"
                aria-selected={activeTab === category}
                className={`px-6 py-2.5 rounded-full font-sans text-sm font-medium transition-all ${activeTab === category
                    ? "bg-primary-dark text-white shadow-sm"
                    : "bg-white text-dark border border-muted hover:border-accent hover:text-accent"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="min-h-100">
          {paginatedFaqs.length > 0 ? (
            <div>
              {filteredFaqs.length > pageSize && (
                <div className="flex items-center justify-between mb-6 px-1">
                  <span className="font-sans text-xs text-light-ash">
                    Showing {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, filteredFaqs.length)} of {filteredFaqs.length} questions
                  </span>
                  <span className="font-sans text-xs text-light-ash">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              )}

              <div>
                {paginatedFaqs.map((faq, index) => (
                  <FaqAccordionItem
                    key={faq.id}
                    item={{ question: faq.question, answer: faq.answer }}
                    isOpen={openIndex === index}
                    onToggle={() => toggle(index)}
                    showDivider={index < paginatedFaqs.length - 1}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <p className="font-marcellus text-2xl text-dark mb-3">No results found</p>
              <p className="font-sans text-light-ash">
                Try adjusting your search terms or category filters.
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
