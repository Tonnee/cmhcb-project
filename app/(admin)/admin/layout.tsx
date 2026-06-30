import * as React from "react";
import type { Metadata } from "next";
import AdminSidebar from "@/features/admin/components/admin-sidebar";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Portal | CMHCB",
  description: "Administrative panel for Center for Mental Health and Care, Bangladesh.",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps): Promise<React.JSX.Element> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = user?.email || "admin@cmhcb.org";

  return (
    <div className="flex min-h-screen w-full bg-page-bg">
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
