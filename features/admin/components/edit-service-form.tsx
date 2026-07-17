"use client";
import Image from "next/image";

import * as React from "react";
import { HiBriefcase, HiPhoto, HiXMark } from "react-icons/hi2";
import { upsertServiceAction } from "@/app/(admin)/admin/actions";
import { uploadImageToSupabase } from "@/lib/supabase";

interface ServiceDB {
  id?: string;
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  longDescription: string;
  approach: string;
  isFeatured: boolean;
  showInNavbar?: boolean;
  image?: string | null;
  bgImage?: string | null;
  duration?: string | null;
  fees?: string | null;
  order?: number;
  lastUpdatedBy?: string | null;
  updatedAt?: string | Date;
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
  const [showInNavbar, setShowInNavbar] = React.useState(initialService?.showInNavbar ?? true);
  const [imageUrl, setImageUrl] = React.useState(initialService?.image || "");
  const [bgImageUrl, setBgImageUrl] = React.useState(initialService?.bgImage || "");
  const [duration, setDuration] = React.useState(initialService?.duration || "");
  const [fees, setFees] = React.useState(initialService?.fees || "");
  const [order, setOrder] = React.useState(initialService?.order ?? 0);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isUploadingBg, setIsUploadingBg] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Handle Hero Background Image upload
  const handleBgImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBg(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file);
      setBgImageUrl(publicUrl);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to upload background image. Ensure Supabase credentials are configured.");
    } finally {
      setIsUploadingBg(false);
    }
  };

  // Handle Image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file);
      setImageUrl(publicUrl);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to upload image. Ensure Supabase credentials are configured.");
    } finally {
      setIsUploading(false);
    }
  };

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
        showInNavbar,
        image: imageUrl || null,
        bgImage: bgImageUrl || null,
        duration: duration || null,
        fees: fees || null,
        order: Number(order) || 0,
      };

      const res = await upsertServiceAction(payload);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Failed to save service records.");
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto px-1 py-2">
      <div className="flex items-center justify-between border-b border-muted pb-4">
        <div className="flex flex-col">
          <h3 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2">
            <HiBriefcase className="w-5 h-5 text-primary" />
            {initialService ? "Edit Psychotherapeutic Service" : "Add New Psychotherapeutic Service"}
          </h3>
          {initialService?.lastUpdatedBy && (
            <span className="text-[11px] text-light-ash/70 mt-0.5 ml-7">
              Last updated by <span className="font-semibold text-primary">{initialService.lastUpdatedBy}</span> on {initialService.updatedAt ? new Date(initialService.updatedAt).toLocaleString() : ""}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition-colors cursor-pointer"
        >
          <HiXMark className="w-5 h-5" />
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

      {/* Duration & Fees & Priority */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-semibold text-dark">
            Session Duration (e.g. 60 mins)
          </label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 60 mins"
            className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-semibold text-dark">
            Session Fee (e.g. 1,000 BDT)
          </label>
          <input
            type="text"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            placeholder="e.g. 1,000 BDT"
            className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-semibold text-dark">
            Priority Number (Order)
          </label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            placeholder="e.g. 0"
            className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
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

        {/* Settings Flags */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 border border-muted/40 p-3.5 rounded-xl bg-light-ash/5">
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

          <div className="flex items-center gap-3 border border-muted/40 p-3.5 rounded-xl bg-light-ash/5">
            <input
              type="checkbox"
              id="showInNavbar"
              checked={showInNavbar}
              onChange={(e) => setShowInNavbar(e.target.checked)}
              className="w-4 h-4 text-primary border-muted rounded focus:ring-primary cursor-pointer"
            />
            <label htmlFor="showInNavbar" className="font-sans text-sm text-dark font-medium cursor-pointer select-none">
              Show in Navbar Dropdown Menu
            </label>
          </div>
        </div>
      </div>

      {/* Image File upload */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-light-ash/5 p-4 rounded-xl border border-muted/50">
        {imageUrl && (
          <Image src={imageUrl} alt="Preview" width={64} height={64} className="w-16 h-16 rounded-xl object-cover border border-primary shrink-0" />
        )}
        <div className="flex-1 flex flex-col gap-1">
          <label className="font-sans text-xs font-semibold text-dark flex items-center gap-1.5">
            <HiPhoto className="w-4 h-4 text-primary" />
            Service Card Image (Optional fallback uses default page background)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 text-xs text-light-ash font-sans cursor-pointer"
            disabled={isUploading || isSubmitting}
          />
        </div>
        {isUploading && <span className="text-xs text-primary font-medium font-sans animate-pulse">Uploading image...</span>}
      </div>

      {/* Hero Background Image File upload */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-light-ash/5 p-4 rounded-xl border border-muted/50">
        {bgImageUrl && (
          <Image src={bgImageUrl} alt="Background Preview" width={64} height={64} className="w-16 h-16 rounded-xl object-cover border border-primary shrink-0" />
        )}
        <div className="flex-1 flex flex-col gap-1">
          <label className="font-sans text-xs font-semibold text-dark flex items-center gap-1.5">
            <HiPhoto className="w-4 h-4 text-primary" />
            Hero Background Image (Used on service details page hero section)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleBgImageChange}
            className="file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 text-xs text-light-ash font-sans cursor-pointer"
            disabled={isUploadingBg || isSubmitting}
          />
        </div>
        {isUploadingBg && <span className="text-xs text-primary font-medium font-sans animate-pulse">Uploading background image...</span>}
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