"use client";

import * as React from "react";
import { HiBriefcase, HiGlobeAlt, HiInboxStack, HiPlus } from "react-icons/hi2";
import { upsertServiceAction } from "@/app/(admin)/admin/actions";

interface ServiceDB {
  id?: string;
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  longDescription: string;
  approach: string;
  isFeatured: boolean;
}

interface EditServiceFormProps {
  initialService?: ServiceDB | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AVAILABLE_ICONS = [
  { value: "HiClipboardDocumentCheck", label: "Clipboard Check (Assessment)" },
  { value: "HiUser", label: "User (Individual)" },
  { value: "HiFaceSmile", label: "Smile (Child)" },
  { value: "HiUsers", label: "Users (Family/Groups)" },
  { value: "HiHeart", label: "Heart (Couple)" },
  { value: "HiAcademicCap", label: "Cap (Cognitive/IQ)" },
  { value: "HiGlobeAlt", label: "Globe (Global/Online)" },
  { value: "HiBookOpen", label: "Book (Education)" },
  { value: "HiSparkles", label: "Sparkles (Wellness)" },
];

export function EditServiceForm({
  initialService,
  onClose,
  onSuccess,
}: EditServiceFormProps): React.JSX.Element {
  const [title, setTitle] = React.useState(initialService?.title || "");
  const [slug, setSlug] = React.useState(initialService?.slug || "");
  const [icon, setIcon] = React.useState(initialService?.icon || "HiUser");
  const [shortDescription, setShortDescription] = React.useState(initialService?.shortDescription || "");
  const [longDescription, setLongDescription] = React.useState(initialService?.longDescription || "");
  const [approach, setApproach] = React.useState(initialService?.approach || "");
  const [isFeatured, setIsFeatured] = React.useState(initialService?.isFeatured || false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Auto-generate slug from Title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!initialService) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        id: initialService?.id,
        title,
        slug,
        icon,
        shortDescription,
        longDescription,
        approach,
        isFeatured,
      };

      const res = await upsertServiceAction(payload);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Failed to save service records.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto px-1 py-2">
      <div className="flex items-center justify-between border-b border-muted pb-4">
        <h3 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2">
          <HiBriefcase className="w-5 h-5 text-primary" />
          {initialService ? "Edit Psychotherapeutic Service" : "Add New Psychotherapeutic Service"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-light-ash hover:text-dark font-semibold text-sm cursor-pointer"
        >
          Close
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 font-sans">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-semibold text-dark">
            Service Title
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g. Individual Therapy"
            className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
            required
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-semibold text-dark">
            Slug Path (Unique identifier)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. individual-therapy"
            className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Icon Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-semibold text-dark">
            Select Lucide Icon
          </label>
          <select
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors cursor-pointer"
          >
            {AVAILABLE_ICONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.value})
              </option>
            ))}
          </select>
        </div>

        {/* Featured Flag */}
        <div className="flex items-center gap-3 md:mt-7 border border-muted/40 p-4 rounded-xl bg-light-ash/5">
          <input
            type="checkbox"
            id="isFeatured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 text-primary border-muted rounded focus:ring-primary cursor-pointer"
          />
          <label htmlFor="isFeatured" className="font-sans text-sm text-dark font-medium cursor-pointer select-none">
            Flag as Featured on Landing Page
          </label>
        </div>
      </div>

      {/* Short Description */}
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-xs font-semibold text-dark">
          Short Description (Appears on grid listings)
        </label>
        <input
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="e.g. one-on-one therapy sessions providing a safe, confidential space"
          className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
          required
        />
      </div>

      {/* Long Description */}
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-xs font-semibold text-dark">
          Detailed Service Description (Supports plain text & multiple paragraphs)
        </label>
        <textarea
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
          rows={6}
          placeholder="Enter a thorough overview of this service..."
          className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors resize-y"
          required
        />
      </div>

      {/* Approach */}
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-xs font-semibold text-dark">
          Therapeutic Approach (Rendered as list items or instructions)
        </label>
        <textarea
          value={approach}
          onChange={(e) => setApproach(e.target.value)}
          rows={4}
          placeholder="e.g. Evidence-based methods&#10;Client-centered care&#10;Ethical & confidential practice"
          className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors resize-y"
          required
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-4 border-t border-muted pt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-light-ash/10 hover:bg-light-ash/20 text-dark font-sans text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary-dark text-white font-sans text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? "Saving Content..." : "Save Service"}
        </button>
      </div>
    </form>
  );
}
