import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import EditPolicyPageForm from "@/features/admin/components/edit-policy-page-form";

export const metadata: Metadata = {
  title: "Customize Terms of Service | Admin Portal | CMHCB",
  description: "Manage page headings, subtitle, and detailed legal terms of the Terms of Service.",
};

export const dynamic = "force-dynamic";

export default async function AdminTermsPage(): Promise<React.JSX.Element> {
  const content = await prisma.policyPageContent.findUnique({
    where: { id: "terms" },
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-marcellus text-3xl font-bold text-dark-green">
          Customize Terms of Service
        </h1>
        <p className="font-sans text-sm text-light-ash">
          Edit the terms of service, medical disclaimers, cancellation details, billing conditions, and liabilities.
        </p>
      </div>

      <EditPolicyPageForm id="terms" initialContent={content} />
    </div>
  );
}
