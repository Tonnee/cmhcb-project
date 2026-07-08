import * as React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { CommunityService } from "@/features/legal/components/community-service";
import { getRequiredAdminSession } from "@/app/(admin)/admin/admin-management";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Community Service & Outreach | CMHCB",
  description: "Learn about the Center for Mental Health and Care Bangladesh (CMHCB)'s community service outreach programs, pro-bono clinics, and educational initiatives.",
};

export const dynamic = "force-dynamic";

export default async function CommunityServicePage(): Promise<React.JSX.Element> {
  let isAdmin = false;
  try {
    await getRequiredAdminSession();
    isAdmin = true;
  } catch {
    isAdmin = false;
  }

  const dbContent = await prisma.communityServicePageContent.findFirst();

  return (
    <main>
      {isAdmin && (
        <div className="bg-primary/10 border-b border-primary/20 py-3 text-center text-sm">
          <Container className="flex items-center justify-between">
            <span className="font-medium text-primary-dark font-sans">
              You are logged in as an Administrator.
            </span>
            <a
              href="/admin/pages/community-service"
              className="px-4 py-1.5 bg-primary-dark hover:bg-primary-dark/90 text-white rounded-lg font-semibold transition-all text-xs font-sans"
            >
              Edit Page Content
            </a>
          </Container>
        </div>
      )}
      <CommunityService data={dbContent || undefined} />
    </main>
  );
}

