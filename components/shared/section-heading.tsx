import * as React from "react";

interface SectionHeadingProps {
  title: React.ReactNode;
  subtitle?: string;
  id?: string;
  className?: string;
  align?: "center" | "left";
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "sm" | "md" | "lg" | "xl";
}

export function SectionHeading({
  title,
  subtitle,
  id,
  className = "",
  align = "center",
  level = "h2",
  size = "lg",
}: SectionHeadingProps): React.JSX.Element {
  const alignmentClass = align === "center" ? "text-center" : "text-left";
  
  const sizeClasses = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
    xl: "text-5xl md:text-6xl lg:text-7xl",
  };

  const Tag = level as keyof React.JSX.IntrinsicElements;
  
  return (
    <div className={`${alignmentClass} mb-12 ${className}`}>
      {subtitle && (
        <p className="font-sans font-medium text-base text-accent mb-3 tracking-wide uppercase">
          {subtitle}
        </p>
      )}
      <Tag 
        id={id} 
        className={`font-marcellus ${sizeClasses[size]} text-dark leading-snug`}
      >
        {title}
      </Tag>
    </div>
  );
}
