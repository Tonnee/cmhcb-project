"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiPhoto, HiCheck, HiExclamationTriangle, HiArrowTopRightOnSquare } from "react-icons/hi2";
import { uploadImageToSupabase } from "@/lib/supabase";
import { upsertTrainingCtaAction } from "@/app/(admin)/admin/actions";
import { type TrainingPageContentDB } from "./edit-training-hero-form";

interface EditTrainingCtaFormProps {
  initialContent?: TrainingPageContentDB | null;
}

const DEFAULT_CTA = {
  ctaTitle: "Take The Next Step - Schedule Your Appointment",
  ctaDescription:
    "We're here to support you, let's work together to create a path toward healing, growth, and balance.",
  ctaImage: "/pages-hero-background/1.png",
  ctaImageAlt: "Make an appointment background",
  ctaButtonText: "Book an Appointment",
  ctaButtonHref: "/appointment",
};

export function EditTrainingCtaForm({
  initialContent,
}: EditTrainingCtaFormProps): React.JSX.Element {
  const router = useRouter();

  const [ctaTitle, setCtaTitle] = React.useState(
    initialContent?.ctaTitle || DEFAULT_CTA.ctaTitle
  );
  const [ctaDescription, setCtaDescription] = React.useState(
    initialContent?.ctaDescription || DEFAULT_CTA.ctaDescription
  );
  const [ctaImage, setCtaImage] = React.useState(
    initialContent?.ctaImage || DEFAULT_CTA.ctaImage
  );
  const [ctaImageAlt, setCtaImageAlt] = React.useState(
    initialContent?.ctaImageAlt || DEFAULT_CTA.ctaImageAlt
  );
  const [ctaButtonText, setCtaButtonText] = React.useState(
    initialContent?.ctaButtonText || DEFAULT_CTA.ctaButtonText
  );
  const [ctaButtonHref, setCtaButtonHref] = React.useState(
    initialContent?.ctaButtonHref || DEFAULT_CTA.ctaButtonHref
  );

  const [previewUrl, setPreviewUrl] = React.useState(
    initialContent?.ctaImage || DEFAULT_CTA.ctaImage
  );
  const [pendingFile, setPendingFile] = React.useState<File | null>(null);

  const [isUploading, setIsUploading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (initialContent) {
      setCtaTitle(initialContent.ctaTitle || DEFAULT_CTA.ctaTitle);
      setCtaDescription(initialContent.ctaDescription || DEFAULT_CTA.ctaDescription);
      setCtaImage(initialContent.ctaImage || DEFAULT_CTA.ctaImage);
      setPreviewUrl(initialContent.ctaImage || DEFAULT_CTA.ctaImage);
      setCtaImageAlt(initialContent.ctaImageAlt || DEFAULT_CTA.ctaImageAlt);
      setCtaButtonText(initialContent.ctaButtonText || DEFAULT_CTA.ctaButtonText);
      setCtaButtonHref(initialContent.ctaButtonHref || DEFAULT_CTA.ctaButtonHref);
    }
  }, [initialContent]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingFile(file);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const publicUrl = await uploadImageToSupabase(file, "cmhcb-media");
      setCtaImage(publicUrl);
      setPreviewUrl(publicUrl);
    } catch (err: unknown) {
      setError(
        (err instanceof Error ? err.message : String(err)) ||
          "Failed to upload image. Please verify Supabase credentials."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isUploading) return;

    if (!ctaTitle.trim()) {
      setError("CTA title is required.");
      return;
    }

    if (!ctaDescription.trim()) {
      setError("CTA description is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      let finalImageUrl = ctaImage;
      if (pendingFile && (!finalImageUrl || finalImageUrl.startsWith("blob:"))) {
        setIsUploading(true);
        try {
          finalImageUrl = await uploadImageToSupabase(pendingFile, "cmhcb-media");
          setCtaImage(finalImageUrl);
          setPreviewUrl(finalImageUrl);
        } catch (uploadErr) {
          setError(
            (uploadErr instanceof Error ? uploadErr.message : String(uploadErr)) ||
              "Failed to upload CTA image."
          );
          setIsSubmitting(false);
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      if (!finalImageUrl) {
        setError("CTA background image is required.");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        ctaTitle: ctaTitle.trim(),
        ctaDescription: ctaDescription.trim(),
        ctaImage: finalImageUrl.trim(),
        ctaImageAlt: ctaImageAlt.trim() || DEFAULT_CTA.ctaImageAlt,
        ctaButtonText: ctaButtonText.trim() || DEFAULT_CTA.ctaButtonText,
        ctaButtonHref: ctaButtonHref.trim() || DEFAULT_CTA.ctaButtonHref,
      };

      const res = await upsertTrainingCtaAction(payload);
      if (res.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(res.error || "Failed to update Appointment CTA.");
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-muted/50 rounded-2xl p-6 md:p-8 shadow-xs text-sm font-sans flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-muted/60 pb-4">
        <div>
          <h2 className="font-marcellus text-xl font-bold text-dark-green">
            Appointment Call to Action (CTA) Section
          </h2>
          <p className="font-sans text-xs text-light-ash mt-0.5">
            Configure the background image, headline, description, and button for the Appointment CTA banner.
          </p>
        </div>

        {initialContent?.lastUpdatedBy && (
          <span className="text-[11px] text-light-ash/80 bg-light-ash/5 px-3 py-1.5 rounded-lg border border-muted/60">
            Last updated by <strong className="text-primary">{initialContent.lastUpdatedBy}</strong>
            {initialContent.updatedAt && (
              <> on {new Date(initialContent.updatedAt).toLocaleDateString()} {new Date(initialContent.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</>
            )}
          </span>
        )}
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-sans font-medium border border-emerald-200 flex items-center gap-2">
          <HiCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Appointment CTA banner has been successfully saved and published!</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-sm font-sans font-medium border border-rose-200 flex items-center gap-2">
          <HiExclamationTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Title & Description Inputs */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs flex items-center justify-between">
              <span>CTA Headline / Title <span className="text-red-500">*</span></span>
              <span className="text-[11px] text-light-ash font-normal">Main callout heading</span>
            </label>
            <input
              type="text"
              value={ctaTitle}
              onChange={(e) => {
                setCtaTitle(e.target.value);
                setSuccess(false);
              }}
              placeholder="e.g. Take The Next Step - Schedule Your Appointment"
              className="w-full px-4 py-2.5 border border-muted rounded-xl bg-page-bg/40 focus:bg-white focus:outline-none focus:border-primary text-sm font-sans transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs flex items-center justify-between">
              <span>CTA Subtitle / Description Paragraph <span className="text-red-500">*</span></span>
              <span className="text-[11px] text-light-ash font-normal">Supporting descriptive message</span>
            </label>
            <textarea
              value={ctaDescription}
              onChange={(e) => {
                setCtaDescription(e.target.value);
                setSuccess(false);
              }}
              rows={3}
              placeholder="Enter supporting paragraph for the CTA..."
              className="w-full px-4 py-2.5 border border-muted rounded-xl bg-page-bg/40 focus:bg-white focus:outline-none focus:border-primary text-sm font-sans transition-colors resize-y min-h-22.5"
              required
            />
          </div>

          {/* Button Text & Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-dark text-xs">
                Button Label Text
              </label>
              <input
                type="text"
                value={ctaButtonText}
                onChange={(e) => {
                  setCtaButtonText(e.target.value);
                  setSuccess(false);
                }}
                placeholder="e.g. Book an Appointment"
                className="w-full px-4 py-2.5 border border-muted rounded-xl bg-page-bg/40 focus:bg-white focus:outline-none focus:border-primary text-sm font-sans transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-dark text-xs">
                Button Target Link / URL
              </label>
              <input
                type="text"
                value={ctaButtonHref}
                onChange={(e) => {
                  setCtaButtonHref(e.target.value);
                  setSuccess(false);
                }}
                placeholder="e.g. /appointment"
                className="w-full px-4 py-2.5 border border-muted rounded-xl bg-page-bg/40 focus:bg-white focus:outline-none focus:border-primary text-sm font-mono transition-colors"
              />
            </div>
          </div>
        </div>

        {/* CTA Background Image */}
        <div className="flex flex-col gap-3 bg-light-ash/5 p-4 md:p-5 rounded-2xl border border-muted/70">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-dark text-xs flex items-center gap-1.5">
              <HiPhoto className="w-4 h-4 text-primary" />
              CTA Background Image <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-light-ash">
              Recommended: <strong>1920×1080 px</strong> • Max 10MB (.jpg, .png, .webp)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Image Preview Box */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-muted bg-dark-green/10 flex items-center justify-center">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={ctaImageAlt || "CTA Background Preview"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-light-ash">No image selected</span>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-dark-green/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold">
                  Uploading image to storage...
                </div>
              )}
            </div>

            {/* Image Inputs */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-dark">Upload New Image File</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  disabled={isUploading || isSubmitting}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 text-xs text-light-ash font-sans cursor-pointer w-full bg-white border border-muted rounded-xl p-1"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-dark">Or Image URL / Path</span>
                <input
                  type="text"
                  value={ctaImage}
                  onChange={(e) => {
                    setCtaImage(e.target.value);
                    setPreviewUrl(e.target.value);
                    setSuccess(false);
                  }}
                  placeholder="/pages-hero-background/1.png or https://..."
                  className="w-full px-3.5 py-2 border border-muted rounded-xl bg-white focus:outline-none focus:border-primary text-xs font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-dark">Image Alt Text (Accessibility & SEO)</span>
                <input
                  type="text"
                  value={ctaImageAlt}
                  onChange={(e) => {
                    setCtaImageAlt(e.target.value);
                    setSuccess(false);
                  }}
                  placeholder="Describe background image for screen readers"
                  className="w-full px-3.5 py-2 border border-muted rounded-xl bg-white focus:outline-none focus:border-primary text-xs font-sans"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Visual Preview Box */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-dark">Live Layout Preview</span>
          <div className="relative w-full rounded-2xl overflow-hidden py-12 px-6 flex items-center justify-center text-center shadow-xs">
            {previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={ctaImageAlt || "Background"}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(1, 30, 0, 0.73)" }}
              aria-hidden="true"
            />
            <div className="relative z-10 max-w-xl flex flex-col items-center">
              <h3 className="font-marcellus text-2xl md:text-3xl text-white font-medium mb-3">
                {ctaTitle || DEFAULT_CTA.ctaTitle}
              </h3>
              <p className="font-sans text-xs md:text-sm text-white/90 mb-6 line-clamp-3">
                {ctaDescription || DEFAULT_CTA.ctaDescription}
              </p>
              <span className="inline-block bg-white text-dark-green font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm">
                {ctaButtonText || DEFAULT_CTA.ctaButtonText}
              </span>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between border-t border-muted pt-5 mt-2">
          <button
            type="button"
            onClick={() => {
              setCtaTitle(initialContent?.ctaTitle || DEFAULT_CTA.ctaTitle);
              setCtaDescription(initialContent?.ctaDescription || DEFAULT_CTA.ctaDescription);
              setCtaImage(initialContent?.ctaImage || DEFAULT_CTA.ctaImage);
              setPreviewUrl(initialContent?.ctaImage || DEFAULT_CTA.ctaImage);
              setCtaImageAlt(initialContent?.ctaImageAlt || DEFAULT_CTA.ctaImageAlt);
              setCtaButtonText(initialContent?.ctaButtonText || DEFAULT_CTA.ctaButtonText);
              setCtaButtonHref(initialContent?.ctaButtonHref || DEFAULT_CTA.ctaButtonHref);
              setError(null);
              setSuccess(false);
            }}
            disabled={isSubmitting || isUploading}
            className="text-xs text-light-ash hover:text-dark underline cursor-pointer disabled:opacity-50"
          >
            Reset to Saved Values
          </button>

          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="bg-primary hover:bg-primary-dark text-white font-sans text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-60 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving Changes...
              </>
            ) : isUploading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading Media...
              </>
            ) : (
              <>
                <HiCheck className="w-4 h-4" />
                Save CTA Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
