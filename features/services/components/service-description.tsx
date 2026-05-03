import * as React from "react";
import { Container } from "@/components/layout/container";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ServiceDescriptionSection {
  title: string;
  items: string[];
  /**
   * When true, the heading and bullet markers render in the accent colour.
   */
  highlight?: boolean;
}

export interface ServiceDescriptionData {
  introduction: {
    title: string;
    description: string;
  };
  sections: ServiceDescriptionSection[];
}

export interface SessionDetails {
  duration: string;
  fees: string;
  /** Defaults to "In-person / Online (if applicable)" */
  format?: string;
  /** Defaults to "Bangla / English" */
  language?: string;
}

interface ServiceDescriptionProps extends ServiceDescriptionData {
  /**
   * When provided, a highlighted "Session Details" section is automatically
   * appended after the custom sections, populated from the service data.
   */
  sessionDetails?: SessionDetails;
  className?: string;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function Bullet({ highlighted }: { highlighted: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block w-3 h-3 rounded-full flex-shrink-0 mt-[10px] ${
        highlighted ? "bg-accent" : "bg-light-ash/80"
      }`}
    />
  );
}

function Section({ section }: { section: ServiceDescriptionSection }) {
  return (
    <div className="mb-14 last:mb-0">
      <h3
        className={`font-marcellus text-3xl mb-8 ${
          section.highlight ? "text-accent" : "text-dark"
        }`}
      >
        {section.title}
      </h3>
      <ul className="space-y-5">
        {section.items.map((item) => (
          <li key={item} className="flex items-start gap-5">
            <Bullet highlighted={!!section.highlight} />
            <span className="font-sans text-xl leading-8 text-dark">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ServiceDescription({
  introduction,
  sections,
  sessionDetails,
  className = "",
}: ServiceDescriptionProps): React.JSX.Element {
  // Build the auto-generated "Session Details" highlighted section
  const sessionSection: ServiceDescriptionSection | null = sessionDetails
    ? {
        title: "Session Details",
        highlight: true,
        items: [
          `Duration: ${sessionDetails.duration}`,
          `Fee: ${sessionDetails.fees}`,
          `Format: ${sessionDetails.format ?? "In-person / Online (if applicable)"}`,
          `Language: ${sessionDetails.language ?? "Bangla / English"}`,
        ],
      }
    : null;

  const allSections = sessionSection ? [...sections, sessionSection] : sections;

  return (
    <section className={`py-12 lg:py-16 ${className}`}>
      <Container className="lg:px-8">
        {/* Introduction */}
        <div className="mb-14">
          <h2 className="font-marcellus text-3xl text-dark mb-8">
            {introduction.title}
          </h2>
          <p className="font-sans text-xl leading-8 text-dark">
            {introduction.description}
          </p>
        </div>

        {/* Dynamic sections + auto Session Details */}
        {allSections.map((section) => (
          <Section key={section.title} section={section} />
        ))}
      </Container>
    </section>
  );
}
