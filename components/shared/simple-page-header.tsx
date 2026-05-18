import * as React from "react";
import { Container } from "@/components/layout/container";
import { Breadcrumb, type BreadcrumbItem } from "@/components/shared/breadcrumb";

export interface SimplePageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SimplePageHeader({
  breadcrumbs,
  title,
  subtitle,
  description,
  className = "bg-page-bg pt-16",
  children,
}: SimplePageHeaderProps): React.JSX.Element {
  return (
    <div className={className}>
      <Container>
        <Breadcrumb items={breadcrumbs} className="mb-8" />
        <h1 className="font-marcellus text-4xl md:text-[48px] text-dark mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="font-sans text-light-ash text-lg mb-4">{subtitle}</p>
        )}
        {description && (
          <p className="font-sans text-lg text-dark max-w-3xl leading-relaxed mb-8">
            {description}
          </p>
        )}
        {children}
      </Container>
    </div>
  );
}
