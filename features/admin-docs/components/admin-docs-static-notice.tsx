import * as React from "react";
import { HiExclamationTriangle, HiCodeBracket, HiPaperAirplane } from "react-icons/hi2";
import { STATIC_CONTENT_GENERIC_NOTICE } from "@/data/admin-docs";

interface AdminDocsStaticNoticeProps {
  searchedQuery?: string;
  className?: string;
}

export default function AdminDocsStaticNotice({
  searchedQuery,
  className = "",
}: AdminDocsStaticNoticeProps): React.JSX.Element {
  return (
    <div
      role="alert"
      className={`p-5 md:p-6 rounded-2xl bg-amber-50/80 border-2 border-amber-300 shadow-sm flex flex-col gap-4 ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
          <HiExclamationTriangle className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-marcellus text-lg md:text-xl font-bold text-amber-950">
              {STATIC_CONTENT_GENERIC_NOTICE.title}
            </h3>
            {searchedQuery && (
              <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-xs font-mono font-medium">
                Matches &quot;{searchedQuery}&quot;
              </span>
            )}
          </div>
          <p className="font-sans text-sm text-amber-900 leading-relaxed">
            {STATIC_CONTENT_GENERIC_NOTICE.message}
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans text-amber-900">
        <div className="flex items-center gap-2">
          <HiCodeBracket className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            {STATIC_CONTENT_GENERIC_NOTICE.actionGuide}
          </span>
        </div>
        <a
          href="mailto:support@cmhcbd.com?subject=Static%20Content%20Change%20Request"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <HiPaperAirplane className="w-3.5 h-3.5" />
          <span>Contact Technical Team</span>
        </a>
      </div>
    </div>
  );
}
