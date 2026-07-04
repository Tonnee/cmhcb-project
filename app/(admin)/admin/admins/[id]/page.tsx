import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getRequiredAdminSession } from "../../admin-management";
import { 
  HiArrowLeft, 
  HiClock, 
  HiShieldCheck, 
  HiPlus, 
  HiPencilSquare, 
  HiTrash, 
  HiLockClosed, 
  HiLockOpen,
  HiUser
} from "react-icons/hi2";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const admin = await prisma.adminProfile.findUnique({
    where: { id },
  });

  return {
    title: `${admin ? admin.name : "Admin Details"} | Admin Portal | CMHCB`,
    description: "Detailed administrator profile page and change logs timeline.",
  };
}

export default async function AdminProfileDetailPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  // Ensure logged-in admin is verified and not blocked
  await getRequiredAdminSession();

  const { id } = await params;

  // Fetch target admin details
  const admin = await prisma.adminProfile.findUnique({
    where: { id },
  });

  if (!admin) {
    notFound();
  }

  // Fetch chronological activity logs
  const logs = await prisma.activityLog.findMany({
    where: { adminId: id },
    orderBy: { createdAt: "desc" },
  });

  const initial = admin.name.charAt(0).toUpperCase();

  // Helper to resolve action icons and colors
  const getActionStyles = (action: string) => {
    switch (action) {
      case "CREATE":
      case "CREATE_ADMIN":
        return {
          icon: HiPlus,
          bgClass: "bg-green-50 text-green-600 border-green-200",
          badgeText: "Created",
        };
      case "DELETE":
        return {
          icon: HiTrash,
          bgClass: "bg-red-50 text-red-600 border-red-200",
          badgeText: "Deleted",
        };
      case "BLOCK":
        return {
          icon: HiLockClosed,
          bgClass: "bg-red-50 text-red-700 border-red-200",
          badgeText: "Blocked User",
        };
      case "UNBLOCK":
        return {
          icon: HiLockOpen,
          bgClass: "bg-green-50 text-green-700 border-green-200",
          badgeText: "Unblocked User",
        };
      case "UPDATE":
      case "UPDATE_CREDENTIALS":
      default:
        return {
          icon: HiPencilSquare,
          bgClass: "bg-amber-50 text-amber-600 border-amber-200",
          badgeText: "Updated",
        };
    }
  };

  return (
    <div className="flex flex-col gap-8 font-sans max-w-5xl mx-auto">
      {/* Back navigation header */}
      <div className="flex items-center">
        <Link
          href="/admin/admins"
          className="inline-flex items-center gap-2 text-sm text-light-ash hover:text-dark transition-colors font-semibold"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </div>

      {/* Admin Information Card */}
      <div className="bg-white border border-muted/50 rounded-2xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary-dark font-bold font-marcellus text-3xl flex items-center justify-center shrink-0 border border-primary/20">
            {initial}
          </div>
          <div className="flex flex-col">
            <h1 className="font-marcellus text-2xl font-bold text-dark-green leading-tight">
              {admin.name}
            </h1>
            <p className="text-light-ash text-sm">{admin.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {admin.role === "super_admin" ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  <HiShieldCheck className="w-3.5 h-3.5" />
                  Super Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-dark bg-primary/5 border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Admin
                </span>
              )}

              {admin.isBlocked ? (
                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Blocked
                </span>
              ) : (
                <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Active
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:text-right text-xs text-light-ash gap-1 border-t md:border-t-0 border-muted pt-4 md:pt-0">
          <span>Joined: {admin.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span>Last Active Session: {admin.updatedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </div>

      {/* Activity Timeline Section */}
      <div className="flex flex-col gap-4">
        <h2 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2">
          <HiClock className="w-5 h-5 text-primary" />
          Administrative Activity Timeline
        </h2>

        <div className="bg-white border border-muted/50 rounded-2xl shadow-sm p-6 md:p-8">
          {logs.length > 0 ? (
            <div className="relative border-l-2 border-muted/50 pl-6 md:pl-8 ml-3 space-y-8 py-2">
              {logs.map((log) => {
                const styles = getActionStyles(log.action);
                const ActionIcon = styles.icon;
                
                return (
                  <div key={log.id} className="relative">
                    {/* Timeline circle icon */}
                    <div className={`absolute -left-[45px] md:-left-[53px] top-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 shadow-sm ${styles.bgClass}`}>
                      <ActionIcon className="w-4 h-4" />
                    </div>

                    {/* Timeline content details */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="font-semibold text-dark text-base">
                          {log.action === "CREATE_ADMIN" ? "Created administrator profile" : `${log.action.charAt(0) + log.action.slice(1).toLowerCase()} dynamic option`}
                        </span>
                        <span className="text-xs text-light-ash font-medium">
                          {new Date(log.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                      </div>
                      
                      {/* Log brief summary */}
                      <p className="text-sm text-light-ash">
                        {log.details || `Performed ${log.action.toLowerCase()} on ${log.targetType}: ${log.targetName}`}
                      </p>

                      {/* Targeted element details label */}
                      <div className="flex items-center gap-2 text-xs text-light-ash/70 bg-light/10 border border-muted/30 px-3 py-1.5 rounded-lg w-fit mt-1">
                        <span className="font-semibold text-dark">{log.targetType}</span>
                        <span className="text-muted font-light">|</span>
                        <span className="truncate max-w-[200px]" title={log.targetName}>Target: {log.targetName}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center justify-center gap-2 text-light-ash">
              <HiUser className="w-12 h-12 text-light-ash/40" />
              <p className="font-medium text-sm">No activity recorded for this administrator yet.</p>
              <p className="text-xs max-w-xs">Actions like updating services, blogs, therapists, workshops, or admin details will compile here as an audit trail.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
