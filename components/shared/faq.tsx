"use client";

import * as React from "react";
import { HiChevronDown } from "react-icons/hi2";
import { Container } from "@/components/layout/container";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FaqItem {
  question: string;
  answer: string;
}

// ---------------------------------------------------------------------------
// FaqAccordionItem — reusable single question/answer row
// ---------------------------------------------------------------------------

interface FaqAccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  showDivider: boolean;
}

export function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
  showDivider,
}: FaqAccordionItemProps): React.JSX.Element {
  const answerId = React.useId();

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={answerId}
        className="w-full text-left py-6 flex items-center justify-between gap-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
      >
        <h3
          className={`font-marcellus text-2xl transition-colors ${isOpen ? "text-primary-dark" : "text-dark hover:text-primary-dark"
            }`}
        >
          {item.question}
        </h3>
        <HiChevronDown
          aria-hidden="true"
          className={`flex-shrink-0 w-6 h-6 transition-all duration-300 ${isOpen ? "rotate-180 text-primary-dark"
              : "rotate-0 text-light-ash"
            }`}
        />
      </button>

      {/* Answer panel */}
      <div
        id={answerId}
        role="region"
        aria-label={item.question}
        hidden={!isOpen}
        className="pb-6"
      >
        <p
          className="font-sans text-xl leading-8"
          style={{ color: "rgba(1, 30, 0, 0.66)" }}
        >
          {item.answer}
        </p>
      </div>

      {/* Divider between items (not after the last) */}
      {showDivider && (
        <div
          className="w-full h-px"
          style={{ backgroundColor: "rgba(73, 71, 91, 0.36)" }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Faq — full section with label + heading + accordion list
// ---------------------------------------------------------------------------

interface FaqProps {
  /** Short label shown above the heading in accent colour. Defaults to "FAQ" */
  label?: string;
  /** Main section heading */
  heading: string;
  items: FaqItem[];
  className?: string;
}

export function Faq({
  label = "FAQ",
  heading,
  items,
  className = "",
}: FaqProps): React.JSX.Element {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className={`py-12 lg:py-16 ${className}`}>
      <Container className="lg:px-8">
        {/* Section label + heading */}
        <div className="text-center mb-12">
          <p className="font-sans font-medium text-base text-accent mb-3 tracking-wide">
            {label}
          </p>
          <h2 className="font-marcellus text-3xl md:text-4xl text-dark leading-snug">
            {heading}
          </h2>
        </div>

        {/* Accordion list */}
        <div>
          {items.map((item, index) => (
            <FaqAccordionItem
              key={item.question}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
              showDivider={index < items.length - 1}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
