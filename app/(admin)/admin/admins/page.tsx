import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getRequiredAdminSession } from "../admin-management";
import AdminsClientWrapper from "@/features/admin/components/admins-client-wrapper";

export const metadata: Metadata = {
  title: "Manage Administrators | Admin Portal | CMHCB",
  description: "View and manage administrator accounts, credentials, and access permissions for Center for Mental Health and Care, Bangladesh.",
};

export const dynamic = "force-dynamic";

export default async function AdminManagementPage(): Promise<React.JSX.Element> {
  const currentAdmin = await getRequiredAdminSession();
  
  const admins = await prisma.adminProfile.findMany({
    orderBy: { email: "asc" },
  });

  return (
    <AdminsClientWrapper 
      initialAdmins={admins} 
      currentAdmin={currentAdmin} 
    />
  );
}
