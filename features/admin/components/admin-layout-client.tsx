"use client";

import * as React from "react";
import AdminSidebar from "./admin-sidebar";
import InactivityTimeout from "./inactivity-timeout";
import AdminMobileHeader from "./admin-mobile-header";

interface AdminLayoutClientProps {
  adminEmail: string;
  children: React.ReactNode;
}

export default function AdminLayoutClient({
  adminEmail,
  children,
}: AdminLayoutClientProps): React.JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full bg-page-bg relative overflow-hidden">
      {/* Inactivity timeout handler */}
      <InactivityTimeout />

      {/* Admin Sidebar Navigation */}
      <AdminSidebar
        adminEmail={adminEmail}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Mobile Header Bar */}
        <AdminMobileHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
