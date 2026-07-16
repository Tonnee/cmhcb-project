import * as React from "react";
import type { Metadata } from "next";
import { TrainingRequestsClientWrapper } from "@/features/admin/components/training-requests-client-wrapper";

export const metadata: Metadata = {
  title: "Manage Training Requests | Admin Portal | CMHCB",
  description: "View and manage participant scheduled training registrations for Center for Mental Health and Care, Bangladesh.",
};

export default function AdminTrainingRequestsPage(): React.JSX.Element {
  return (
    <TrainingRequestsClientWrapper />
  );
}
