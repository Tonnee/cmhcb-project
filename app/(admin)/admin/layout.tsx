import * as React from "react";
import type { Metadata } from "next";
import AdminSidebar from "@/features/admin/components/admin-sidebar";
import InactivityTimeout from "@/features/admin/components/inactivity-timeout";
import { getRequiredAdminSession } from "./admin-management";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Portal | CMHCB",
  description: "Administrative panel for Center for Mental Health and Care, Bangladesh.",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps): Promise<React.JSX.Element> {
  let adminEmail = "admin@cmhcb.org";

  try {
    const adminProfile = await getRequiredAdminSession();
    adminEmail = adminProfile.email;
  } catch (error: any) {
    console.error("Authentication check failed in admin layout:", error.message);
    
    // Sign out user and redirect to login page
    const supabase = await createClient();
    await supabase.auth.signOut();
    
    if (error.message.includes("blocked")) {
      redirect("/login?error=blocked");
    } else {
      redirect("/login");
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-page-bg">
      {/* Inactivity timeout handler */}
      <InactivityTimeout />

      {/* Admin Sidebar Navigation */}
      <AdminSidebar adminEmail={adminEmail} />

      {/* Main Content Area Wrapper */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
