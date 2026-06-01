import * as React from "react";
import Link from "next/link";
import { HiArrowSmallRight } from "react-icons/hi2";

export interface LinkButtonProps {
  href?: string;
  children?: React.ReactNode;
  variant?: "primary" | "primary-dark" | "accent" | "text" | "marcellus";
  className?: string;
  label?: string;
}

const VARIANT_STYLES = {
  marcellus: "font-marcellus text-lg text-primary-dark hover:text-accent group-hover:text-accent transition-colors duration-300",
  primary: "font-sans font-semibold text-primary text-sm transition-all hover:text-primary-dark group-hover:text-primary-dark",
  "primary-dark": "font-sans font-semibold text-primary-dark text-sm transition-all hover:text-accent group-hover:text-accent",
  accent: "font-sans font-semibold text-accent text-sm transition-all hover:text-accent/80 group-hover:text-accent/80",
  text: "font-sans text-sm text-light-ash transition-all hover:text-primary group-hover:text-primary",
};

export function LinkButton({
  href,
  children = "Learn More",
  variant = "marcellus",
  className = "",
  label,
}: LinkButtonProps): React.JSX.Element {
  const content = (
    <>
      <span>{children}</span>
      <HiArrowSmallRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
    </>
  );

  const combinedClassName = `inline-flex items-center gap-1.5 ${VARIANT_STYLES[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <span className={combinedClassName}>
      {content}
    </span>
  );
}
