"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { uploadImageToSupabase } from "@/lib/supabase";
import { upsertContactPageContentAction } from "@/app/(admin)/admin/actions";

interface ContactPageContent {
  id: string;
  heroTitle?: string | null;
  heroDescription?: string | null;
  heroImage?: string | null;
  heroImageAlt?: string | null;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  mapEmbedUrl: string;
  lastUpdatedBy?: string | null;
  updatedAt?: Date | string | null;
}

interface EditContactPageFormProps {
  initialContent: ContactPageContent;
}

export default function EditContactPageForm({
  initialContent,
}: EditContactPageFormProps): React.JSX.Element {
  const router = useRouter();

  const [heroTitle, setHeroTitle] = React.useState(initialContent.heroTitle || "Contact Us");
  const [heroDescription, setHeroDescription] = React.useState(
    initialContent.heroDescription || "We'd love to hear from you. Please reach out with any questions or inquiries."
  );
  const [heroImage, setHeroImage] = React.useState(
    initialContent.heroImage || "/hero-image/contact-us-banner.png"
  );
  const [heroImageAlt, setHeroImageAlt] = React.useState(
    initialContent.heroImageAlt || "Contact Center for Mental Health and Care Bangladesh"
  );
  const [previewUrl, setPreviewUrl] = React.useState(
    initialContent.heroImage || "/hero-image/contact-us-banner.png"
  );
  const [pendingFile, setPendingFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const [phone, setPhone] = React.useState(initialContent.phone);
  const [email, setEmail] = React.useState(initialContent.email);
  const [addressLine1, setAddressLine1] = React.useState(initialContent.addressLine1);
  const [addressLine2, setAddressLine2] = React.useState(initialContent.addressLine2);
  const [addressLine3, setAddressLine3] = React.useState(initialContent.addressLine3);
  
  const [facebookUrl, setFacebookUrl] = React.useState(initialContent.facebookUrl);
  const [instagramUrl, setInstagramUrl] = React.useState(initialContent.instagramUrl);
  const [twitterUrl, setTwitterUrl] = React.useState(initialContent.twitterUrl);
  const [linkedinUrl, setLinkedinUrl] = React.useState(initialContent.linkedinUrl);
  
  const [mapEmbedUrl, setMapEmbedUrl] = React.useState(initialContent.mapEmbedUrl);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingFile(file);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    setIsUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file, "cmhcb-media");
      setHeroImage(publicUrl);
      setPreviewUrl(publicUrl);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to upload hero image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      let finalHeroImage = heroImage;
      if (pendingFile && (!finalHeroImage || finalHeroImage.startsWith("blob:"))) {
        setIsUploading(true);
        try {
          finalHeroImage = await uploadImageToSupabase(pendingFile, "cmhcb-media");
          setHeroImage(finalHeroImage);
          setPreviewUrl(finalHeroImage);
        } catch {
          setError("Failed to upload hero image.");
          setIsSubmitting(false);
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      const res = await upsertContactPageContentAction({
        heroTitle,
        heroDescription,
        heroImage: finalHeroImage,
        heroImageAlt,
        phone,
        email,
        addressLine1,
        addressLine2,
        addressLine3,
        facebookUrl,
        instagramUrl,
        twitterUrl,
        linkedinUrl,
        mapEmbedUrl,
      });

      if (res.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(res.error || "Failed to update contact page content.");
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl bg-white border border-muted rounded-2xl p-6 md:p-8 shadow-sm font-sans text-sm">
      {initialContent.lastUpdatedBy && (
        <span className="text-[11px] text-light-ash/70 -mb-2">
          Last updated by <span className="font-semibold text-primary">{initialContent.lastUpdatedBy}</span> on {initialContent.updatedAt ? new Date(initialContent.updatedAt).toLocaleString() : ""}
        </span>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-sans font-medium border border-emerald-100">
          Contact page details updated successfully.
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-sm font-sans font-medium border border-rose-100">
          {error}
        </div>
      )}

      {/* Hero Section Banner */}
      <div className="flex flex-col gap-4 border-b border-muted/80 pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Hero Section Banner</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Hero Title</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm font-sans"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Hero Image Alt Text</label>
            <input
              type="text"
              value={heroImageAlt}
              onChange={(e) => setHeroImageAlt(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm font-sans"
              placeholder="e.g. Contact Center for Mental Health and Care Bangladesh"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-dark text-xs">Hero Description</label>
          <textarea
            value={heroDescription}
            onChange={(e) => setHeroDescription(e.target.value)}
            className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm font-sans h-20 resize-none"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center bg-light/10 p-4 rounded-xl border border-muted/50 mt-2">
          {(previewUrl || heroImage) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl || heroImage}
              alt="Hero Preview"
              className="w-full md:w-48 max-h-32 object-cover rounded-xl border border-muted"
            />
          )}
          <div className="flex-1 flex flex-col gap-1">
            <span className="font-semibold text-dark text-xs">Hero Background Image</span>
            <span className="text-[11px] text-light-ash">
              Recommended: <strong>1920×1080 px</strong> (16:9 ratio) • Format: <strong>.jpg, .png, .webp</strong> (Max 10MB)
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 text-xs text-light-ash mt-0.5"
              disabled={isUploading}
            />
          </div>
          {isUploading && (
            <span className="text-xs text-primary font-medium animate-pulse">Uploading image...</span>
          )}
        </div>
      </div>

      {/* Main details */}
      <div className="flex flex-col gap-4 border-b border-muted/80 pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Primary Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="flex flex-col gap-4 border-b border-muted/80 pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Clinic Address</h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Address Line 1</label>
            <input
              type="text"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="e.g. CMHC Office Room, 78/2 (2nd Floor)"
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Address Line 2</label>
            <input
              type="text"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="e.g. New Airport Road, Tejkunipara"
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Address Line 3</label>
            <input
              type="text"
              value={addressLine3}
              onChange={(e) => setAddressLine3(e.target.value)}
              placeholder="e.g. Tejgoan, Dhaka-1212"
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="flex flex-col gap-4 border-b border-muted/80 pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Social Networks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Facebook URL</label>
            <input
              type="text"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Instagram URL</label>
            <input
              type="text"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Twitter / X URL</label>
            <input
              type="text"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">LinkedIn URL</label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Map Embed URL */}
      <div className="flex flex-col gap-4">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Map Location Iframe</h2>
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-dark text-xs">Google Map Embed Link (src attribute)</label>
          <textarea
            value={mapEmbedUrl}
            onChange={(e) => setMapEmbedUrl(e.target.value)}
            placeholder="Paste Google Maps iframe 'src' URL here..."
            className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary h-20 resize-none"
            required
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end border-t border-muted pt-6 mt-4">
        <button
          type="submit"
          className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl cursor-pointer disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Contact Info"}
        </button>
      </div>
    </form>
  );
}
