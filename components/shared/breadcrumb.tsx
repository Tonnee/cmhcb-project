import * as React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  /** Omit href for the current (active) page — it will render as plain text. */
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  /**
   * "light" (default) — dark text, for use on white/light backgrounds.
   * "dark"            — light/accent text, for use on dark/image backgrounds.
   */
  theme?: "light" | "dark";
}

export function Breadcrumb({
  items,
  className = "",
  theme = "light",
}: BreadcrumbProps): React.JSX.Element {
  const ancestorClass =
    theme === "dark"
      ? "text-accent transition-colors hover:text-white"
      : "text-primary-dark transition-colors hover:text-accent";

  const currentClass =
    theme === "dark" ? "text-muted" : "text-light-ash/80";

  const separatorClass =
    theme === "dark" ? "text-accent/60" : "text-light-ash/50";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`font-sans font-normal text-sm ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-x-1">
              {/* Separator — hidden from screen readers */}
              {index > 0 && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className={`w-3.5 h-3.5 flex-shrink-0 ${separatorClass}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
                </svg>
              )}

              {isLast || !item.href ? (
                /* Current page — no link, visually muted */
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={currentClass}
                >
                  {item.label}
                </span>
              ) : (
                /* Ancestor — clickable link */
                <Link href={item.href} className={ancestorClass}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
