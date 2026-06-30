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

export default async function AdminTherapistsPage(): Promise<React.JSX.Element> {
  // Fetch list of therapists from Prisma
  const therapists = await prisma.therapist.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <TherapistsClientWrapper initialTherapists={therapists} />
  );
}
