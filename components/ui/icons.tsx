import * as React from "react";
import { HiArrowSmallRight, HiArrowSmallLeft } from "react-icons/hi2";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function RightArrowIcon({ className = "", ...props }: IconProps): React.JSX.Element {
  return <HiArrowSmallRight className={className} aria-hidden="true" {...props} />;
}

export function LeftArrowIcon({ className = "", ...props }: IconProps): React.JSX.Element {
  return <HiArrowSmallLeft className={className} aria-hidden="true" {...props} />;
}
