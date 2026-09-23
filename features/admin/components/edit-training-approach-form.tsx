"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiPhoto, HiCheck, HiExclamationTriangle, HiArrowTopRightOnSquare, HiLink } from "react-icons/hi2";
import { uploadImageToSupabase } from "@/lib/supabase";
import { upsertTrainingApproachAction } from "@/app/(admin)/admin/actions";
import { type TrainingPageContentDB } from "./edit-training-hero-form";

interface EditTrainingApproachFormProps {
  initialContent?: TrainingPageContentDB | null;
}

const DEFAULT_APPROACH = {
  approachTitle: "Our Approach",
  approachDescription:
    "Customising programs are available for institutions, professionals, families, individuals, and organizations looking to define issues and related issues around mental health knowledge.",
  approachImage: "/mental-health-training-program.png",
  approachImageAlt: "Mental health training and workshop program at CMHCB",
  approachCtaLabel: "Download Brochure",
  approachCtaHref: "#",
};

export function EditTrainingApproachForm({
  initialContent,
}: EditTrainingApproachFormProps): React.JSX.Element {
  const router = useRouter();

  const [approachTitle, setApproachTitle] = React.useState(
    initialContent?.approachTitle || DEFAULT_APPROACH.approachTitle
  );
  const [approachDescription, setApproachDescription] = React.useState(
    initialContent?.approachDescription || DEFAULT_APPROACH.approachDescription
  );
  const [approachImage, setApproachImage] = React.useState(
    initialContent?.approachImage || DEFAULT_APPROACH.approachImage
  );
  const [approachImageAlt, setApproachImageAlt] = React.useState(
    initialContent?.approachImageAlt || DEFAULT_APPROACH.approachImageAlt
  );
  const [approachCtaLabel, setApproachCtaLabel] = React.useState(
    initialContent?.approachCtaLabel || DEFAULT_APPROACH.approachCtaLabel
  );
  const [approachCtaHref, setApproachCtaHref] = React.useState(
    initialContent?.approachCtaHref || DEFAULT_APPROACH.approachCtaHref
  );

  const [previewUrl, setPreviewUrl] = React.useState(
    initialContent?.approachImage || DEFAULT_APPROACH.approachImage
  );
  const [pendingFile, setPendingFile] = React.useState<File | null>(null);

  const [isUploading, setIsUploading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // Sync if initialContent changes
  React.useEffect(() => {
    if (initialContent) {
      setApproachTitle(initialContent.approachTitle || DEFAULT_APPROACH.approachTitle);
      setApproachDescription(initialContent.approachDescription || DEFAULT_APPROACH.approachDescription);
      setApproachImage(initialContent.approachImage || DEFAULT_APPROACH.approachImage);
      setPreviewUrl(initialContent.approachImage || DEFAULT_APPROACH.approachImage);
      setApproachImageAlt(initialContent.approachImageAlt || DEFAULT_APPROACH.approachImageAlt);
      setApproachCtaLabel(initialContent.approachCtaLabel || DEFAULT_APPROACH.approachCtaLabel);
      setApproachCtaHref(initialContent.approachCtaHref || DEFAULT_APPROACH.approachCtaHref);
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
      setApproachImage(publicUrl);
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

    if (!approachTitle.trim()) {
      setError("Approach title is required.");
      return;
    }

    if (!approachDescription.trim()) {
      setError("Approach description is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      let finalImageUrl = approachImage;
      if (pendingFile && (!finalImageUrl || finalImageUrl.startsWith("blob:"))) {
        setIsUploading(true);
        try {
          finalImageUrl = await uploadImageToSupabase(pendingFile, "cmhcb-media");
          setApproachImage(finalImageUrl);
          setPreviewUrl(finalImageUrl);
        } catch (uploadErr) {
          setError(
            (uploadErr instanceof Error ? uploadErr.message : String(uploadErr)) ||
              "Failed to upload approach image."
          );
          setIsSubmitting(false);
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      if (!finalImageUrl) {
        setError("Approach image is required.");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        approachTitle: approachTitle.trim(),
        approachDescription: approachDescription.trim(),
        approachImage: finalImageUrl.trim(),
        approachImageAlt: approachImageAlt.trim() || DEFAULT_APPROACH.approachImageAlt,
        approachCtaLabel: approachCtaLabel.trim() || DEFAULT_APPROACH.approachCtaLabel,
        approachCtaHref: approachCtaHref.trim() || DEFAULT_APPROACH.approachCtaHref,
      };

      const res = await upsertTrainingApproachAction(payload);
      if (res.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(res.error || "Failed to update Training approach block.");
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-muted rounded-2xl p-6 md:p-8 shadow-xs text-sm font-sans flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-muted pb-4">
        <div>
          <h2 className="font-marcellus text-xl font-bold text-dark-green">
            Training Approach Block
          </h2>
          <p className="font-sans text-xs text-light-ash mt-0.5">
            Configure the 2-column &ldquo;Our Approach&rdquo; card and feature photo displayed at the bottom of the training programs grid on{" "}
            <a
              href="/training"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1 font-semibold"
            >
              /training <HiArrowTopRightOnSquare className="w-3 h-3" />
            </a>
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
          <span>Training Approach block has been successfully saved and published!</span>
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
              <span>Approach Block Title <span className="text-red-500">*</span></span>
              <span className="text-[11px] text-light-ash font-normal">Section card heading</span>
            </label>
            <input
              type="text"
              value={approachTitle}
              onChange={(e) => {
                setApproachTitle(e.target.value);
                setSuccess(false);
              }}
              placeholder="e.g. Our Approach"
              className="w-full px-4 py-2.5 border border-muted rounded-xl bg-page-bg/40 focus:bg-white focus:outline-hidden focus:border-primary text-sm font-sans transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs flex items-center justify-between">
              <span>Approach Description Paragraph <span className="text-red-500">*</span></span>
              <span className="text-[11px] text-light-ash font-normal">Curriculum and customized training summary</span>
            </label>
            <textarea
              value={approachDescription}
              onChange={(e) => {
                setApproachDescription(e.target.value);
                setSuccess(false);
              }}
              rows={4}
              placeholder="Enter details on customizable programs and mental health training..."
              className="w-full px-4 py-2.5 border border-muted rounded-xl bg-page-bg/40 focus:bg-white focus:outline-hidden focus:border-primary text-sm font-sans transition-colors resize-y min-h-[90px]"
              required
            />
          </div>

          {/* CTA Button Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-light-ash/5 p-4 rounded-2xl border border-muted/70">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-dark text-xs flex items-center gap-1.5">
                <HiLink className="w-4 h-4 text-primary" />
                Button Label
              </label>
              <input
                type="text"
                value={approachCtaLabel}
                onChange={(e) => {
                  setApproachCtaLabel(e.target.value);
                  setSuccess(false);
                }}
                placeholder="e.g. Download Brochure"
                className="w-full px-4 py-2 border border-muted rounded-xl bg-white focus:outline-hidden focus:border-primary text-sm font-sans"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-dark text-xs flex items-center gap-1.5">
                <HiLink className="w-4 h-4 text-primary" />
                Button Link / URL
              </label>
              <input
                type="text"
                value={approachCtaHref}
                onChange={(e) => {
                  setApproachCtaHref(e.target.value);
                  setSuccess(false);
                }}
                placeholder="e.g. # or /contact or /brochure.pdf"
                className="w-full px-4 py-2 border border-muted rounded-xl bg-white focus:outline-hidden focus:border-primary text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Feature Image */}
        <div className="flex flex-col gap-3 bg-light-ash/5 p-4 md:p-5 rounded-2xl border border-muted/70">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-dark text-xs flex items-center gap-1.5">
              <HiPhoto className="w-4 h-4 text-primary" />
              Approach Feature Photo <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-light-ash">
              Recommended: <strong>800×600 px</strong> (4:3) • Max 10MB (.jpg, .png, .webp)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Image Preview Box */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-muted bg-dark-green/10 flex items-center justify-center">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={approachImageAlt || "Approach Preview"}
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
                  value={approachImage}
                  onChange={(e) => {
                    setApproachImage(e.target.value);
                    setPreviewUrl(e.target.value);
                    setSuccess(false);
                  }}
                  placeholder="/mental-health-training-program.png or https://..."
                  className="w-full px-3.5 py-2 border border-muted rounded-xl bg-white focus:outline-hidden focus:border-primary text-xs font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-dark">Image Alt Text (Accessibility & SEO)</span>
                <input
                  type="text"
                  value={approachImageAlt}
                  onChange={(e) => {
                    setApproachImageAlt(e.target.value);
                    setSuccess(false);
                  }}
                  placeholder="Describe the photo for screen readers"
                  className="w-full px-3.5 py-2 border border-muted rounded-xl bg-white focus:outline-hidden focus:border-primary text-xs font-sans"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between border-t border-muted pt-5 mt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setApproachTitle(initialContent?.approachTitle || DEFAULT_APPROACH.approachTitle);
                setApproachDescription(initialContent?.approachDescription || DEFAULT_APPROACH.approachDescription);
                setApproachImage(initialContent?.approachImage || DEFAULT_APPROACH.approachImage);
                setPreviewUrl(initialContent?.approachImage || DEFAULT_APPROACH.approachImage);
                setApproachImageAlt(initialContent?.approachImageAlt || DEFAULT_APPROACH.approachImageAlt);
                setApproachCtaLabel(initialContent?.approachCtaLabel || DEFAULT_APPROACH.approachCtaLabel);
                setApproachCtaHref(initialContent?.approachCtaHref || DEFAULT_APPROACH.approachCtaHref);
                setError(null);
                setSuccess(false);
              }}
              disabled={isSubmitting || isUploading}
              className="text-xs text-light-ash hover:text-dark underline cursor-pointer disabled:opacity-50"
            >
              Reset to Saved Values
            </button>
            <span className="text-light-ash/40">•</span>
            <button
              type="button"
              onClick={() => {
                setApproachTitle(DEFAULT_APPROACH.approachTitle);
                setApproachDescription(DEFAULT_APPROACH.approachDescription);
                setApproachImage(DEFAULT_APPROACH.approachImage);
                setPreviewUrl(DEFAULT_APPROACH.approachImage);
                setApproachImageAlt(DEFAULT_APPROACH.approachImageAlt);
                setApproachCtaLabel(DEFAULT_APPROACH.approachCtaLabel);
                setApproachCtaHref(DEFAULT_APPROACH.approachCtaHref);
                setError(null);
                setSuccess(false);
              }}
              disabled={isSubmitting || isUploading}
              className="text-xs text-light-ash hover:text-dark underline cursor-pointer disabled:opacity-50"
            >
              Reset to Default Copy
            </button>
          </div>

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
                Save Approach Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
