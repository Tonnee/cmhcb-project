import * as React from "react";
import type { Metadata } from "next";
import { TrainingRequestsClientWrapper } from "@/features/admin/components/training-requests-client-wrapper";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Manage Training Requests | Admin Portal | CMHCB",
  description: "View and manage participant scheduled training registrations for Center for Mental Health and Care, Bangladesh.",
};

export const dynamic = "force-dynamic";

export default async function AdminTrainingRequestsPage(): Promise<React.JSX.Element> {
  const dbRequests = await prisma.trainingRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

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

    return {
      id: req.id,
      clientName: req.name,
      age: req.age.toString(),
      gender: req.gender,
      contact: req.contact,
      trainingName: req.training,
      preference: req.preference as "online" | "in-person",
      message: req.message || undefined,
      status: clientStatus,
      dateTime: `${formattedDate} at ${formattedTime}`,
    };
  });

  return (
    <TrainingRequestsClientWrapper initialRequests={requests} />
  );
}
