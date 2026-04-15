import * as React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
  href?: string;
}

export function Button({
  className = "",
  variant = "primary",
  href,
  children,
  ...props
}: ButtonProps): React.JSX.Element {
  const baseStyles =
    "inline-flex items-center justify-center font-marcellus h-11 px-6 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none rounded-full";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 shadow-sm",
    secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-sm",
    accent: "bg-accent text-white hover:bg-accent/90 shadow-sm",
    outline: "border border-primary text-primary hover:bg-primary/10",
    ghost: "hover:bg-light text-dark",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
