"use client";
import Image from "next/image";

import * as React from "react";
import { HiPhoto, HiOutlineCloudArrowUp, HiXMark } from "react-icons/hi2";
import { upsertGalleryItemAction } from "@/app/(admin)/admin/actions";
import { uploadImageToSupabase } from "@/lib/supabase";

interface GalleryItemDB {
  id?: string;
  type: "image" | "video";
  src: string;
  thumbnailSrc?: string | null;
  alt: string;
  caption: string;
  category: string;
  lastUpdatedBy?: string | null;
  updatedAt?: Date | string | null;
}

interface EditGalleryItemFormProps {
  initialItem?: GalleryItemDB | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditGalleryItemForm({
  initialItem,
  onClose,
  onSuccess,
}: EditGalleryItemFormProps): React.JSX.Element {
  const [type, setType] = React.useState<"image" | "video">(initialItem?.type || "image");
  const [src, setSrc] = React.useState(initialItem?.src || "");
  const [alt, setAlt] = React.useState(initialItem?.alt || "");
  const [caption, setCaption] = React.useState(initialItem?.caption || "");
  const [categorySelect, setCategorySelect] = React.useState<string>(
    ["event", "workshop", "activity", "occasion", "others"].includes(initialItem?.category || "event")
      ? (initialItem?.category || "event")
      : "custom"
  );
  const [customCategory, setCustomCategory] = React.useState<string>(
    ["event", "workshop", "activity", "occasion", "others"].includes(initialItem?.category || "")
      ? ""
      : (initialItem?.category || "")
  );

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file, "cmhcb-media");
      setSrc(publicUrl);
      if (!alt.trim()) {
        setAlt(file.name.split(".")[0]);
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to upload image file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isUploading) return;

    if (!src.trim()) {
      setError("Media source URL/file is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const finalCategory = categorySelect === "custom" ? customCategory.trim() : categorySelect;
      if (!finalCategory) {
        setError("Category name is required.");
        return;
      }

      const payload = {
        id: initialItem?.id,
        type,
        src,
        alt,
        caption,
        category: finalCategory,
      };

      const res = await upsertGalleryItemAction(payload);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Failed to save gallery item.");
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-sm font-sans text-dark">
      <div className="flex items-center justify-between border-b border-muted pb-4">
        <div className="flex flex-col">
          <h3 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2">
            <HiPhoto className="w-5 h-5 text-primary" />
            {initialItem ? "Edit Gallery Item" : "Add Gallery Item"}
          </h3>
          {initialItem?.lastUpdatedBy && (
            <span className="text-[11px] text-light-ash/70 mt-0.5">
              Last updated by <span className="font-semibold text-primary">{initialItem.lastUpdatedBy}</span> on {initialItem.updatedAt ? new Date(initialItem.updatedAt).toLocaleString() : ""}
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
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-xs font-semibold border border-rose-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Media Type Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-xs text-dark">Media Type</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as "image" | "video");
              setSrc("");
            }}
            className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-xs"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        {/* Category Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-xs text-dark">Category</label>
          <select
            value={categorySelect}
            onChange={(e) => {
              setCategorySelect(e.target.value);
              if (e.target.value !== "custom") {
                setCustomCategory("");
              }
            }}
            className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-xs"
          >
            <option value="event">Event</option>
            <option value="workshop">Workshop</option>
            <option value="activity">Activity</option>
            <option value="occasion">Occasion</option>
            <option value="others">Others</option>
            <option value="custom">+ Add Custom Category...</option>
          </select>
        </div>

        {/* Custom Category Input */}
        {categorySelect === "custom" && (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="font-semibold text-xs text-dark">Custom Category Name</label>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="e.g. Seminar, Meeting, Retreat"
              className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-xs"
              required={categorySelect === "custom"}
            />
          </div>
        )}

        {/* Media Source Link or File Upload */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="font-semibold text-xs text-dark">
            {type === "image" ? "Upload Image or Enter URL" : "Video URL (direct link or mp4)"}
          </label>
          {type === "image" ? (
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-xs"
              />
              <span className="text-light-ash text-xs font-semibold shrink-0">or</span>
              <label className="w-full sm:w-auto px-4 py-2 border border-dashed border-muted hover:border-primary rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200">
                <HiOutlineCloudArrowUp className="w-4 h-4 text-light-ash" />
                <span className="text-xs text-light-ash font-medium">
                  {isUploading ? "Uploading..." : "Upload File"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          ) : (
            <input
              type="text"
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              placeholder="https://assets.mixkit.co/videos/preview/example.mp4"
              className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-xs"
              required
            />
          )}
          {src && type === "image" && (
            <div className="mt-2 relative w-32 h-20 border border-muted rounded-lg overflow-hidden shrink-0">
              
              <Image src={src} alt="Preview" width={400} height={300} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Alt text */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="font-semibold text-xs text-dark">Alternative Text (SEO description)</label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the media context..."
            className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-xs"
            required
          />
        </div>

        {/* Caption */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="font-semibold text-xs text-dark">Caption (visible description overlay)</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="A short caption displayed on hover..."
            className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary h-20 resize-none leading-relaxed text-xs"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-muted pt-4 mt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-muted hover:border-dark text-dark text-xs font-semibold rounded-xl cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl flex items-center justify-center cursor-pointer"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? "Saving..." : "Save Gallery Item"}
        </button>
      </div>
    </form>
  );
}