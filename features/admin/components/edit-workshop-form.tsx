"use client";
import Image from "next/image";

import * as React from "react";
import { uploadImageToSupabase } from "@/lib/supabase";
import { upsertWorkshopAction } from "@/app/(admin)/admin/actions";
import { HiXMark } from "react-icons/hi2";
import { safeJsonParse } from "@/lib/json";
import { z } from "zod";

interface WorkshopFormProps {
  workshop?: {
    id: string;
    slug: string;
    title: string;
    description: string;
    image: string;
    date: string;
    time: string;
    location: string;
    author: string;
    tags: string; // JSON string
    isFeatured: boolean;
    isLatest?: boolean;
    content: string | null;
    gallery: string | null; // JSON string
    lastUpdatedBy?: string | null;
    updatedAt?: string | Date;
  } | null;
  currentFeaturedCount?: number;
  onClose: () => void;
  onSuccess: () => void;
}

const workshopSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image URL is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  author: z.string().min(1, "Instructor/Author is required"),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isLatest: z.boolean().default(false),
  content: z.string().optional(),
  gallery: z.array(z.string()).default([]),
});

export default function EditWorkshopForm({
  workshop,
  currentFeaturedCount = 0,
  onClose,
  onSuccess,
}: WorkshopFormProps): React.JSX.Element {
  // Input states
  const [title, setTitle] = React.useState(workshop?.title || "");
  const [slug, setSlug] = React.useState(workshop?.slug || "");
  const [description, setDescription] = React.useState(workshop?.description || "");
  const [imageUrl, setImageUrl] = React.useState(workshop?.image || "");
  const [previewUrl, setPreviewUrl] = React.useState(workshop?.image || "");
  const [pendingFile, setPendingFile] = React.useState<File | null>(null);
  const [date, setDate] = React.useState(workshop?.date || "");
  const [time, setTime] = React.useState(workshop?.time || "");
  const [location, setLocation] = React.useState(workshop?.location || "");
  const [author, setAuthor] = React.useState(workshop?.author || "");
  const [tagsString, setTagsString] = React.useState<string>(() => {
    if (!workshop) return "Workshop, Mental Health";
    const parsed = safeJsonParse<string[]>(workshop.tags, []);
    return Array.isArray(parsed) ? parsed.join(", ") : "";
  });
  const [isFeatured, setIsFeatured] = React.useState(workshop?.isFeatured || false);
  const [isLatest, setIsLatest] = React.useState(workshop?.isLatest || false);
  const [content, setContent] = React.useState(workshop?.content || "");

  // Status states
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const isFeaturedLimitReached = !workshop?.isFeatured && currentFeaturedCount >= 4;

  const handleFeaturedToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked && isFeaturedLimitReached) {
      setErrorMsg("Only 4 events can be marked as featured on the landing page at a time. Please uncheck another featured event first.");
      return;
    }
    setIsFeatured(checked);
    if (errorMsg.includes("4 events")) {
      setErrorMsg("");
    }
  };

  // Handle Image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingFile(file);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    setIsUploading(true);
    setErrorMsg("");
    try {
      const publicUrl = await uploadImageToSupabase(file);
      setImageUrl(publicUrl);
      setPreviewUrl(publicUrl);
    } catch (err) {
      setErrorMsg(err instanceof Error ? (err instanceof Error ? err.message : String(err)) : "Failed to upload image. Ensure Supabase credentials are configured.");
    } finally {
      setIsUploading(false);
    }
  };

  // Submit form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setErrorMsg("");

    try {
      let finalImageUrl = imageUrl;

      // If upload is in-flight or if imageUrl is a local blob, ensure upload finishes
      if (pendingFile && (!finalImageUrl || finalImageUrl.startsWith("blob:"))) {
        setIsUploading(true);
        try {
          finalImageUrl = await uploadImageToSupabase(pendingFile);
          setImageUrl(finalImageUrl);
          setPreviewUrl(finalImageUrl);
        } catch (uploadErr) {
          setErrorMsg((uploadErr instanceof Error ? uploadErr.message : String(uploadErr)) || "Failed to upload image.");
          setIsSaving(false);
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      if (!finalImageUrl) {
        setErrorMsg("Cover image is required.");
        setIsSaving(false);
        return;
      }

      // Split tags by comma
      const tags = tagsString
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const finalSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

      const payload = {
        id: workshop?.id,
        slug: finalSlug,
        title,
        description,
        image: finalImageUrl,
        date,
        time,
        location,
        author,
        tags,
        isFeatured,
        isLatest,
        content: content || undefined,
        gallery: workshop ? safeJsonParse<string[]>(workshop.gallery, []) : [],
      };

      // Zod validation on client
      const validation = workshopSchema.safeParse(payload);
      if (!validation.success) {
        setErrorMsg(validation.error.issues.map((issue) => issue.message).join(", "));
        setIsSaving(false);
        return;
      }

      const result = await upsertWorkshopAction(payload);

      if (result.success) {
        onSuccess();
      } else {
        setErrorMsg(result.error || "Failed to save workshop details.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? (err instanceof Error ? err.message : String(err)) : "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2 font-sans">
      <div className="flex items-center justify-between border-b border-muted pb-4">
        <div className="flex flex-col">
          <h2 className="font-marcellus text-xl font-bold text-dark-green">
            {workshop ? "Edit Event & Workshop Details" : "Create New Event & Workshop"}
          </h2>
          {workshop?.lastUpdatedBy && (
            <span className="text-[11px] text-light-ash/70 mt-0.5">
              Last updated by <span className="font-semibold text-primary">{workshop.lastUpdatedBy}</span> on {workshop.updatedAt ? new Date(workshop.updatedAt).toLocaleString() : ""}
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

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-sans font-medium border border-red-100">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-sans text-sm">
        {/* Core Text fields */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Coping with Anxiety Workshop"
              className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-dark">Short Summary Description</label>
            <span className="text-[11px] font-normal text-primary">
              Shown on: <a href="/workshops" target="_blank" rel="noreferrer" className="underline hover:text-primary-dark font-medium">Workshops Page (/workshops)</a>
            </span>
          </div>
          <span className="text-[11px] text-light-ash">
            This brief overview is displayed on workshop preview cards on the <a href="/workshops" target="_blank" rel="noreferrer" className="text-primary hover:underline">Workshops Directory</a>.
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short 1-2 sentence overview of the workshop..."
            className="w-full h-16 px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary resize-none mt-0.5"
            required
          />
        </div>

        {/* Date and Place */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">Date (ISO/readable)</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. 2026-06-20T10:00:00Z"
              className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">Time Range</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 10:00 AM - 12:00 PM"
              className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Online via Zoom / Seminar Hall"
              className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">Instructor / Presenter</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Nazme Ara"
              className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">Tags (Comma-separated)</label>
            <input
              type="text"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              placeholder="Workshop, Stress, Mindfulness"
              className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Image File upload */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-light/10 p-4 rounded-xl border border-muted/50">
          {(previewUrl || imageUrl) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl || imageUrl} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-primary shrink-0" />
          )}
          <div className="flex-1 flex flex-col gap-1">
            <span className="font-semibold text-dark">Cover Image</span>
            <span className="text-[11px] text-light-ash">Size: <strong>800×500 px</strong> (16:10 ratio) • Format: <strong>.jpg, .png, .webp</strong> (Max 10MB)</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 text-xs text-light-ash mt-0.5"
              disabled={isUploading}
            />
          </div>
          {isUploading && <span className="text-xs text-primary font-medium animate-pulse">Uploading image to Supabase...</span>}
        </div>

        {/* Featured / Display Toggles */}
        <div className="flex flex-col gap-4 p-4 bg-light/10 border border-muted/50 rounded-2xl">
          <div className="flex flex-col gap-1.5">
            <label className={`flex items-center gap-2 cursor-pointer w-fit text-light-ash ${isFeaturedLimitReached && !isFeatured ? "opacity-75" : ""}`}>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={handleFeaturedToggle}
                className="rounded border-muted text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-dark text-xs sm:text-sm">
                Feature this event on the landing page as upcoming event
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isFeatured
                  ? "bg-primary/15 text-primary-dark"
                  : isFeaturedLimitReached
                  ? "bg-amber-100 text-amber-800"
                  : "bg-muted/40 text-light-ash"
              }`}>
                {workshop?.isFeatured
                  ? `${currentFeaturedCount}/4 Active`
                  : isFeatured
                  ? `${Math.min(currentFeaturedCount + 1, 4)}/4 Active`
                  : `${currentFeaturedCount}/4 Used`}
              </span>
            </label>
            {isFeaturedLimitReached && !isFeatured && (
              <p className="text-[11px] text-amber-700 font-sans pl-6">
                All 4 landing page featured event slots are currently filled. Uncheck another featured event to feature this one.
              </p>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer w-fit text-light-ash">
            <input
              type="checkbox"
              checked={isLatest}
              onChange={(e) => setIsLatest(e.target.checked)}
              className="rounded border-muted text-primary focus:ring-primary w-4 h-4 cursor-pointer"
            />
            <span className="font-semibold text-dark text-xs sm:text-sm">
              Mark this event as latest event in workshops page
            </span>
          </label>
        </div>

        {/* Content text area */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-dark">Full Event / Workshop Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write workshop overview, schedule, topics covered, and details in plain text..."
            className="w-full h-40 px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-xs"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-muted pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-muted text-light-ash hover:bg-light text-xs font-semibold rounded-xl"
            disabled={isSaving || isUploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
            disabled={isSaving || isUploading}
          >
            {isSaving ? "Saving..." : "Save Event / Workshop"}
          </button>
        </div>
      </form>
    </div>
  );
}