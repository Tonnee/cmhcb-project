"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiPhoto, HiGlobeAlt, HiInboxStack, HiArrowsUpDown } from "react-icons/hi2";
import { uploadImageToSupabase } from "@/lib/supabase";
import { updateLandingPageContentAction } from "@/app/(admin)/admin/actions";

interface LandingPageContentDB {
  id: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroBgImage: string;
  heroFigureImage: string;
  wellbeingHeadline: string;
  wellbeingSubtitle: string;
  experienceCount: number;
  happyClientsCount: number;
  sessionsCount: number;
  satisfactionRate: number;
  trainingHeadline: string;
  trainingSubtitle: string;
  trainingImage: string;
}

interface EditLandingPageFormProps {
  initialContent: LandingPageContentDB;
}

export default function EditLandingPageForm({
  initialContent,
}: EditLandingPageFormProps): React.JSX.Element {
  const router = useRouter();
  
  // State variables for form fields
  const [heroHeadline, setHeroHeadline] = React.useState(initialContent.heroHeadline);
  const [heroSubtitle, setHeroSubtitle] = React.useState(initialContent.heroSubtitle);
  const [heroBgImage, setHeroBgImage] = React.useState(initialContent.heroBgImage);
  const [heroFigureImage, setHeroFigureImage] = React.useState(initialContent.heroFigureImage);
  
  const [wellbeingHeadline, setWellbeingHeadline] = React.useState(initialContent.wellbeingHeadline);
  const [wellbeingSubtitle, setWellbeingSubtitle] = React.useState(initialContent.wellbeingSubtitle);
  
  const [experienceCount, setExperienceCount] = React.useState(initialContent.experienceCount);
  const [happyClientsCount, setHappyClientsCount] = React.useState(initialContent.happyClientsCount);
  const [sessionsCount, setSessionsCount] = React.useState(initialContent.sessionsCount);
  const [satisfactionRate, setSatisfactionRate] = React.useState(initialContent.satisfactionRate);

  const [trainingHeadline, setTrainingHeadline] = React.useState(initialContent.trainingHeadline);
  const [trainingSubtitle, setTrainingSubtitle] = React.useState(initialContent.trainingSubtitle);
  const [trainingImage, setTrainingImage] = React.useState(initialContent.trainingImage);

  // Status indicators
  const [isUploadingBg, setIsUploadingBg] = React.useState(false);
  const [isUploadingFigure, setIsUploadingFigure] = React.useState(false);
  const [isUploadingTraining, setIsUploadingTraining] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // File Upload Handlers
  const handleUploadBg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBg(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file, "cmhcb-media");
      setHeroBgImage(publicUrl);
    } catch (err: any) {
      setError(err.message || "Failed to upload hero background banner.");
    } finally {
      setIsUploadingBg(false);
    }
  };

  const handleUploadFigure = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingFigure(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file, "cmhcb-media");
      setHeroFigureImage(publicUrl);
    } catch (err: any) {
      setError(err.message || "Failed to upload hero figure illustration.");
    } finally {
      setIsUploadingFigure(false);
    }
  };

  const handleUploadTraining = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingTraining(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file, "cmhcb-media");
      setTrainingImage(publicUrl);
    } catch (err: any) {
      setError(err.message || "Failed to upload training display image.");
    } finally {
      setIsUploadingTraining(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await updateLandingPageContentAction({
        heroHeadline,
        heroSubtitle,
        heroBgImage,
        heroFigureImage,
        wellbeingHeadline,
        wellbeingSubtitle,
        experienceCount: Number(experienceCount),
        happyClientsCount: Number(happyClientsCount),
        sessionsCount: Number(sessionsCount),
        satisfactionRate: Number(satisfactionRate),
        trainingHeadline,
        trainingSubtitle,
        trainingImage,
      });

      if (res.success) {
        setSuccess(true);
        router.refresh();
        // Hide success message after 4s
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError(res.error || "Failed to save landing page changes.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Dynamic feedback messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-sans text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl font-sans text-sm font-semibold">
          Landing page customizations saved successfully! Your changes are now live.
        </div>
      )}

      {/* Hero Section Customs */}
      <div className="bg-white border border-muted p-6 rounded-2xl shadow-sm flex flex-col gap-6">
        <h2 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2 border-b border-muted pb-3">
          <HiGlobeAlt className="w-5 h-5 text-primary" />
          Hero Banner Customization
        </h2>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Hero Headline (HTML Support)
            </label>
            <input
              type="text"
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              required
            />
            <p className="font-sans text-[10px] text-light-ash/80 mt-1">
              Add highlight spans like: <code>&lt;span class="text-accent"&gt;Mind&lt;/span&gt;</code> or <code>&lt;span class="text-primary"&gt;Life&lt;/span&gt;</code>
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Hero Subtitle / Tagline
            </label>
            <textarea
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={3}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors resize-y"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BG Banner Image Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-dark">
                Hero Background Banner
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-14 bg-light/30 border border-muted rounded-lg overflow-hidden shrink-0">
                  {heroBgImage ? (
                    <img src={heroBgImage} alt="Hero BG" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-light-ash/50">
                      <HiPhoto className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-muted hover:border-primary/60 rounded-xl px-4 py-3 bg-light/10 hover:bg-primary/5 cursor-pointer transition-colors duration-200">
                  <span className="font-sans text-xs text-primary font-semibold">
                    {isUploadingBg ? "Uploading..." : "Upload New Banner"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadBg}
                    className="hidden"
                    disabled={isUploadingBg}
                  />
                </label>
              </div>
            </div>

            {/* Figure Image Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-semibold text-dark">
                Hero Figure Illustration
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-14 bg-light/30 border border-muted rounded-lg overflow-hidden shrink-0">
                  {heroFigureImage ? (
                    <img src={heroFigureImage} alt="Hero Figure" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-light-ash/50">
                      <HiPhoto className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-muted hover:border-primary/60 rounded-xl px-4 py-3 bg-light/10 hover:bg-primary/5 cursor-pointer transition-colors duration-200">
                  <span className="font-sans text-xs text-primary font-semibold">
                    {isUploadingFigure ? "Uploading..." : "Upload New Illustration"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadFigure}
                    className="hidden"
                    disabled={isUploadingFigure}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Well Being Section Customs */}
      <div className="bg-white border border-muted p-6 rounded-2xl shadow-sm flex flex-col gap-6">
        <h2 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2 border-b border-muted pb-3">
          <HiInboxStack className="w-5 h-5 text-primary" />
          Well-Being Commitment Block
        </h2>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Well-Being Title (HTML Support)
            </label>
            <input
              type="text"
              value={wellbeingHeadline}
              onChange={(e) => setWellbeingHeadline(e.target.value)}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Well-Being Subtitle / Paragraph
            </label>
            <textarea
              value={wellbeingSubtitle}
              onChange={(e) => setWellbeingSubtitle(e.target.value)}
              rows={3}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors resize-y"
              required
            />
          </div>
        </div>
      </div>

      {/* Well Being Animated Statistics Counters */}
      <div className="bg-white border border-muted p-6 rounded-2xl shadow-sm flex flex-col gap-6">
        <h2 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2 border-b border-muted pb-3">
          <HiArrowsUpDown className="w-5 h-5 text-primary" />
          Animated Statistics Counters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Years of Experience
            </label>
            <input
              type="number"
              value={experienceCount}
              onChange={(e) => setExperienceCount(Number(e.target.value))}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              min={0}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Happy Clients count
            </label>
            <input
              type="number"
              value={happyClientsCount}
              onChange={(e) => setHappyClientsCount(Number(e.target.value))}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              min={0}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Sessions Conducted
            </label>
            <input
              type="number"
              value={sessionsCount}
              onChange={(e) => setSessionsCount(Number(e.target.value))}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              min={0}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Satisfaction Positive (%)
            </label>
            <input
              type="number"
              value={satisfactionRate}
              onChange={(e) => setSatisfactionRate(Number(e.target.value))}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              min={0}
              max={100}
              required
            />
          </div>
        </div>
      </div>

      {/* Training Section Customization */}
      <div className="bg-white border border-muted p-6 rounded-2xl shadow-sm flex flex-col gap-6">
        <h2 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2 border-b border-muted pb-3">
          <HiInboxStack className="w-5 h-5 text-primary" />
          Training Section Customization
        </h2>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Training Title (HTML Support)
            </label>
            <input
              type="text"
              value={trainingHeadline}
              onChange={(e) => setTrainingHeadline(e.target.value)}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Training Description / Subtitle
            </label>
            <textarea
              value={trainingSubtitle}
              onChange={(e) => setTrainingSubtitle(e.target.value)}
              rows={3}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors resize-y"
              required
            />
          </div>

          {/* Training Image Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Training Display Image
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-24 bg-light/30 border border-muted rounded-lg overflow-hidden shrink-0">
                {trainingImage ? (
                  <img src={trainingImage} alt="Training Display" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-light-ash/50">
                    <HiPhoto className="w-6 h-6" />
                  </div>
                )}
              </div>
              <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-muted hover:border-primary/60 rounded-xl px-4 py-3 bg-light/10 hover:bg-primary/5 cursor-pointer transition-colors duration-200">
                <span className="font-sans text-xs text-primary font-semibold">
                  {isUploadingTraining ? "Uploading..." : "Upload New Image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadTraining}
                  className="hidden"
                  disabled={isUploadingTraining}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Save bar */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white font-sans text-sm font-semibold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-50"
          disabled={isSubmitting || isUploadingBg || isUploadingFigure || isUploadingTraining}
        >
          {isSubmitting ? "Saving Content..." : "Save Customizations"}
        </button>
      </div>
    </form>
  );
}
