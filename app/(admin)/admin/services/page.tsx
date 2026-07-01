import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { ServicesClientWrapper } from "@/features/admin/components/services-client-wrapper";

export const metadata: Metadata = {
  title: "Services Management | Admin Portal | CMHCB",
  description: "Manage clinical and psychotherapeutic services directory records.",
};

export const dynamic = "force-dynamic";

export default async function AdminServicesPage(): Promise<React.JSX.Element> {
  // Fetch services dynamically on server
  const [services, infoBlocks] = await Promise.all([
    prisma.service.findMany({
      orderBy: { title: "asc" },
    }),
    prisma.serviceInfoBlock.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <ServicesClientWrapper initialServices={services} initialInfoBlocks={infoBlocks} />
    </div>
  );
}
