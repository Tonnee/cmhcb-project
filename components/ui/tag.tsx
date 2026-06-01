import * as React from "react";

export type TagVariant = "primary" | "outline" | "glass" | "glass-light";

interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  className?: string;
}

const VARIANT_CLASSES = {
  primary: "bg-primary/10 text-primary border border-transparent px-3 py-1 font-medium",
  outline: "bg-white border border-primary/30 text-primary px-3 py-1 font-medium",
  glass: "bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-1.5 font-medium tracking-wide",
  "glass-light": "bg-white/90 backdrop-blur-sm text-dark border border-transparent px-4 py-1.5 font-semibold shadow-sm",
};

export function Tag({
  children,
  variant = "primary",
  className = "",
}: TagProps): React.JSX.Element {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-sans text-xs transition-colors ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
