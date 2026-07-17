import * as React from "react";
import type { Metadata } from "next";
import { AppointmentsClientWrapper } from "@/features/admin/components/appointments-client-wrapper";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Manage Appointments | Admin Portal | CMHCB",
  description: "View and manage client scheduled therapy appointments for Center for Mental Health and Care, Bangladesh.",
};

export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage(): Promise<React.JSX.Element> {
  const dbAppointments = await prisma.appointment.findMany({
    orderBy: { createdAt: "desc" },
  });

  const appointments = dbAppointments.map((apt) => {
    let clientStatus: "scheduled" | "completed" | "cancelled" = "scheduled";
    if (apt.status === "COMPLETED") {
      clientStatus = "completed";
    } else if (apt.status === "CANCELLED") {
      clientStatus = "cancelled";
    }

    const formattedDate = new Date(apt.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const formattedSubmittedTime = new Date(apt.createdAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      id: apt.id,
      clientName: apt.name,
      therapistName: apt.therapist,
      dateTime: `${apt.date} at ${apt.time} (${apt.preference})`,
      submittedAt: `${formattedDate} at ${formattedSubmittedTime}`,
      sessionType: apt.service,
      status: clientStatus,
      amount: "BDT 2,500",
    };
  });

  return (
    <AppointmentsClientWrapper initialAppointments={appointments} />
  );
}
