import * as React from "react";
import { HiChevronDown } from "react-icons/hi2";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export function Select({
  className = "",
  children,
  ...props
}: SelectProps): React.JSX.Element {
  return (
    <div className="relative w-full">
      <select
        className={`w-full pl-4 pr-12 py-3 rounded-xl border border-muted bg-white font-sans text-dark focus:outline-none focus:ring-2 focus:ring-primary-dark/20 focus:border-primary-dark transition-all duration-200 appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-light-ash/50">
        <HiChevronDown className="w-5 h-5" />
      </div>
    </div>
  );
}
