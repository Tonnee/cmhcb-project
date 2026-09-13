"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiPhoto, HiCheck, HiExclamationTriangle, HiArrowTopRightOnSquare } from "react-icons/hi2";
import { uploadImageToSupabase } from "@/lib/supabase";
import { upsertTherapistsPageContentAction } from "@/app/(admin)/admin/actions";

export interface TherapistsPageContentDB {
  id?: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  heroImageAlt?: string | null;
  lastUpdatedBy?: string | null;
  updatedAt?: Date | string | null;
}

interface EditTherapistsHeroFormProps {
  initialContent?: TherapistsPageContentDB | null;
}

const DEFAULT_HERO = {
  heroTitle: "Meet Our Therapists",
  heroDescription:
    "Our multidisciplinary team of clinical psychologists and counselors brings decades of combined experience in evidence-based care — from CBT and DBT to systemic family therapy and trauma-focused interventions.",
  heroImage: "/experienced-mental-health-therapists.png",
  heroImageAlt: "Experienced mental health therapists and counselors team - CMHCB",
};

export function EditTherapistsHeroForm({
  initialContent,
}: EditTherapistsHeroFormProps): React.JSX.Element {
  const router = useRouter();

  const [heroTitle, setHeroTitle] = React.useState(
    initialContent?.heroTitle || DEFAULT_HERO.heroTitle
  );
  const [heroDescription, setHeroDescription] = React.useState(
    initialContent?.heroDescription || DEFAULT_HERO.heroDescription
  );
  const [heroImage, setHeroImage] = React.useState(
    initialContent?.heroImage || DEFAULT_HERO.heroImage
  );
  const [heroImageAlt, setHeroImageAlt] = React.useState(
    initialContent?.heroImageAlt || DEFAULT_HERO.heroImageAlt
  );

  const [previewUrl, setPreviewUrl] = React.useState(
    initialContent?.heroImage || DEFAULT_HERO.heroImage
  );
  const [pendingFile, setPendingFile] = React.useState<File | null>(null);

  const [isUploading, setIsUploading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (initialContent) {
      setHeroTitle(initialContent.heroTitle || DEFAULT_HERO.heroTitle);
      setHeroDescription(initialContent.heroDescription || DEFAULT_HERO.heroDescription);
      setHeroImage(initialContent.heroImage || DEFAULT_HERO.heroImage);
      setPreviewUrl(initialContent.heroImage || DEFAULT_HERO.heroImage);
      setHeroImageAlt(initialContent.heroImageAlt || DEFAULT_HERO.heroImageAlt);
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
      setHeroImage(publicUrl);
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

    if (!heroTitle.trim()) {
      setError("Hero title is required.");
      return;
    }

    if (!heroDescription.trim()) {
      setError("Hero description is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      let finalImageUrl = heroImage;
      if (pendingFile && (!finalImageUrl || finalImageUrl.startsWith("blob:"))) {
        setIsUploading(true);
        try {
          finalImageUrl = await uploadImageToSupabase(pendingFile, "cmhcb-media");
          setHeroImage(finalImageUrl);
          setPreviewUrl(finalImageUrl);
        } catch (uploadErr) {
          setError(
            (uploadErr instanceof Error ? uploadErr.message : String(uploadErr)) ||
              "Failed to upload hero image."
          );
          setIsSubmitting(false);
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      if (!finalImageUrl) {
        setError("Hero background image is required.");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        heroTitle: heroTitle.trim(),
        heroDescription: heroDescription.trim(),
        heroImage: finalImageUrl.trim(),
        heroImageAlt: heroImageAlt.trim() || DEFAULT_HERO.heroImageAlt,
      };

      const res = await upsertTherapistsPageContentAction(payload);
      if (res.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(res.error || "Failed to update Therapists page hero.");
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-muted/60 pb-4">
        <div>
          <h2 className="font-marcellus text-xl font-bold text-dark-green">
            Therapists Page Hero Header
          </h2>
          <p className="font-sans text-xs text-light-ash mt-0.5">
            Configure the main banner title, descriptive copy, and background image shown at the top of{" "}
            <a
              href="/therapists"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1 font-semibold"
            >
              /therapists <HiArrowTopRightOnSquare className="w-3 h-3" />
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
          <span>Therapists page hero banner has been successfully saved and published!</span>
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
              <span>Hero Main Title / Headline <span className="text-red-500">*</span></span>
              <span className="text-[11px] text-light-ash font-normal">Primary H1 banner heading</span>
            </label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => {
                setHeroTitle(e.target.value);
                setSuccess(false);
              }}
              placeholder="e.g. Meet Our Therapists"
              className="w-full px-4 py-2.5 border border-muted rounded-xl bg-page-bg/40 focus:bg-white focus:outline-none focus:border-primary text-sm font-sans transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs flex items-center justify-between">
              <span>Hero Subtitle / Description Paragraph <span className="text-red-500">*</span></span>
              <span className="text-[11px] text-light-ash font-normal">Supporting paragraph text</span>
            </label>
            <textarea
              value={heroDescription}
              onChange={(e) => {
                setHeroDescription(e.target.value);
                setSuccess(false);
              }}
              rows={3}
              placeholder="Enter a descriptive overview of therapists and clinical team..."
              className="w-full px-4 py-2.5 border border-muted rounded-xl bg-page-bg/40 focus:bg-white focus:outline-none focus:border-primary text-sm font-sans transition-colors resize-y min-h-[90px]"
              required
            />
          </div>
        </div>

        {/* Hero Background Image */}
        <div className="flex flex-col gap-3 bg-light-ash/5 p-4 md:p-5 rounded-2xl border border-muted/70">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-dark text-xs flex items-center gap-1.5">
              <HiPhoto className="w-4 h-4 text-primary" />
              Hero Background Image <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-light-ash">
              Recommended: <strong>1920×1080 px</strong> (16:9) • Max 10MB (.jpg, .png, .webp)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Image Preview Box */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-muted bg-dark-green/10 flex items-center justify-center">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={heroImageAlt || "Hero Preview"}
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
                  value={heroImage}
                  onChange={(e) => {
                    setHeroImage(e.target.value);
                    setPreviewUrl(e.target.value);
                    setSuccess(false);
                  }}
                  placeholder="/experienced-mental-health-therapists.png or https://..."
                  className="w-full px-3.5 py-2 border border-muted rounded-xl bg-white focus:outline-none focus:border-primary text-xs font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-dark">Image Alt Text (Accessibility & SEO)</span>
                <input
                  type="text"
                  value={heroImageAlt}
                  onChange={(e) => {
                    setHeroImageAlt(e.target.value);
                    setSuccess(false);
                  }}
                  placeholder="Describe the image content for screen readers"
                  className="w-full px-3.5 py-2 border border-muted rounded-xl bg-white focus:outline-none focus:border-primary text-xs font-sans"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between border-t border-muted pt-5 mt-2">
          <button
            type="button"
            onClick={() => {
              setHeroTitle(initialContent?.heroTitle || DEFAULT_HERO.heroTitle);
              setHeroDescription(initialContent?.heroDescription || DEFAULT_HERO.heroDescription);
              setHeroImage(initialContent?.heroImage || DEFAULT_HERO.heroImage);
              setPreviewUrl(initialContent?.heroImage || DEFAULT_HERO.heroImage);
              setHeroImageAlt(initialContent?.heroImageAlt || DEFAULT_HERO.heroImageAlt);
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
                Save Hero Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
