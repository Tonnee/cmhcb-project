"use client";
import Image from "next/image";

import * as React from "react";
import { HiChatBubbleLeftRight, HiPhoto, HiXMark } from "react-icons/hi2";
import { upsertTestimonialAction } from "@/app/(admin)/admin/actions";
import { uploadImageToSupabase } from "@/lib/supabase";

interface TestimonialDB {
  id?: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  isFeatured: boolean;
  lastUpdatedBy?: string | null;
  updatedAt?: Date | string | null;
}

interface EditTestimonialFormProps {
  initialTestimonial?: TestimonialDB | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditTestimonialForm({
  initialTestimonial,
  onClose,
  onSuccess,
}: EditTestimonialFormProps): React.JSX.Element {
  const [name, setName] = React.useState(initialTestimonial?.name || "");
  const [role, setRole] = React.useState(initialTestimonial?.role || "");
  const [avatar, setAvatar] = React.useState(initialTestimonial?.avatar || "");
  const [quote, setQuote] = React.useState(initialTestimonial?.quote || "");
  const [isFeatured, setIsFeatured] = React.useState(initialTestimonial?.isFeatured || false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file, "cmhcb-media");
      setAvatar(publicUrl);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to upload avatar image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isUploading) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        id: initialTestimonial?.id,
        name,
        role,
        avatar,
        quote,
        isFeatured,
      };

      const res = await upsertTestimonialAction(payload);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Failed to save success story.");
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-sm font-sans">
      <div className="flex items-center justify-between border-b border-muted pb-4">
        <div className="flex flex-col">
          <h3 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2">
            <HiChatBubbleLeftRight className="w-5 h-5 text-primary" />
            {initialTestimonial ? "Edit Success Story" : "Add Success Story"}
          </h3>
          {initialTestimonial?.lastUpdatedBy && (
            <span className="text-[11px] text-light-ash/70 mt-0.5">
              Last updated by <span className="font-semibold text-primary">{initialTestimonial.lastUpdatedBy}</span> on {initialTestimonial.updatedAt ? new Date(initialTestimonial.updatedAt).toLocaleString() : ""}
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
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-dark">Client Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Emily Rodriguez"
            className="w-full px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
            required
          />
        </div>

        {/* Role */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-dark">Role / Designation</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Nurse / Teacher"
            className="w-full px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
            required
          />
        </div>
      </div>

      {/* Avatar Image */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-light-ash/5 p-4 rounded-xl border border-muted/50">
        {avatar && (
          <Image src={avatar} alt="Avatar Preview" width={64} height={64} className="w-16 h-16 rounded-full object-cover border border-primary shrink-0" />
        )}
        <div className="flex-1 flex flex-col gap-1">
          <label className="font-semibold text-dark flex items-center gap-1.5">
            <HiPhoto className="w-4 h-4 text-primary" />
            Client Avatar Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 text-xs text-light-ash cursor-pointer"
            disabled={isUploading || isSubmitting}
            required={!avatar}
          />
        </div>
        {isUploading && <span className="text-xs text-primary font-medium animate-pulse">Uploading...</span>}
      </div>

      {/* Quote */}
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-dark">Client Quote / Success Story</label>
        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          rows={5}
          placeholder="Enter the client's quote or details of their healing journey..."
          className="w-full px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors resize-y"
          required
        />
      </div>

      {/* Featured Flag */}
      <div className="flex items-center gap-3 border border-muted/40 p-3.5 rounded-xl bg-light-ash/5">
        <input
          type="checkbox"
          id="isFeatured"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          className="w-4 h-4 text-primary border-muted rounded focus:ring-primary cursor-pointer"
        />
        <label htmlFor="isFeatured" className="text-dark font-medium cursor-pointer select-none">
          Feature on Landing Page Success Story Section
        </label>
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
          {isSubmitting ? "Saving..." : "Save Story"}
        </button>
      </div>
    </form>
  );
}