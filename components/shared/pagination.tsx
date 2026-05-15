import * as React from "react";
import { LeftArrowIcon, RightArrowIcon } from "@/components/ui/icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps): React.JSX.Element | null {
  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex justify-center items-center gap-2 ${className}`}
      role="navigation"
      aria-label="Pagination Navigation"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
        className="w-10 h-10 flex items-center justify-center rounded-full font-sans transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent bg-white text-dark border border-muted hover:border-accent hover:text-accent disabled:opacity-50 disabled:pointer-events-none"
      >
        <LeftArrowIcon width="14" height="14" />
      </button>

      {Array.from({ length: totalPages }).map((_, idx) => {
        const pageNumber = idx + 1;
        const isCurrentPage = pageNumber === currentPage;

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            aria-current={isCurrentPage ? "page" : undefined}
            aria-label={`Page ${pageNumber}`}
            className={`w-10 h-10 flex items-center justify-center rounded-full font-sans font-medium text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              isCurrentPage
                ? "bg-accent text-white shadow-sm"
                : "bg-white text-dark border border-muted hover:border-accent hover:text-accent"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
        className="w-10 h-10 flex items-center justify-center rounded-full font-sans transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent bg-white text-dark border border-muted hover:border-accent hover:text-accent disabled:opacity-50 disabled:pointer-events-none"
      >
        <RightArrowIcon width="14" height="14" />
      </button>
    </div>
  );
}
