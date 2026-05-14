import * as React from "react";

interface SectionHeadingProps {
  title: React.ReactNode;
  subtitle?: string;
  id?: string;
  className?: string;
  align?: "center" | "left";
}

export function SectionHeading({
  title,
  subtitle,
  id,
  className = "",
  align = "center",
}: SectionHeadingProps): React.JSX.Element {
  const alignmentClass = align === "center" ? "text-center" : "text-left";
  
  return (
    <div className={`${alignmentClass} mb-12 ${className}`}>
      {subtitle && (
        <p className="font-sans font-medium text-base text-accent mb-3 tracking-wide uppercase">
          {subtitle}
        </p>
      )}
      <h2 id={id} className="font-marcellus text-4xl md:text-5xl text-dark leading-snug">
        {title}
      </h2>
    </div>
  );
}
