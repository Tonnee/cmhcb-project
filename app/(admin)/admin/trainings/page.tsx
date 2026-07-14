import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getRequiredAdminSession } from "../admin-management";
import TrainingsClientWrapper from "@/features/admin/components/trainings-client-wrapper";

export const metadata: Metadata = {
  title: "Manage Training Programs | Admin Portal | CMHCB",
  description: "Create, update, and delete training programs for Center for Mental Health and Care, Bangladesh.",
};

export const dynamic = "force-dynamic";

export default async function AdminTrainingsPage(): Promise<React.JSX.Element> {
  // Ensure user is authenticated and not blocked
  await getRequiredAdminSession();

  // Retrieve trainings and info blocks from database
  const [trainings, infoBlocks] = await Promise.all([
    prisma.training.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.trainingInfoBlock.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <TrainingsClientWrapper initialTrainings={trainings} initialInfoBlocks={infoBlocks} />
  );
}
