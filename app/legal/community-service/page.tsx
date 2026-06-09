import * as React from "react";
import type { Metadata } from "next";
import { CommunityService } from "@/features/legal/components/community-service";

export const metadata: Metadata = {
  title: "Community Service & Outreach | CMHCB",
  description: "Learn about the Center for Mental Health and Care Bangladesh (CMHCB)'s community service outreach programs, pro-bono clinics, and educational initiatives.",
};

export default function CommunityServicePage(): React.JSX.Element {
  return <CommunityService />;
}

