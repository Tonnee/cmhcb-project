import * as React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

export function Container({
  children,
  className = "",
  as: Component = "div",
  ...props
}: ContainerProps): React.JSX.Element {
  return (
    <Component className={`container ${className}`} {...props}>
      {children}
    </Component>
  );
}
