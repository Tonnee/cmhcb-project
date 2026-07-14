import * as React from "react";
import { type Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { EmergencySupport } from "@/features/support/components/emergency-support";
import { getRequiredAdminSession } from "@/app/(admin)/admin/admin-management";
import { Container } from "@/components/layout/container";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Support & Emergency Contacts | CMHCB",
  description: "Get immediate help and support for mental health crises. Reach out to our emergency contacts or trained professionals for assistance.",
};

export const dynamic = "force-dynamic";

export default async function SupportPage(): Promise<React.JSX.Element> {
  let isAdmin = false;
  try {
    await getRequiredAdminSession();
    isAdmin = true;
  } catch {
    isAdmin = false;
  }

  const dbContent = await prisma.supportPageContent.findFirst();

  const title = dbContent?.heroTitle || "We are here to support you in times of need";
  const description = dbContent?.heroDescription || "Whether you are facing a mental health crisis or seeking guidance for a loved one, CMHCB is here to help. Reach out to our emergency contacts or trained professionals for immediate assistance.";
  const imageSrc = dbContent?.heroImage || "/hero-image/group-therapy-support-circle.png";

  return (
    <main>
      {isAdmin && (
        <div className="bg-primary/10 border-b border-primary/20 py-3 text-center text-sm">
          <Container className="flex items-center justify-between">
            <span className="font-medium text-primary-dark font-sans">
              You are logged in as an Administrator.
            </span>
            <a
              href="/admin/pages/support"
              className="px-4 py-1.5 bg-primary-dark hover:bg-primary-dark/90 text-white rounded-lg font-semibold transition-all text-xs font-sans"
            >
              Edit Support Page Content
            </a>
          </Container>
        </div>
      )}
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
        ]}
        currentPage="Support"
        title={title}
        description={description}
        imageSrc={imageSrc}
        imageAlt="Supportive atmosphere at CMHCB"
        ctaLabel="Emergency Contacts"
        ctaHref="#emergency-contacts"
      />
      
      <div id="emergency-contacts">
        <EmergencySupport
          initialContacts={dbContent?.contacts}
          initialAdvisoryText={dbContent?.advisoryText}
        />
      </div>
    </main>
  );
}

