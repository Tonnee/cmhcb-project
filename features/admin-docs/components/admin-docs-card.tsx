import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiArrowTopRightOnSquare,
  HiPhoto,
  HiListBullet,
  HiLightBulb,
  HiCodeBracket,
} from "react-icons/hi2";
import type { AdminDocItem } from "@/types/admin-docs";

interface AdminDocsCardProps {
  item: AdminDocItem;
}

export default function AdminDocsCard({ item }: AdminDocsCardProps): React.JSX.Element {
  return (
    <article
      id={item.id}
      className={`rounded-2xl border bg-white shadow-sm transition-all duration-200 overflow-hidden flex flex-col ${
        item.isEditable ? "border-muted/80 hover:border-primary/40" : "border-amber-200 bg-amber-50/20"
      }`}
    >
      {/* Card Header Bar */}
      <div className="p-5 md:p-6 border-b border-muted/60 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-light/10">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-muted/60 text-dark font-sans">
              {item.category}
            </span>
            {item.isEditable ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                <HiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Admin Editable</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                <HiExclamationCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Static (Code-Only)</span>
              </span>
            )}
          </div>
          <h2 className="font-marcellus text-xl md:text-2xl font-bold text-dark-green">
            {item.title}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={item.livePage.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-sans text-light-ash hover:text-dark px-3 py-1.5 rounded-lg border border-muted/80 hover:bg-light/50 transition-colors"
          >
            <span>{item.livePage.name}</span>
            <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
          </Link>
          {item.isEditable && item.adminPath && (
            <Link
              href={item.adminPath}
              className="inline-flex items-center gap-1 text-xs font-semibold font-sans bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg shadow-sm transition-colors"
            >
              <span>Go to Editor</span>
              <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Main Card Body */}
      <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Demonstration: Screenshot Mockup */}
        <div className="lg:col-span-5 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-light-ash font-sans flex items-center gap-1.5">
            <HiPhoto className="w-4 h-4 text-primary" />
            <span>Section Visual Preview</span>
          </span>
          <div className="relative rounded-xl border border-muted/80 overflow-hidden bg-muted/20 aspect-16/10 shadow-xs group">
            <Image
              src={item.previewImage}
              alt={item.imageCaption}
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <p className="text-xs text-light-ash font-sans italic">
            {item.imageCaption}
          </p>

          {/* Media / Image Specs Box if provided */}
          {item.imageSpecs && (
            <div className="mt-2 p-3 rounded-xl bg-light/30 border border-muted/60 flex flex-col gap-1.5 text-xs font-sans">
              <span className="font-semibold text-dark flex items-center gap-1">
                <HiPhoto className="w-3.5 h-3.5 text-primary" />
                <span>Recommended Asset Specs:</span>
              </span>
              <div className="text-light-ash flex flex-col gap-0.5 text-[11px]">
                <span><strong>Dimensions:</strong> {item.imageSpecs.recommendedDimensions}</span>
                <span><strong>Ratio & Format:</strong> {item.imageSpecs.aspectRatio} ({item.imageSpecs.format})</span>
                <span><strong>File Size:</strong> {item.imageSpecs.maxFileSize}</span>
                {item.imageSpecs.notes && <span className="text-amber-800">{item.imageSpecs.notes}</span>}
              </div>
            </div>
          )}

          {/* Static code location indicator */}
          {!item.isEditable && item.codeLocation && (
            <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs font-mono text-amber-900">
              <HiCodeBracket className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="break-all">{item.codeLocation}</span>
            </div>
          )}
        </div>

        {/* Text Demonstration & Instructions */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-light-ash font-sans">
              Overview
            </span>
            <p className="text-sm font-sans text-dark/90 leading-relaxed">
              {item.summary}
            </p>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-light-ash font-sans flex items-center gap-1.5">
              <HiListBullet className="w-4 h-4 text-primary" />
              <span>Step-by-Step Demonstration</span>
            </span>
            <ol className="list-decimal list-inside flex flex-col gap-1.5 text-xs md:text-sm font-sans text-dark/90 pl-1">
              {item.steps.map((step, idx) => (
                <li key={idx} className="leading-relaxed pl-1">
                  <span className="font-medium text-dark">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Editable Fields Breakdown */}
          {item.fields.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-muted/60">
              <span className="text-xs font-semibold uppercase tracking-wider text-light-ash font-sans">
                {item.isEditable ? "Fields in Admin Dashboard" : "Hardcoded Elements"}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.fields.map((field, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-light text-[11px] font-sans font-medium text-dark border border-muted/50"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pro Tips / Syntax Rules */}
          {item.proTips && item.proTips.length > 0 && (
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex flex-col gap-1 text-xs font-sans text-primary-dark">
              <span className="font-bold flex items-center gap-1">
                <HiLightBulb className="w-3.5 h-3.5 text-accent" />
                <span>Pro Tip</span>
              </span>
              {item.proTips.map((tip, idx) => (
                <p key={idx} className="text-xs text-dark/90">{tip}</p>
              ))}
            </div>
          )}

          {/* Static Alert Notice if applicable */}
          {!item.isEditable && item.staticNotice && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs font-sans text-amber-900 leading-relaxed">
              {item.staticNotice}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
