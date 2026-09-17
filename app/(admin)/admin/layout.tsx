import * as React from "react";
import type { Metadata } from "next";
import AdminLayoutClient from "@/features/admin/components/admin-layout-client";
import { getRequiredAdminSession } from "./admin-management";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin Portal | CMHCB",
  description: "Administrative panel for Center for Mental Health and Care, Bangladesh.",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps): Promise<React.JSX.Element> {
  let adminEmail = "admin@cmhcb.org";
  let initialAppointments = 0;
  let initialTrainingRequests = 0;

  try {
    const [adminProfile, unviewedApts, unviewedTrns] = await Promise.all([
      getRequiredAdminSession(),
      prisma.appointment.count({ where: { isViewed: false } }),
      prisma.trainingRequest.count({ where: { isViewed: false } }),
    ]);
    adminEmail = adminProfile.email;
    initialAppointments = unviewedApts;
    initialTrainingRequests = unviewedTrns;
  } catch (error: any) {
    console.error("Authentication check failed in admin layout:", error.message);
    
    // Sign out user and redirect to login page
    const supabase = await createClient();
    await supabase.auth.signOut();
    
    if (error.message.includes("blocked")) {
      redirect("/login?error=blocked");
    } else {
      redirect(`/login?error=${encodeURIComponent(error.message || "Unauthorized access.")}`);
    }
  }

  return (
    <AdminLayoutClient
      adminEmail={adminEmail}
      initialAppointments={initialAppointments}
      initialTrainingRequests={initialTrainingRequests}
    >
      {children}
    </AdminLayoutClient>
  );
}
