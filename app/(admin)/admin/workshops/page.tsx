import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import WorkshopsClientWrapper from "@/features/admin/components/workshops-client-wrapper";

export const metadata: Metadata = {
  title: "Manage Workshops | Admin Portal | CMHCB",
  description: "Manage workshop events, registration forms, and client sign-ups for Center for Mental Health and Care, Bangladesh.",
};

export const dynamic = "force-dynamic";

export default async function AdminWorkshopsPage(): Promise<React.JSX.Element> {
  // Fetch workshops from database
  const workshops = await prisma.workshop.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <WorkshopsClientWrapper initialWorkshops={workshops} />
  );
}
