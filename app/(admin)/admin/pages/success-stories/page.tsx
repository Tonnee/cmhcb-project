import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { SuccessStoriesClientWrapper } from "@/features/admin/components/success-stories-client-wrapper";

export const metadata: Metadata = {
  title: "Success Stories Management | Admin Portal | CMHCB",
  description: "Manage client testimonials, success stories, and home page feature flags.",
};

export const dynamic = "force-dynamic";

export default async function AdminSuccessStoriesPage(): Promise<React.JSX.Element> {
  const stories = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8">
      <SuccessStoriesClientWrapper initialStories={stories} />
    </div>
  );
}
