"use client";

import * as React from "react";
import { uploadImageToSupabase } from "@/lib/supabase";
import { upsertWorkshopAction } from "@/app/(admin)/admin/actions";
import { HiXMark } from "react-icons/hi2";

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
    content: string | null;
    gallery: string | null; // JSON string
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditWorkshopForm({
  workshop,
  onClose,
  onSuccess,
}: WorkshopFormProps): React.JSX.Element {
  // Input states
  const [title, setTitle] = React.useState(workshop?.title || "");
  const [slug, setSlug] = React.useState(workshop?.slug || "");
  const [description, setDescription] = React.useState(workshop?.description || "");
  const [imageUrl, setImageUrl] = React.useState(workshop?.image || "");
  const [date, setDate] = React.useState(workshop?.date || "");
  const [time, setTime] = React.useState(workshop?.time || "");
  const [location, setLocation] = React.useState(workshop?.location || "");
  const [author, setAuthor] = React.useState(workshop?.author || "");
  const [tagsString, setTagsString] = React.useState<string>(() => {
    if (!workshop) return "Workshop, Mental Health";
    const parsed = JSON.parse(workshop.tags);
    return Array.isArray(parsed) ? parsed.join(", ") : "";
  });
  const [isFeatured, setIsFeatured] = React.useState(workshop?.isFeatured || false);
  const [content, setContent] = React.useState(workshop?.content || "");

  // Status states
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  // Handle Image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg("");
    try {
      const publicUrl = await uploadImageToSupabase(file);
      setImageUrl(publicUrl);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload image. Ensure Supabase credentials are configured.");
    } finally {
      setIsUploading(false);
    }
  };

  // Submit form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || isUploading) return;

    if (!title || !description || !imageUrl || !date || !time || !location || !author) {
      setErrorMsg("All core fields (Title, Description, Image, Date, Time, Location, Instructor) are required.");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");

    try {
      // Split tags by comma
      const tags = tagsString
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const payload = {
        id: workshop?.id,
        slug: slug.trim() || undefined,
        title,
        description,
        image: imageUrl,
        date,
        time,
        location,
        author,
        tags,
        isFeatured,
        content,
        gallery: workshop ? JSON.parse(workshop.gallery || "[]") : [],
      };

      const result = await upsertWorkshopAction(payload);

      if (result.success) {
        onSuccess();
      } else {
        setErrorMsg(result.error || "Failed to save workshop details.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2">
      <div className="flex items-center justify-between border-b border-muted pb-4">
        <h2 className="font-marcellus text-xl font-bold text-dark-green">
          {workshop ? "Edit Workshop Details" : "Create New Workshop"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 hover:bg-light rounded-lg text-light-ash transition-colors"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">Workshop Title</label>
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
            <label className="font-semibold text-dark">URL Slug (Optional)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. coping-with-anxiety-workshop (auto if empty)"
              className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-dark">Brief Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short summary displayed on list pages..."
            className="w-full h-16 px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary resize-none"
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
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="w-16 h-16 rounded-xl object-cover border border-primary shrink-0"
            />
          )}
          <div className="flex-1 flex flex-col gap-1">
            <span className="font-semibold text-dark">Workshop Cover Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 text-xs text-light-ash"
              disabled={isUploading}
            />
          </div>
          {isUploading && <span className="text-xs text-primary font-medium animate-pulse">Uploading image to Supabase...</span>}
        </div>

        {/* Featured Toggle */}
        <label className="flex items-center gap-2 cursor-pointer w-fit text-light-ash">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="rounded border-muted text-primary focus:ring-primary w-4 h-4"
          />
          <span className="font-semibold text-dark">Feature this workshop on the landing page hero</span>
        </label>

        {/* Content text area */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-dark">Full Workshop Content (HTML format supported)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write HTML paragraphs, lists, and headings detailing the workshop schedule and agenda..."
            className="w-full h-40 px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary font-mono text-xs"
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
            {isSaving ? "Saving..." : "Save Workshop"}
          </button>
        </div>
      </form>
    </div>
  );
}
