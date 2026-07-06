import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import EditPolicyPageForm from "@/features/admin/components/edit-policy-page-form";

export const metadata: Metadata = {
  title: "Customize Privacy Policy | Admin Portal | CMHCB",
  description: "Manage page headings, subtitle, and detailed legal terms of the Privacy Policy.",
};

export const dynamic = "force-dynamic";

export default async function AdminPrivacyPolicyPage(): Promise<React.JSX.Element> {
  const content = await prisma.policyPageContent.findUnique({
    where: { id: "privacy-policy" },
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-marcellus text-3xl font-bold text-dark-green">
          Customize Privacy Policy
        </h1>
        <p className="font-sans text-sm text-light-ash">
          Edit the legal clauses, confidentiality terms, data usage policies, and last-updated indicators.
        </p>
      </div>

      <EditPolicyPageForm id="privacy-policy" initialContent={content} />
    </div>
  );
}
