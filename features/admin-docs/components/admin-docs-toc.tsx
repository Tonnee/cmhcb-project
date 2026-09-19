"use client";

import * as React from "react";
import type { AdminDocItem } from "@/types/admin-docs";
import { HiOutlineDocumentText } from "react-icons/hi2";

interface AdminDocsTocProps {
  items: AdminDocItem[];
}

export default function AdminDocsToc({ items }: AdminDocsTocProps): React.JSX.Element {
  const handleScrollTo = (id: string): void => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      aria-label="Table of contents"
      className="hidden xl:flex flex-col gap-3 sticky top-6 bg-white p-4 rounded-2xl border border-muted/80 shadow-xs max-h-[calc(100vh-6rem)] overflow-y-auto w-64 shrink-0"
    >
      <div className="flex items-center gap-2 pb-2 border-b border-muted/60 text-xs font-semibold uppercase tracking-wider text-dark font-sans">
        <HiOutlineDocumentText className="w-4 h-4 text-primary" />
        <span>On This Page ({items.length})</span>
      </div>

      <ul className="flex flex-col gap-1 text-xs font-sans">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => handleScrollTo(item.id)}
              className="flex items-center gap-2 w-full text-left py-1.5 px-2 rounded-lg text-light-ash hover:text-dark hover:bg-light/40 transition-colors group cursor-pointer"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  item.isEditable ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <span className="truncate group-hover:underline">
                {item.title}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
