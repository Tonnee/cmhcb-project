"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiPhoto, HiGlobeAlt, HiInboxStack, HiArrowsUpDown, HiShare, HiPhone, HiEnvelope, HiMapPin } from "react-icons/hi2";
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn, FaYoutube, FaWhatsapp } from "react-icons/fa6";
import { uploadImageToSupabase } from "@/lib/supabase";
import { updateLandingPageContentAction } from "@/app/(admin)/admin/actions";
import { DEFAULT_FOOTER_SOCIALS, type FooterSocialItem } from "@/data/footer";

const SOCIAL_PLATFORM_ICONS: Record<string, React.JSX.Element> = {
  facebook: <FaFacebookF className="w-4 h-4" />,
  instagram: <FaInstagram className="w-4 h-4" />,
  twitter: <FaXTwitter className="w-4 h-4" />,
  linkedin: <FaLinkedinIn className="w-4 h-4" />,
  youtube: <FaYoutube className="w-4 h-4" />,
  whatsapp: <FaWhatsapp className="w-4 h-4" />,
};

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
  footerSocials?: string | null;
  footerPhone?: string | null;
  footerEmail?: string | null;
  footerAddressLine1?: string | null;
  footerAddressLine2?: string | null;
  footerAddressLine3?: string | null;
  lastUpdatedBy?: string | null;
  updatedAt?: Date | string | null;
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
  const [bgPreviewUrl, setBgPreviewUrl] = React.useState(initialContent.heroBgImage);
  const [pendingBgFile, setPendingBgFile] = React.useState<File | null>(null);

  const [heroFigureImage, setHeroFigureImage] = React.useState(initialContent.heroFigureImage);
  const [figurePreviewUrl, setFigurePreviewUrl] = React.useState(initialContent.heroFigureImage);
  const [pendingFigureFile, setPendingFigureFile] = React.useState<File | null>(null);
  
  const [wellbeingHeadline, setWellbeingHeadline] = React.useState(initialContent.wellbeingHeadline);
  const [wellbeingSubtitle, setWellbeingSubtitle] = React.useState(initialContent.wellbeingSubtitle);
  
  const [experienceCount, setExperienceCount] = React.useState(initialContent.experienceCount);
  const [happyClientsCount, setHappyClientsCount] = React.useState(initialContent.happyClientsCount);
  const [sessionsCount, setSessionsCount] = React.useState(initialContent.sessionsCount);
  const [satisfactionRate, setSatisfactionRate] = React.useState(initialContent.satisfactionRate);

  const [trainingHeadline, setTrainingHeadline] = React.useState(initialContent.trainingHeadline);
  const [trainingSubtitle, setTrainingSubtitle] = React.useState(initialContent.trainingSubtitle);
  const [trainingImage, setTrainingImage] = React.useState(initialContent.trainingImage);
  const [trainingPreviewUrl, setTrainingPreviewUrl] = React.useState(initialContent.trainingImage);
  const [pendingTrainingFile, setPendingTrainingFile] = React.useState<File | null>(null);

  // State variables for footer address, phone & email
  const [footerPhone, setFooterPhone] = React.useState(initialContent.footerPhone || "+8801974349569");
  const [footerEmail, setFooterEmail] = React.useState(initialContent.footerEmail || "info@cmhcbd.com");
  const [footerAddressLine1, setFooterAddressLine1] = React.useState(initialContent.footerAddressLine1 || "CMHC Office Room, 78/2 (2nd Floor)");
  const [footerAddressLine2, setFooterAddressLine2] = React.useState(initialContent.footerAddressLine2 || "New Airport Road, Tejkunipara");
  const [footerAddressLine3, setFooterAddressLine3] = React.useState(initialContent.footerAddressLine3 || "Tejgoan, Dhaka-1212");

  // State variables for footer socials
  const [footerSocials, setFooterSocials] = React.useState<FooterSocialItem[]>(() => {
    if (!initialContent.footerSocials) return DEFAULT_FOOTER_SOCIALS;
    try {
      const parsed = JSON.parse(initialContent.footerSocials);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingPlatforms = new Set(parsed.map((item: Partial<FooterSocialItem>) => item.platform?.toLowerCase()));
        const merged = [...parsed];
        for (const defaultItem of DEFAULT_FOOTER_SOCIALS) {
          if (!existingPlatforms.has(defaultItem.platform?.toLowerCase())) {
            merged.push(defaultItem);
          }
        }
        return merged;
      }
      return DEFAULT_FOOTER_SOCIALS;
    } catch {
      return DEFAULT_FOOTER_SOCIALS;
    }
  });

  const toggleSocialEnabled = (platform: string) => {
    setFooterSocials((prev) =>
      prev.map((item) =>
        item.platform === platform ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const updateSocialHref = (platform: string, href: string) => {
    setFooterSocials((prev) =>
      prev.map((item) =>
        item.platform === platform ? { ...item, href } : item
      )
    );
  };

  const handleToggleAllSocials = (enableAll: boolean) => {
    setFooterSocials((prev) =>
      prev.map((item) => ({ ...item, enabled: enableAll }))
    );
  };

  const handleResetSocials = () => {
    setFooterSocials(DEFAULT_FOOTER_SOCIALS);
  };

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

    setPendingBgFile(file);
    const localPreview = URL.createObjectURL(file);
    setBgPreviewUrl(localPreview);

    setIsUploadingBg(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file, "cmhcb-media");
      setHeroBgImage(publicUrl);
      setBgPreviewUrl(publicUrl);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to upload hero background banner.");
    } finally {
      setIsUploadingBg(false);
    }
  };

  const handleUploadFigure = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingFigureFile(file);
    const localPreview = URL.createObjectURL(file);
    setFigurePreviewUrl(localPreview);

    setIsUploadingFigure(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file, "cmhcb-media");
      setHeroFigureImage(publicUrl);
      setFigurePreviewUrl(publicUrl);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to upload hero figure illustration.");
    } finally {
      setIsUploadingFigure(false);
    }
  };

  const handleUploadTraining = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingTrainingFile(file);
    const localPreview = URL.createObjectURL(file);
    setTrainingPreviewUrl(localPreview);

    setIsUploadingTraining(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file, "cmhcb-media");
      setTrainingImage(publicUrl);
      setTrainingPreviewUrl(publicUrl);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to upload training display image.");
    } finally {
      setIsUploadingTraining(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      let finalBg = heroBgImage;
      if (pendingBgFile && (!finalBg || finalBg.startsWith("blob:"))) {
        setIsUploadingBg(true);
        try {
          finalBg = await uploadImageToSupabase(pendingBgFile, "cmhcb-media");
          setHeroBgImage(finalBg);
          setBgPreviewUrl(finalBg);
        } catch {
          setError("Failed to upload hero background banner.");
          setIsSubmitting(false);
          setIsUploadingBg(false);
          return;
        } finally {
          setIsUploadingBg(false);
        }
      }

      let finalFigure = heroFigureImage;
      if (pendingFigureFile && (!finalFigure || finalFigure.startsWith("blob:"))) {
        setIsUploadingFigure(true);
        try {
          finalFigure = await uploadImageToSupabase(pendingFigureFile, "cmhcb-media");
          setHeroFigureImage(finalFigure);
          setFigurePreviewUrl(finalFigure);
        } catch {
          setError("Failed to upload hero figure image.");
          setIsSubmitting(false);
          setIsUploadingFigure(false);
          return;
        } finally {
          setIsUploadingFigure(false);
        }
      }

      let finalTraining = trainingImage;
      if (pendingTrainingFile && (!finalTraining || finalTraining.startsWith("blob:"))) {
        setIsUploadingTraining(true);
        try {
          finalTraining = await uploadImageToSupabase(pendingTrainingFile, "cmhcb-media");
          setTrainingImage(finalTraining);
          setTrainingPreviewUrl(finalTraining);
        } catch {
          setError("Failed to upload training image.");
          setIsSubmitting(false);
          setIsUploadingTraining(false);
          return;
        } finally {
          setIsUploadingTraining(false);
        }
      }

      const res = await updateLandingPageContentAction({
        heroHeadline,
        heroSubtitle,
        heroBgImage: finalBg,
        heroFigureImage: finalFigure,
        wellbeingHeadline,
        wellbeingSubtitle,
        experienceCount: Number(experienceCount),
        happyClientsCount: Number(happyClientsCount),
        sessionsCount: Number(sessionsCount),
        satisfactionRate: Number(satisfactionRate),
        trainingHeadline,
        trainingSubtitle,
        trainingImage: finalTraining,
        footerSocials: JSON.stringify(footerSocials),
        footerPhone,
        footerEmail,
        footerAddressLine1,
        footerAddressLine2,
        footerAddressLine3,
      });

      if (res.success) {
        setSuccess(true);
        router.refresh();
        // Hide success message after 4s
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError(res.error || "Failed to save landing page changes.");
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {initialContent.lastUpdatedBy && (
        <span className="text-[11px] text-light-ash/70 -mb-4">
          Last updated by <span className="font-semibold text-primary">{initialContent.lastUpdatedBy}</span> on {initialContent.updatedAt ? new Date(initialContent.updatedAt).toLocaleString() : ""}
        </span>
      )}

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
              Hero Headline
            </label>
            <input
              type="text"
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              required
            />
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
              <span className="text-[11px] text-light-ash">Size: <strong>1920×1080 px</strong> (16:9 ratio) • Format: <strong>.jpg, .png, .webp</strong> (Max 10MB)</span>
              <div className="flex items-center gap-4 mt-1">
                <div className="relative w-20 h-14 bg-light/30 border border-muted rounded-lg overflow-hidden shrink-0">
                  {(bgPreviewUrl || heroBgImage) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={bgPreviewUrl || heroBgImage} alt="Hero BG" className="w-full h-full object-cover" />
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
                    accept="image/jpeg,image/png,image/webp,image/gif"
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
              <span className="text-[11px] text-light-ash">Size: <strong>800×800 px</strong> (1:1 / transparent) • Format: <strong>.png, .webp, .svg, .jpg</strong> (Max 10MB)</span>
              <div className="flex items-center gap-4 mt-1">
                <div className="relative w-20 h-14 bg-light/30 border border-muted rounded-lg overflow-hidden shrink-0">
                  {(figurePreviewUrl || heroFigureImage) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={figurePreviewUrl || heroFigureImage} alt="Hero Figure" className="w-full h-full object-cover" />
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
                    accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
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
              Well-Being Title
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
              Training Title
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
            <span className="text-[11px] text-light-ash">Size: <strong>800×600 px</strong> (4:3 ratio) • Format: <strong>.jpg, .png, .webp</strong> (Max 10MB)</span>
            <div className="flex items-center gap-4 mt-1">
              <div className="relative w-20 h-24 bg-light/30 border border-muted rounded-lg overflow-hidden shrink-0">
                {(trainingPreviewUrl || trainingImage) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={trainingPreviewUrl || trainingImage} alt="Training Display" className="w-full h-full object-cover" />
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
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleUploadTraining}
                  className="hidden"
                  disabled={isUploadingTraining}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Social Media Links Customization */}
      <div className="bg-white border border-muted p-6 rounded-2xl shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muted pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <HiShare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2">
                Footer Social Media Links
              </h2>
              <p className="font-sans text-xs text-light-ash">
                Select which social media icons appear in the global website footer and customize their links.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {footerSocials.filter((s) => s.enabled).length} of {footerSocials.length} Active
            </span>
            <button
              type="button"
              onClick={() => handleToggleAllSocials(true)}
              className="text-xs font-sans text-primary hover:text-primary-dark underline cursor-pointer px-1"
            >
              Select All
            </button>
            <span className="text-muted">•</span>
            <button
              type="button"
              onClick={() => handleToggleAllSocials(false)}
              className="text-xs font-sans text-light-ash hover:text-dark underline cursor-pointer px-1"
            >
              Deselect All
            </button>
            <span className="text-muted">•</span>
            <button
              type="button"
              onClick={handleResetSocials}
              className="text-xs font-sans text-light-ash hover:text-dark underline cursor-pointer px-1"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Social Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {footerSocials.map((social) => {
            const icon = SOCIAL_PLATFORM_ICONS[social.platform.toLowerCase()] || <HiShare className="w-4 h-4" />;
            return (
              <div
                key={social.platform}
                className={`flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200 ${
                  social.enabled
                    ? "bg-primary/5 border-primary/30 shadow-xs"
                    : "bg-light-ash/5 border-muted opacity-75"
                }`}
              >
                {/* Header row with toggle */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        social.enabled
                          ? "bg-primary text-white"
                          : "bg-light-ash/20 text-light-ash"
                      }`}
                    >
                      {icon}
                    </div>
                    <div>
                      <span className="font-sans text-sm font-bold text-dark block leading-snug">
                        {social.label}
                      </span>
                      <span
                        className={`text-[11px] font-medium ${
                          social.enabled ? "text-emerald-600" : "text-light-ash"
                        }`}
                      >
                        {social.enabled ? "Visible in footer" : "Hidden in footer"}
                      </span>
                    </div>
                  </div>

                  {/* Toggle switch button */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={social.enabled}
                    aria-label={`Toggle ${social.label} in footer`}
                    onClick={() => toggleSocialEnabled(social.platform)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      social.enabled ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        social.enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* URL Input */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor={`social-url-${social.platform}`}
                    className="font-sans text-[11px] font-semibold text-light-ash"
                  >
                    Target Link / URL
                  </label>
                  <input
                    id={`social-url-${social.platform}`}
                    type="url"
                    value={social.href}
                    onChange={(e) => updateSocialHref(social.platform, e.target.value)}
                    placeholder={`https://${social.platform}.com/...`}
                    disabled={!social.enabled}
                    className={`w-full font-sans text-xs px-3 py-2 rounded-lg border outline-hidden transition-colors ${
                      social.enabled
                        ? "bg-white border-muted focus:border-primary text-dark"
                        : "bg-transparent border-muted/50 text-light-ash/70 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Footer Contact Information Customization */}
      <div className="bg-white border border-muted p-6 rounded-2xl shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muted pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <HiPhone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2">
                Footer Contact Information
              </h2>
              <p className="font-sans text-xs text-light-ash">
                Configure the physical address, contact telephone, and email displayed in the website footer.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setFooterPhone("+8801974349569");
              setFooterEmail("info@cmhcbd.com");
              setFooterAddressLine1("CMHC Office Room, 78/2 (2nd Floor)");
              setFooterAddressLine2("New Airport Road, Tejkunipara");
              setFooterAddressLine3("Tejgoan, Dhaka-1212");
            }}
            className="text-xs font-sans text-light-ash hover:text-dark underline cursor-pointer px-1 self-start sm:self-auto"
          >
            Reset to Default
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone Number */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="footer-phone" className="font-sans text-xs font-semibold text-dark flex items-center gap-1.5">
              <HiPhone className="w-4 h-4 text-primary" />
              Contact Phone Number
            </label>
            <input
              id="footer-phone"
              type="text"
              value={footerPhone}
              onChange={(e) => setFooterPhone(e.target.value)}
              placeholder="+8801974349569"
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              required
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="footer-email" className="font-sans text-xs font-semibold text-dark flex items-center gap-1.5">
              <HiEnvelope className="w-4 h-4 text-primary" />
              Contact Email Address
            </label>
            <input
              id="footer-email"
              type="email"
              value={footerEmail}
              onChange={(e) => setFooterEmail(e.target.value)}
              placeholder="info@cmhcbd.com"
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              required
            />
          </div>
        </div>

        {/* Address Lines */}
        <div className="flex flex-col gap-3">
          <label className="font-sans text-xs font-semibold text-dark flex items-center gap-1.5">
            <HiMapPin className="w-4 h-4 text-primary" />
            Physical Address Lines
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-light-ash font-medium">Line 1 (Building / Room / Floor)</span>
              <input
                type="text"
                value={footerAddressLine1}
                onChange={(e) => setFooterAddressLine1(e.target.value)}
                placeholder="CMHC Office Room, 78/2 (2nd Floor)"
                className="w-full font-sans text-xs px-3.5 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-light-ash font-medium">Line 2 (Street / Road / Area)</span>
              <input
                type="text"
                value={footerAddressLine2}
                onChange={(e) => setFooterAddressLine2(e.target.value)}
                placeholder="New Airport Road, Tejkunipara"
                className="w-full font-sans text-xs px-3.5 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-light-ash font-medium">Line 3 (City / Postal Code)</span>
              <input
                type="text"
                value={footerAddressLine3}
                onChange={(e) => setFooterAddressLine3(e.target.value)}
                placeholder="Tejgoan, Dhaka-1212"
                className="w-full font-sans text-xs px-3.5 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
              />
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