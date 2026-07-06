"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { upsertPolicyPageContentAction } from "@/app/(admin)/admin/actions";

interface PolicyPageContent {
  id: string;
  title: string;
  subtitle: string;
  content: string;
}

interface EditPolicyPageFormProps {
  id: string;
  initialContent: PolicyPageContent | null;
}

export default function EditPolicyPageForm({
  id,
  initialContent,
}: EditPolicyPageFormProps): React.JSX.Element {
  const router = useRouter();

  const [title, setTitle] = React.useState(initialContent?.title || (id === "privacy-policy" ? "Privacy Policy" : "Terms of Service"));
  const [subtitle, setSubtitle] = React.useState(initialContent?.subtitle || "Last Updated: May 2026");
  const [content, setContent] = React.useState(initialContent?.content || "");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await upsertPolicyPageContentAction(id, {
        title,
        subtitle,
        content,
      });

      if (res.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(res.error || "Failed to update policy page content.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl bg-white border border-muted rounded-2xl p-6 md:p-8 shadow-sm font-sans text-sm">
      {success && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-sans font-medium border border-emerald-100">
          Page content updated successfully.
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-sm font-sans font-medium border border-rose-100">
          {error}
        </div>
      )}

      {/* Header Fields */}
      <div className="flex flex-col gap-4 border-b border-muted/80 pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Page Header Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Page Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Page Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>
        </div>
      </div>

      {/* Page Content Markdown/HTML */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="font-semibold text-dark text-xs">Page Content (HTML support)</label>
          <span className="text-[10px] text-light-ash/80 italic">You can use basic HTML paragraph, strong, and heading tags.</span>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="<p>Write your policy paragraphs here...</p>

<h2>Section 1. Heading</h2>
<p>More details...</p>"
          className="w-full h-96 px-4 py-3 border border-muted rounded-2xl bg-page-bg/50 focus:outline-none focus:border-primary font-mono text-xs leading-relaxed resize-y"
          required
        />
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end border-t border-muted pt-6 mt-4">
        <button
          type="submit"
          className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Policy Content"}
        </button>
      </div>
    </form>
  );
}
