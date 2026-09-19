import * as React from "react";
import Link from "next/link";
import { HiSparkles, HiArrowTopRightOnSquare, HiBookOpen } from "react-icons/hi2";

interface AdminDocsHeaderProps {
  totalCount: number;
  editableCount: number;
  staticCount: number;
}

export default function AdminDocsHeader({
  totalCount,
  editableCount,
  staticCount,
}: AdminDocsHeaderProps): React.JSX.Element {
  return (
    <header className="flex flex-col gap-5 pb-6 border-b border-muted/70">
      {/* Top Tag & External Links */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-dark text-xs font-semibold tracking-wide uppercase font-sans">
          <HiSparkles className="w-3.5 h-3.5 text-accent" />
          <span>Admin Operations Cheatsheet</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-light-ash hover:text-dark transition-colors px-3 py-1.5 rounded-lg border border-muted/80 hover:bg-light/40"
          >
            <span>View Live Website</span>
            <HiArrowTopRightOnSquare className="w-3.5 h-3.5 text-light-ash/80" />
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-dark transition-colors px-3.5 py-1.5 rounded-lg shadow-sm"
          >
            <HiBookOpen className="w-3.5 h-3.5" />
            <span>Admin Overview</span>
          </Link>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="flex flex-col gap-2">
        <h1 className="font-marcellus text-3xl md:text-4xl font-bold text-dark-green tracking-tight">
          Webpage Content Operations Guide
        </h1>
        <p className="font-sans text-sm md:text-base text-light-ash max-w-3xl leading-relaxed">
          Search instructions, image specifications, and visual demonstrations for updating pages in the CMHCB admin dashboard. If a searched section is static, consult the generic code notice.
        </p>
      </div>

      {/* Metric Badges */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-light text-dark text-xs font-sans font-medium border border-muted/60">
          <strong className="text-dark-green font-bold">{totalCount}</strong> Total Guides
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-sans font-medium border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <strong className="font-bold">{editableCount}</strong> Editable in Dashboard
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-sans font-medium border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <strong className="font-bold">{staticCount}</strong> Static (Code-Only)
        </span>
      </div>
    </header>
  );
}
