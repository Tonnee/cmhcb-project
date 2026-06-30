import * as React from "react";
import type { Metadata } from "next";
import {
  HiBookOpen,
  HiUsers,
  HiAcademicCap,
  HiCheckCircle,
} from "react-icons/hi2";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard Overview | Admin Portal | CMHCB",
  description: "Overview statistics and system activity logs for Center for Mental Health and Care, Bangladesh.",
};

export const dynamic = "force-dynamic";

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "primary" | "secondary" | "accent";
}

function StatCard({ title, value, trend, icon: Icon, color }: StatCardProps): React.JSX.Element {
  const colorMap = {
    primary: "border-primary text-primary bg-primary/5",
    secondary: "border-secondary text-secondary bg-secondary/5",
    accent: "border-accent text-accent bg-accent/5",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-muted shadow-sm flex items-center justify-between gap-4">
      <div className="flex flex-col gap-2">
        <span className="font-sans text-sm text-light-ash font-medium">{title}</span>
        <span className="font-marcellus text-3xl font-bold text-dark">{value}</span>
        <span className="font-sans text-xs text-primary-dark font-medium">{trend}</span>
      </div>
      <div className={`p-4 rounded-xl border ${colorMap[color]}`}>
        <Icon className="w-8 h-8" />
      </div>
    </div>
  );
}

export default async function AdminDashboardPage(): Promise<React.JSX.Element> {
  // Query dynamic database counts
  const [therapistCount, workshopCount, blogCount] = await Promise.all([
    prisma.therapist.count(),
    prisma.workshop.count(),
    prisma.blogPost.count(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-marcellus text-3xl font-bold text-dark-green">
          Dashboard Overview
        </h1>
        <p className="font-sans text-sm text-light-ash">
          Welcome back! Here is an overview of active records and system logs.
        </p>
      </div>

      {/* Dynamic database stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Therapists"
          value={String(therapistCount)}
          trend="Qualified mental health practitioners"
          icon={HiUsers}
          color="primary"
        />
        <StatCard
          title="Scheduled Workshops"
          value={String(workshopCount)}
          trend="Awareness and training events"
          icon={HiAcademicCap}
          color="accent"
        />
        <StatCard
          title="Published Articles"
          value={String(blogCount)}
          trend="Insights and news updates"
          icon={HiBookOpen}
          color="secondary"
        />
      </div>

      {/* Recent Activity Section */}
      <section className="bg-white p-6 rounded-2xl border border-muted shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-marcellus text-xl font-bold text-dark">
            Recent System Activity
          </h2>
          <p className="font-sans text-xs text-light-ash">
            Latest operational events and updates across the platform.
          </p>
        </div>

        <div className="flex flex-col gap-4 font-sans text-sm">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-light/10 border border-muted/50">
            <HiCheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-medium text-dark">New registration in "Anger Management Workshop"</span>
              <span className="text-xs text-light-ash">10 minutes ago · Client: Farhana R.</span>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-light/10 border border-muted/50">
            <HiCheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-medium text-dark">Appointment rescheduled</span>
              <span className="text-xs text-light-ash">1 hour ago · Dr. Sabrina Ahmed with Mashfiq U.</span>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-light/10 border border-muted/50">
            <HiCheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-medium text-dark">New Therapist application received</span>
              <span className="text-xs text-light-ash">3 hours ago · Applicant: Dr. Tanveer Alam</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
