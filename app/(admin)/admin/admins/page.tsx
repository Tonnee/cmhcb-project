import * as React from "react";
import type { Metadata } from "next";
import { getRequiredAdminSession, getAdminProfilesAction } from "../admin-management";
import AdminsClientWrapper from "@/features/admin/components/admins-client-wrapper";

export const metadata: Metadata = {
  title: "Manage Administrators | Admin Portal | CMHCB",
  description: "View and manage administrator accounts, credentials, and access permissions for Center for Mental Health and Care, Bangladesh.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminManagementPage(): Promise<React.JSX.Element> {
  const currentAdmin = await getRequiredAdminSession();
  
  const res = await getAdminProfilesAction();
  const admins = res.success && res.data ? res.data : [];

  return (
    <AdminsClientWrapper 
      initialAdmins={admins} 
      currentAdmin={currentAdmin} 
    />
  );
}
