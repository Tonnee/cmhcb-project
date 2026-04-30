import * as React from "react";

interface SectionHeadingProps {
  title: string;
  id?: string;
  className?: string;
}

export function SectionHeading({
  title,
  id,
  className = "",
}: SectionHeadingProps): React.JSX.Element {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 id={id} className="font-marcellus text-4xl md:text-5xl text-dark leading-snug">
        {title}
      </h2>
    </div>
  );
}
