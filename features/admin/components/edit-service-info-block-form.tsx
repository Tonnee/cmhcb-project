"use client";

import * as React from "react";
import { HiPhoto, HiPlus, HiTrash, HiDocumentText, HiXMark } from "react-icons/hi2";
import { upsertServiceInfoBlockAction } from "@/app/(admin)/admin/actions";
import { uploadImageToSupabase } from "@/lib/supabase";

interface ServiceInfoBlockDB {
  id?: string;
  heading: string;
  items: string; // JSON string of string[]
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  order: number;
  lastUpdatedBy?: string | null;
  updatedAt?: Date | string | null;
}

interface EditServiceInfoBlockFormProps {
  initialBlock?: ServiceInfoBlockDB | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditServiceInfoBlockForm({
  initialBlock,
  onClose,
  onSuccess,
}: EditServiceInfoBlockFormProps): React.JSX.Element {
  const [heading, setHeading] = React.useState(initialBlock?.heading || "");
  const [ctaLabel, setCtaLabel] = React.useState(initialBlock?.ctaLabel || "Book Appointment");
  const [ctaHref, setCtaHref] = React.useState(initialBlock?.ctaHref || "/appointment");
  const [imageUrl, setImageUrl] = React.useState(initialBlock?.image || "");
  const [imageAlt, setImageAlt] = React.useState(initialBlock?.imageAlt || "");
  const [order, setOrder] = React.useState(initialBlock?.order ?? 0);

  // Dynamic items list
  const [items, setItems] = React.useState<string[]>(() => {
    if (!initialBlock?.items) return [""];
    try {
      const parsed = JSON.parse(initialBlock.items);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [""];
    } catch {
      return [""];
    }
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Manage items
  const handleItemChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([...items, ""]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) {
      setItems([""]);
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  // Upload image
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file);
      setImageUrl(publicUrl);
      if (!imageAlt) {
        setImageAlt(`Illustration for ${heading || "Services Page Content"}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image. Ensure Supabase credentials are configured.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setError("An image is required for the split content block.");
      return;
    }

    // Filter empty items
    const filteredItems = items.map(t => t.trim()).filter(t => t.length > 0);
    if (filteredItems.length === 0) {
      setError("Please add at least one bullet description point.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        id: initialBlock?.id,
        heading,
        items: filteredItems,
        ctaLabel,
        ctaHref,
        image: imageUrl,
        imageAlt: imageAlt || heading,
        order,
      };

      const res = await upsertServiceInfoBlockAction(payload);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Failed to save block.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto px-1 py-2 text-left">
      <div className="flex items-center justify-between border-b border-muted pb-4">
        <div className="flex flex-col">
          <h3 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2">
            <HiDocumentText className="w-5 h-5 text-primary" />
            {initialBlock ? "Edit Services Info Block" : "Add Services Info Block"}
          </h3>
          {initialBlock?.lastUpdatedBy && (
            <span className="text-[11px] text-light-ash/70 mt-0.5">
              Last updated by <span className="font-semibold text-primary">{initialBlock.lastUpdatedBy}</span> on {initialBlock.updatedAt ? new Date(initialBlock.updatedAt).toLocaleString() : ""}
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
        {/* Heading */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-semibold text-dark">
            Block Heading / Title
          </label>
          <input
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="e.g. Who Can Benefit"
            className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
            required
          />
        </div>

        {/* Order */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-semibold text-dark">
            Display Order Priority (Lower values render first)
          </label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
            placeholder="e.g. 0"
            className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
            required
          />
        </div>
      </div>

      {/* Dynamic List Items */}
      <div className="flex flex-col gap-3 border border-muted/50 p-4 rounded-xl bg-light-ash/5">
        <label className="font-sans text-xs font-semibold text-dark flex items-center justify-between">
          <span>Bullet Description Points</span>
          <button
            type="button"
            onClick={handleAddItem}
            className="text-primary hover:text-primary-dark font-semibold text-xs flex items-center gap-1 cursor-pointer"
          >
            <HiPlus className="w-3.5 h-3.5" /> Add Point
          </button>
        </label>
        
        <div className="flex flex-col gap-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs font-mono text-light-ash/80 shrink-0 w-4">{idx + 1}.</span>
              <input
                type="text"
                value={item}
                onChange={(e) => handleItemChange(idx, e.target.value)}
                placeholder="Enter description bullet point text..."
                className="flex-1 font-sans text-sm px-4 py-2 bg-white border border-muted focus:border-primary rounded-xl outline-hidden"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                title="Remove bullet point"
              >
                <HiTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CTA Label */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-semibold text-dark">
            CTA Button Label
          </label>
          <input
            type="text"
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            placeholder="e.g. Book Appointment"
            className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
            required
          />
        </div>

        {/* CTA Href */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-semibold text-dark">
            CTA Button Link (Href)
          </label>
          <input
            type="text"
            value={ctaHref}
            onChange={(e) => setCtaHref(e.target.value)}
            placeholder="e.g. /appointment"
            className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
            required
          />
        </div>
      </div>

      {/* Image File upload */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-light-ash/5 p-4 rounded-xl border border-muted/50">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="w-20 h-20 rounded-xl object-cover border border-primary shrink-0 bg-white"
          />
        )}
        <div className="flex-1 flex flex-col gap-2 w-full">
          <label className="font-sans text-xs font-semibold text-dark flex items-center gap-1.5">
            <HiPhoto className="w-4 h-4 text-primary" />
            Display Block Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 text-xs text-light-ash font-sans cursor-pointer w-full"
            disabled={isUploading || isSubmitting}
          />
          <input
            type="text"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder="Image alt description (SEO)"
            className="w-full font-sans text-xs px-3 py-1.5 bg-white border border-muted focus:border-primary rounded-lg outline-hidden"
          />
        </div>
        {isUploading && <span className="text-xs text-primary font-medium font-sans animate-pulse shrink-0">Uploading image...</span>}
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
          disabled={isSubmitting || isUploading}
          className="bg-primary hover:bg-primary-dark text-white font-sans text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? "Saving Content..." : "Save Block"}
        </button>
      </div>
    </form>
  );
}
