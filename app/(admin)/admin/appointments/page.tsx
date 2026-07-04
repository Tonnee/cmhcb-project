import * as React from "react";
import type { Metadata } from "next";
import { AppointmentsClientWrapper } from "@/features/admin/components/appointments-client-wrapper";

export const metadata: Metadata = {
  title: "Manage Appointments | Admin Portal | CMHCB",
  description: "View and manage client scheduled therapy appointments for Center for Mental Health and Care, Bangladesh.",
};

export default function AdminAppointmentsPage(): React.JSX.Element {
  return (
    <AppointmentsClientWrapper />
  );
}
