import * as React from "react";
import type { Metadata } from "next";
import { TrainingRequestsClientWrapper } from "@/features/admin/components/training-requests-client-wrapper";
import prisma from "@/lib/prisma";
import { TRAININGS } from "@/features/training/data/trainings";

export const metadata: Metadata = {
  title: "Manage Training Requests | Admin Portal | CMHCB",
  description: "View and manage participant scheduled training registrations for Center for Mental Health and Care, Bangladesh.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminTrainingRequestsPage(): Promise<React.JSX.Element> {
  const [dbRequests, joinTrainingPageContent, dbTrainings] = await Promise.all([
    prisma.trainingRequest.findMany({
      orderBy: { createdAt: "desc" },
    }),
    (prisma as any).joinTrainingPageContent.findFirst().catch(() => null),
    prisma.training.findMany({
      select: { title: true, slug: true, duration: true, fees: true, format: true },
    }).catch(() => []),
  ]);

  const requests = dbRequests.map((req) => {
    let clientStatus: "pending" | "approved" | "rejected" = "pending";
    if (req.status === "APPROVED") {
      clientStatus = "approved";
    } else if (req.status === "REJECTED" || req.status === "CANCELLED") {
      clientStatus = "rejected";
    }

    const formattedDate = new Date(req.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const formattedTime = new Date(req.createdAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const matchedDbTraining = dbTrainings.find(
      (t) =>
        t.title.toLowerCase() === req.training.toLowerCase() ||
        t.slug.toLowerCase() === req.training.toLowerCase()
    );

    const matchedStaticTraining = TRAININGS.find(
      (t) =>
        t.title.toLowerCase() === req.training.toLowerCase() ||
        t.slug.toLowerCase() === req.training.toLowerCase()
    );

    return {
      id: req.id,
      clientName: req.name,
      age: req.age.toString(),
      gender: req.gender,
      contact: req.contact,
      trainingName: matchedDbTraining?.title || matchedStaticTraining?.title || req.training,
      trainingSlug: matchedDbTraining?.slug || matchedStaticTraining?.slug || req.training,
      trainingFee: matchedDbTraining?.fees || matchedStaticTraining?.fees || undefined,
      trainingDuration: matchedDbTraining?.duration || matchedStaticTraining?.duration || undefined,
      trainingFormat: matchedDbTraining?.format || undefined,
      preference: req.preference as "online" | "in-person",
      message: req.message || undefined,
      status: clientStatus,
      dateTime: `${formattedDate} at ${formattedTime}`,
      submittedAt: `${formattedDate} at ${formattedTime}`,
      isViewed: req.isViewed,
      customFields: req.customFields,
    };
  });

  return (
    <TrainingRequestsClientWrapper
      initialRequests={requests}
      initialPageContent={joinTrainingPageContent}
    />
  );
}
