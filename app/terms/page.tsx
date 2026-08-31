import * as React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SimplePageHeader } from "@/components/shared/simple-page-header";
import { getRequiredAdminSession } from "@/app/(admin)/admin/admin-management";
import { sanitizeHtml } from "@/lib/sanitize";
import prisma from "@/lib/prisma";
import { formatContentToHtml } from "@/lib/text";

export const metadata: Metadata = {
  title: "Terms of Service | CMHCB",
  description: "Terms and conditions for using the services provided by CMHCB.",
};

import { DEFAULT_TERMS_CONTENT } from "@/features/legal/data/policy-defaults";

export const revalidate = 60;

export default async function TermsOfServicePage(): Promise<React.JSX.Element> {
  let isAdmin = false;
  try {
    await getRequiredAdminSession();
    isAdmin = true;
  } catch {
    isAdmin = false;
  }

  const dbContent = await prisma.policyPageContent.findUnique({
    where: { id: "terms" },
  }).catch(() => null);

  const title = dbContent?.title || "Terms of Service";
  const subtitle = dbContent?.subtitle || "Last Updated: May 2026";
  const htmlContent = dbContent?.content || DEFAULT_TERMS_CONTENT;

  return (
    <main>
      {isAdmin && (
        <div className="bg-primary/10 border-b border-primary/20 py-3 text-center text-sm">
          <Container className="flex items-center justify-between">
            <span className="font-medium text-primary-dark font-sans">
              You are logged in as an Administrator.
            </span>
            <a
              href="/admin/pages/terms"
              className="px-4 py-1.5 bg-primary-dark hover:bg-primary-dark/90 text-white rounded-lg font-semibold transition-all text-xs font-sans"
            >
              Edit Page Content
            </a>
          </Container>
        </div>
      )}
      {/* Simple Header without Image */}
      <SimplePageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms of Service", href: "/terms" }
        ]}
        title={title}
        subtitle={subtitle}
      />

      {/* Content Section */}
      <section className="pt-10 pb-20">
        <Container>
          <div
            className="max-w-4xl font-sans text-base leading-relaxed text-dark space-y-8"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(formatContentToHtml(htmlContent)) }}
          />
        </Container>
      </section>
    </main>
  );
}
