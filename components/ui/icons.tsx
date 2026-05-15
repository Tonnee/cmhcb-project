import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function RightArrowIcon({ className = "", ...props }: IconProps): React.JSX.Element {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 12 12"
      width="1em"
      height="1em"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.5 6h7M6.5 2.5l3.5 3.5-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LeftArrowIcon({ className = "", ...props }: IconProps): React.JSX.Element {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 12 12"
      width="1em"
      height="1em"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M9.5 6h-7M5.5 2.5 2 6l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
