"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

export interface FeeItem {
  label: string;
  amount?: string;
  amountOnsite?: string;
  amountOnline?: string;
}

export interface FeeCategory {
  category: string;
  items: FeeItem[];
}

export interface TherapistFeeTierRowProps {
  item: FeeItem;
  currentPreference: "in-person" | "online";
  onSelectPreference: (pref: "in-person" | "online") => void;
}

/**
 * Reusable single tier row displaying In Person & Online interactive selection cards
 */
export function TherapistFeeTierRow({
  item,
  currentPreference,
  onSelectPreference,
}: TherapistFeeTierRowProps): React.JSX.Element {
  const onsiteFee = item.amountOnsite || item.amount;
  const onlineFee = item.amountOnline || item.amount;
  const isOnlinePref = currentPreference === "online";
  const isInPersonPref = currentPreference === "in-person";

  return (
    <div className="bg-white p-3.5 rounded-xl border border-muted/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors">
      <div className="flex flex-col">
        <span className="font-sans text-xs sm:text-sm font-semibold text-dark">
          {item.label}
        </span>
        <span className="text-[11px] text-light-ash">
          Standard consultation tier
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:min-w-[280px]">
        {/* In Person rate button */}
        <button
          type="button"
          onClick={() => onSelectPreference("in-person")}
          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
            isInPersonPref
              ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20"
              : "bg-light/10 border-muted/50 hover:bg-light/20"
          }`}
          title="Select In Person session"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              In Person
            </span>
            {isInPersonPref && (
              <span className="text-[9px] text-emerald-700 font-bold lowercase px-1.5 py-0.2 rounded bg-emerald-100">
                selected
              </span>
            )}
          </div>
          <div className="font-marcellus text-sm font-bold text-primary-dark mt-1">
            {onsiteFee || "Available"}
          </div>
        </button>

        {/* Online rate button */}
        <button
          type="button"
          onClick={() => onSelectPreference("online")}
          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
            isOnlinePref
              ? "bg-sky-50 border-sky-500 ring-2 ring-sky-500/20"
              : "bg-light/10 border-muted/50 hover:bg-light/20"
          }`}
          title="Select Online session"
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
              Online
            </span>
            {isOnlinePref && (
              <span className="text-[9px] text-sky-700 font-bold lowercase px-1.5 py-0.2 rounded bg-sky-100">
                selected
              </span>
            )}
          </div>
          <div className="font-marcellus text-sm font-bold text-primary-dark mt-1">
            {onlineFee || "Available"}
          </div>
        </button>
      </div>
    </div>
  );
}

export interface TherapistFeePreviewProps {
  therapist: {
    id: string;
    name: string;
    image?: string | null;
    fees?: FeeCategory[] | null;
  };
  /** Single category if a specific one matched the service */
  matchedCategory?: FeeCategory | null;
  /** Name of the selected service if any */
  selectedServiceTitle?: string | null;
  currentPreference: "in-person" | "online";
  onSelectPreference: (pref: "in-person" | "online") => void;
  className?: string;
}

/**
 * Unified Therapist Fee Preview Component
 * Ensures identical visual hierarchy, interactive In Person / Online cards,
 * and preference sync for all therapists and fee structures.
 */
export function TherapistFeePreview({
  therapist,
  matchedCategory,
  selectedServiceTitle,
  currentPreference,
  onSelectPreference,
  className = "",
}: TherapistFeePreviewProps): React.JSX.Element {
  const categoriesToRender: FeeCategory[] = matchedCategory
    ? [matchedCategory]
    : therapist.fees && therapist.fees.length > 0
    ? therapist.fees
    : [];

  const isSingleMatched = Boolean(matchedCategory && selectedServiceTitle);

  return (
    <div
      className={`rounded-2xl border-2 border-primary/25 bg-gradient-to-br from-primary/5 via-white to-light/30 p-4 sm:p-5 flex flex-col gap-4 shadow-xs ${className}`}
    >
      {/* Header: Therapist Avatar & Rates Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-3">
          {therapist.image ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-primary/30 shadow-xs bg-white">
              <Image
                src={therapist.image}
                alt={therapist.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary-dark text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
              {therapist.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-dark text-sm sm:text-base">
                {therapist.name}
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary-dark">
                {isSingleMatched && matchedCategory
                  ? matchedCategory.category
                  : "Consultation Rates"}
              </span>
            </div>
            <p className="text-xs text-light-ash">
              {isSingleMatched ? (
                <>
                  Rates configured for{" "}
                  <strong className="text-dark font-medium">
                    {selectedServiceTitle}
                  </strong>
                </>
              ) : selectedServiceTitle ? (
                <>
                  Available consultation tiers for{" "}
                  <strong className="text-dark font-medium">
                    {therapist.name}
                  </strong>
                </>
              ) : (
                <>
                  Standard consultation rates for{" "}
                  <strong className="text-dark font-medium">
                    {therapist.name}
                  </strong>
                </>
              )}
            </p>
          </div>
        </div>

        <Link
          href={`/therapists/${therapist.id}`}
          target="_blank"
          className="text-xs text-primary-dark hover:text-primary font-medium flex items-center gap-1 self-start sm:self-auto hover:underline"
        >
          View Profile ↗
        </Link>
      </div>

      {/* Fee Categories and Tiers */}
      <div className="flex flex-col gap-4">
        {categoriesToRender.map((cat, catIdx) => (
          <div key={catIdx} className="flex flex-col gap-2.5">
            {/* Show category label if rendering multiple categories */}
            {!isSingleMatched && (
              <div className="flex items-center gap-2 pt-1">
                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-dark-green">
                  {cat.category}
                </h4>
              </div>
            )}

            {/* List of rate tier rows */}
            <div className="flex flex-col gap-2">
              {cat.items.map((item, itemIdx) => (
                <TherapistFeeTierRow
                  key={itemIdx}
                  item={item}
                  currentPreference={currentPreference}
                  onSelectPreference={onSelectPreference}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer: Sync indicator and mode info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-light-ash gap-1 pt-1">
        <span>
          Fees are synchronized with {therapist.name}&apos;s profile. Click an In Person or Online box to choose session mode.
        </span>
        <span className="font-medium text-primary-dark whitespace-nowrap">
          Current Mode: {currentPreference === "online" ? "Online" : "In Person"}
        </span>
      </div>
    </div>
  );
}
