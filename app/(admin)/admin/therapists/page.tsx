import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import TherapistsClientWrapper from "@/features/admin/components/therapists-client-wrapper";

export const metadata: Metadata = {
  title: "Manage Therapists | Admin Portal | CMHCB",
  description: "Therapists directory and CRUD management interface for Center for Mental Health and Care, Bangladesh.",
};

// Force dynamic rendering since we are doing dynamic database reads
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminTherapistsPage(): Promise<React.JSX.Element> {
  let therapists: any[] = [];
  let pageContent: any = null;

  try {
    const [dbTherapists, dbPageContent] = await Promise.all([
      prisma.therapist.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }).catch(async () => {
        return prisma.therapist.findMany({
          orderBy: { createdAt: "desc" },
        }).catch(() => []);
      }),
      prisma.therapistsPageContent.findFirst().catch(() => null),
    ]);
    therapists = dbTherapists;
    pageContent = dbPageContent;
  } catch {
    therapists = [];
  }

  return (
    <TherapistsClientWrapper
      initialTherapists={therapists}
      initialPageContent={pageContent}
    />
  );
}
