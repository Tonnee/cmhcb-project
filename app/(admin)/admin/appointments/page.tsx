import * as React from "react";
import type { Metadata } from "next";
import { AppointmentsClientWrapper } from "@/features/admin/components/appointments-client-wrapper";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Manage Appointments | Admin Portal | CMHCB",
  description: "View and manage client scheduled therapy appointments for Center for Mental Health and Care, Bangladesh.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminAppointmentsPage(): Promise<React.JSX.Element> {
  const [dbAppointments, dbPageContent, dbServices] = await Promise.all([
    prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
    }),
    (prisma as any).appointmentPageContent.findFirst().catch(() => null),
    prisma.service.findMany({ select: { title: true, slug: true, fees: true } }).catch(() => []),
  ]);

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

    const matchedService = dbServices.find(
      (s) =>
        s.title.toLowerCase() === apt.service.toLowerCase() ||
        s.slug.toLowerCase() === apt.service.toLowerCase()
    );
    const feeDisplay = matchedService?.fees || "BDT 2,500";

    return {
      id: apt.id,
      clientName: apt.name,
      age: apt.age,
      gender: apt.gender,
      contact: apt.contact,
      therapistName: apt.therapist,
      date: apt.date,
      time: apt.time,
      preference: apt.preference,
      dateTime: `${apt.date} at ${apt.time} (${apt.preference})`,
      submittedAt: `${formattedDate} at ${formattedSubmittedTime}`,
      sessionType: apt.service,
      status: clientStatus,
      amount: feeDisplay,
      isViewed: apt.isViewed,
      message: apt.message,
      customFields: apt.customFields,
    };
  });

  return (
    <AppointmentsClientWrapper
      initialAppointments={appointments}
      initialPageContent={dbPageContent}
    />
  );
}
