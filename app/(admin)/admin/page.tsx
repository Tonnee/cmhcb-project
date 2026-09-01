import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  HiBookOpen,
  HiUsers,
  HiAcademicCap,
  HiBookmark,
  HiBriefcase,
  HiDocumentText,
  HiCheckCircle,
  HiClock,
} from "react-icons/hi2";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard Overview | Admin Portal | CMHCB",
  description: "Overview statistics and system activity logs for Center for Mental Health and Care, Bangladesh.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "primary" | "secondary" | "accent";
}

function StatCard({ title, value, trend, href, icon: Icon, color }: StatCardProps): React.JSX.Element {
  const colorMap = {
    primary: "border-primary text-primary bg-primary/5 group-hover:bg-primary group-hover:text-white",
    secondary: "border-secondary text-secondary bg-secondary/5 group-hover:bg-secondary group-hover:text-white",
    accent: "border-accent text-accent bg-accent/5 group-hover:bg-accent group-hover:text-dark-green",
  };

  return (
    <Link
      href={href}
      className="group bg-white p-6 rounded-2xl border border-muted shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
    >
      <div className="flex flex-col gap-2">
        <span className="font-sans text-sm text-light-ash font-medium group-hover:text-dark transition-colors">
          {title}
        </span>
        <span className="font-marcellus text-3xl font-bold text-dark">{value}</span>
        <span className="font-sans text-xs text-primary-dark font-medium">{trend}</span>
      </div>
      <div className={`p-4 rounded-xl border transition-colors duration-200 ${colorMap[color]}`}>
        <Icon className="w-7 h-7" />
      </div>
    </Link>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

export default async function AdminDashboardPage(): Promise<React.JSX.Element> {
  // Query dynamic database counts and live audit activity
  const [
    trainingCount,
    serviceCount,
    therapistCount,
    workshopCount,
    blogCount,
    requestCount,
    recentActivities,
  ] = await Promise.all([
    prisma.training.count(),
    prisma.service.count(),
    prisma.therapist.count(),
    prisma.workshop.count(),
    prisma.blogPost.count(),
    prisma.trainingRequest.count(),
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-marcellus text-3xl font-bold text-dark-green">
          Dashboard Overview
        </h1>
        <p className="font-sans text-sm text-light-ash">
          Welcome back! Manage training programs, clinical services, clinician registers, and platform logs.
        </p>
      </div>

      {/* Dynamic database stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Training Programs"
          value={String(trainingCount)}
          trend="Professional development & courses"
          href="/admin/trainings"
          icon={HiBookmark}
          color="primary"
        />
        <StatCard
          title="Psychotherapeutic Services"
          value={String(serviceCount)}
          trend="Clinical care and offerings"
          href="/admin/services"
          icon={HiBriefcase}
          color="accent"
        />
        <StatCard
          title="Active Therapists"
          value={String(therapistCount)}
          trend="Qualified mental health clinicians"
          href="/admin/therapists"
          icon={HiUsers}
          color="secondary"
        />
        <StatCard
          title="Scheduled Workshops"
          value={String(workshopCount)}
          trend="Awareness events & intensives"
          href="/admin/events-workshops"
          icon={HiAcademicCap}
          color="accent"
        />
        <StatCard
          title="Published Articles"
          value={String(blogCount)}
          trend="Insights & mental health blogs"
          href="/admin/blogs"
          icon={HiBookOpen}
          color="primary"
        />
        <StatCard
          title="Training Applications"
          value={String(requestCount)}
          trend="Candidate enrolment inquiries"
          href="/admin/training-requests"
          icon={HiDocumentText}
          color="secondary"
        />
      </div>

      {/* Recent Activity Section */}
      <section className="bg-white p-6 rounded-2xl border border-muted shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="font-marcellus text-xl font-bold text-dark">
              Recent System Activity
            </h2>
            <p className="font-sans text-xs text-light-ash">
              Live audit events and administrative updates across the platform.
            </p>
          </div>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            Live Audit Stream
          </span>
        </div>

        <div className="flex flex-col gap-3 font-sans text-sm">
          {recentActivities.length > 0 ? (
            recentActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-start justify-between gap-4 p-4 rounded-xl bg-light/10 border border-muted/50 hover:bg-light/20 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <HiCheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-medium text-dark truncate">
                      {act.details || `${act.action} ${act.targetType}: ${act.targetName || act.targetId}`}
                    </span>
                    <span className="text-xs text-light-ash">
                      By <span className="font-semibold text-primary-dark">{act.adminName || act.adminEmail}</span> ({act.adminEmail})
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-light-ash/80 shrink-0 font-medium flex items-center gap-1">
                  <HiClock className="w-3.5 h-3.5" />
                  {formatTimeAgo(act.createdAt)}
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-light-ash border border-dashed border-muted rounded-xl">
              No recent activity records logged yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
