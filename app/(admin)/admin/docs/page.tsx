import * as React from "react";
import type { Metadata } from "next";
import { ADMIN_DOCS_ITEMS } from "@/data/admin-docs";
import AdminDocsHeader from "@/features/admin-docs/components/admin-docs-header";
import AdminDocsSearchClient from "@/features/admin-docs/components/admin-docs-search-client";

export const metadata: Metadata = {
  title: "Webpage Content Operations Cheatsheet | Admin Portal | CMHCB",
  description:
    "Comprehensive cheatsheet and visual walkthrough for administrators to manage, edit, and publish webpage content across the CMHCB website.",
};

export default function AdminDocsPage(): React.JSX.Element {
  const totalCount = ADMIN_DOCS_ITEMS.length;
  const editableCount = ADMIN_DOCS_ITEMS.filter((item) => item.isEditable).length;
  const staticCount = ADMIN_DOCS_ITEMS.filter((item) => !item.isEditable).length;

  return (
    <div className="flex flex-col gap-8 pb-16">
      <AdminDocsHeader
        totalCount={totalCount}
        editableCount={editableCount}
        staticCount={staticCount}
      />
      <AdminDocsSearchClient items={ADMIN_DOCS_ITEMS} />
    </div>
  );
}
