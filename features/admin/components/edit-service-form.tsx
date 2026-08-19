"use client";
import Image from "next/image";

import * as React from "react";
import { HiBriefcase, HiPhoto, HiPlus, HiTrash, HiXMark } from "react-icons/hi2";
import { upsertServiceAction } from "@/app/(admin)/admin/actions";
import { uploadImageToSupabase } from "@/lib/supabase";
import { safeJsonParse } from "@/lib/json";

interface FaqItem {
  question: string;
  answer: string;
}

interface ServiceDB {
  id?: string;
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  longDescription: string;
  approach: string;
  isFeatured: boolean;
  image?: string | null;
  bgImage?: string | null;
  duration?: string | null;
  fees?: string | null;
  whoIsItFor?: string | null;
  format?: string | null;
  language?: string | null;
  faqs?: string | null;
  order?: number;
  lastUpdatedBy?: string | null;
  updatedAt?: string | Date;
}

interface EditServiceFormProps {
  initialService?: ServiceDB | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AVAILABLE_ICONS = [
  { value: "HiClipboardDocumentCheck", label: "Clipboard Check (Assessment)" },
  { value: "HiUser", label: "User (Individual)" },
  { value: "HiFaceSmile", label: "Smile (Child)" },
  { value: "HiUsers", label: "Users (Family/Groups)" },
  { value: "HiHeart", label: "Heart (Couple)" },
  { value: "HiAcademicCap", label: "Cap (Cognitive/IQ)" },
  { value: "HiGlobeAlt", label: "Globe (Global/Online)" },
  { value: "HiBookOpen", label: "Book (Education)" },
  { value: "HiSparkles", label: "Sparkles (Wellness)" },
];

export function EditServiceForm({
  initialService,
  onClose,
  onSuccess,
}: EditServiceFormProps): React.JSX.Element {
  const [title, setTitle] = React.useState(initialService?.title || "");
  const [slug, setSlug] = React.useState(initialService?.slug || "");
  const [icon, setIcon] = React.useState(initialService?.icon || "HiUser");
  const [shortDescription, setShortDescription] = React.useState(initialService?.shortDescription || "");
  const [longDescription, setLongDescription] = React.useState(initialService?.longDescription || "");
  const [whoIsItFor, setWhoIsItFor] = React.useState(initialService?.whoIsItFor || "");
  const [approach, setApproach] = React.useState(initialService?.approach || "");
  const [isFeatured, setIsFeatured] = React.useState(initialService?.isFeatured || false);
  const [imageUrl, setImageUrl] = React.useState(initialService?.image || "");
  const [cardPreviewUrl, setCardPreviewUrl] = React.useState(initialService?.image || "");
  const [pendingCardFile, setPendingCardFile] = React.useState<File | null>(null);

  const [bgImageUrl, setBgImageUrl] = React.useState(initialService?.bgImage || "");
  const [bgPreviewUrl, setBgPreviewUrl] = React.useState(initialService?.bgImage || "");
  const [pendingBgFile, setPendingBgFile] = React.useState<File | null>(null);

  const [duration, setDuration] = React.useState(initialService?.duration || "");
  const [fees, setFees] = React.useState(initialService?.fees || "");
  const [format, setFormat] = React.useState(initialService?.format || "In-person & Online");
  const [language, setLanguage] = React.useState(initialService?.language || "English & Bangla");
  const [order, setOrder] = React.useState(initialService?.order ?? 0);

  // FAQs Builder State
  const [faq, setFaq] = React.useState<FaqItem[]>(() =>
    initialService?.faqs ? safeJsonParse<FaqItem[]>(initialService.faqs, []) : []
  );

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isUploadingBg, setIsUploadingBg] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // FAQ builder actions
  const addFaqItem = () => {
    setFaq([...faq, { question: "", answer: "" }]);
  };

  const removeFaqItem = (idx: number) => {
    setFaq(faq.filter((_, i) => i !== idx));
  };

  const updateFaqItem = (idx: number, field: "question" | "answer", val: string) => {
    const updated = [...faq];
    updated[idx] = { ...updated[idx], [field]: val };
    setFaq(updated);
  };

  // Handle Hero Background Image upload
  const handleBgImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingBgFile(file);
    const localPreview = URL.createObjectURL(file);
    setBgPreviewUrl(localPreview);

    setIsUploadingBg(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file);
      setBgImageUrl(publicUrl);
      setBgPreviewUrl(publicUrl);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to upload background image. Ensure Supabase credentials are configured.");
    } finally {
      setIsUploadingBg(false);
    }
  };

  // Handle Image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingCardFile(file);
    const localPreview = URL.createObjectURL(file);
    setCardPreviewUrl(localPreview);

    setIsUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file);
      setImageUrl(publicUrl);
      setCardPreviewUrl(publicUrl);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to upload image. Ensure Supabase credentials are configured.");
    } finally {
      setIsUploading(false);
    }
  };

  // Auto-generate slug from Title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!initialService) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    try {
      let finalCardUrl = imageUrl;
      if (pendingCardFile && (!finalCardUrl || finalCardUrl.startsWith("blob:"))) {
        setIsUploading(true);
        try {
          finalCardUrl = await uploadImageToSupabase(pendingCardFile);
          setImageUrl(finalCardUrl);
          setCardPreviewUrl(finalCardUrl);
        } catch (uploadErr) {
          setError((uploadErr instanceof Error ? uploadErr.message : String(uploadErr)) || "Failed to upload card image.");
          setIsSubmitting(false);
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      let finalBgUrl = bgImageUrl;
      if (pendingBgFile && (!finalBgUrl || finalBgUrl.startsWith("blob:"))) {
        setIsUploadingBg(true);
        try {
          finalBgUrl = await uploadImageToSupabase(pendingBgFile);
          setBgImageUrl(finalBgUrl);
          setBgPreviewUrl(finalBgUrl);
        } catch (uploadErr) {
          setError((uploadErr instanceof Error ? uploadErr.message : String(uploadErr)) || "Failed to upload background image.");
          setIsSubmitting(false);
          setIsUploadingBg(false);
          return;
        } finally {
          setIsUploadingBg(false);
        }
      }

      const payload = {
        id: initialService?.id,
        title,
        slug: finalSlug,
        icon,
        shortDescription,
        longDescription,
        whoIsItFor: whoIsItFor || null,
        approach,
        format: format || null,
        language: language || null,
        faqs: faq.length > 0 ? JSON.stringify(faq) : null,
        isFeatured,
        image: finalCardUrl || null,
        bgImage: finalBgUrl || null,
        duration: duration || null,
        fees: fees || null,
        order: Number(order) || 0,
      };

      const res = await upsertServiceAction(payload);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Failed to save service records.");
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto px-1 py-2">
      <div className="flex items-center justify-between border-b border-muted pb-4">
        <div className="flex flex-col">
          <h3 className="font-marcellus text-xl font-bold text-dark-green flex items-center gap-2">
            <HiBriefcase className="w-5 h-5 text-primary" />
            {initialService ? `Edit Service: ${initialService.title}` : "Add New Psychotherapeutic Service"}
          </h3>
          {initialService?.lastUpdatedBy && (
            <span className="text-[11px] text-light-ash/70 mt-0.5 ml-7">
              Last updated by <span className="font-semibold text-primary">{initialService.lastUpdatedBy}</span> on {initialService.updatedAt ? new Date(initialService.updatedAt).toLocaleString() : ""}
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

      {/* 1. Basic Details */}
      <div className="flex flex-col gap-4 border-b border-muted pb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">
          1. Basic Service Identification
        </h4>
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-semibold text-dark">
            Service Title
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g. Individual Therapy"
            className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Icon Representation
            </label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors cursor-pointer"
            >
              {AVAILABLE_ICONS.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Display Sort Order
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              placeholder="e.g. 0, 1, 2"
              className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-6 pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-dark">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded border-muted text-primary focus:ring-primary w-4 h-4"
            />
            Feature on Home Page Carousel
          </label>
        </div>
      </div>

      {/* 2. Hero & Card Graphics */}
      <div className="flex flex-col gap-5 border-b border-muted pb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">
          2. Media &amp; Graphic Banners
        </h4>
        
        {/* Row 1: Service Card Thumbnail */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-light-ash/5 p-4 rounded-xl border border-muted/50">
          <div className="relative w-28 h-20 bg-light-ash/10 rounded-xl overflow-hidden border border-muted/60 flex items-center justify-center shrink-0">
            {(cardPreviewUrl || imageUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cardPreviewUrl || imageUrl}
                alt="Service Card Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-light-ash/60 gap-1">
                <HiPhoto className="w-6 h-6" />
                <span className="text-[9px] font-semibold">No Card Image</span>
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between">
              <label className="font-sans text-xs font-semibold text-dark flex items-center gap-1.5">
                <HiPhoto className="w-4 h-4 text-primary" />
                Service Card Thumbnail
              </label>
              {(cardPreviewUrl || imageUrl) && (
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl("");
                    setCardPreviewUrl("");
                    setPendingCardFile(null);
                  }}
                  className="text-[11px] text-red-500 hover:text-red-700 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            <span className="text-[11px] text-light-ash">Size: <strong>600×400 px</strong> (3:2 ratio) • Format: <strong>.jpg, .png, .webp</strong> (Max 10MB)</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 text-xs text-light-ash font-sans cursor-pointer mt-1"
              disabled={isUploading || isSubmitting}
            />
          </div>
          {isUploading && <span className="text-xs text-primary font-medium font-sans animate-pulse shrink-0">Uploading image...</span>}
        </div>

        {/* Row 2: Hero Background Banner */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-light-ash/5 p-4 rounded-xl border border-muted/50">
          <div className="relative w-36 h-20 bg-light-ash/10 rounded-xl overflow-hidden border border-muted/60 flex items-center justify-center shrink-0">
            {(bgPreviewUrl || bgImageUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bgPreviewUrl || bgImageUrl}
                alt="Hero Background Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-light-ash/60 gap-1">
                <HiPhoto className="w-6 h-6" />
                <span className="text-[9px] font-semibold">No Hero Banner</span>
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between">
              <label className="font-sans text-xs font-semibold text-dark flex items-center gap-1.5">
                <HiPhoto className="w-4 h-4 text-primary" />
                Hero Background Banner
              </label>
              {(bgPreviewUrl || bgImageUrl) && (
                <button
                  type="button"
                  onClick={() => {
                    setBgImageUrl("");
                    setBgPreviewUrl("");
                    setPendingBgFile(null);
                  }}
                  className="text-[11px] text-red-500 hover:text-red-700 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            <span className="text-[11px] text-light-ash">Size: <strong>1920×1080 px</strong> (16:9 ratio) • Format: <strong>.jpg, .png, .webp</strong> (Max 10MB)</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleBgImageChange}
              className="file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 text-xs text-light-ash font-sans cursor-pointer mt-1"
              disabled={isUploadingBg || isSubmitting}
            />
          </div>
          {isUploadingBg && <span className="text-xs text-primary font-medium font-sans animate-pulse shrink-0">Uploading banner...</span>}
        </div>
      </div>

      {/* 3. Descriptions & Page Hero Content */}
      <div className="flex flex-col gap-4 border-b border-muted pb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">
          3. Detailed Page Content
        </h4>

        {/* Short Summary Description */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="font-sans text-xs font-semibold text-dark">
              Short Summary Description (Hero Subtitle &amp; Directory Preview)
            </label>
            <span className="text-[11px] font-normal text-primary">
              Shown on:{" "}
              <a href="/" target="_blank" rel="noreferrer" className="underline hover:text-primary-dark font-medium">Home Page (/)</a>
              {" & "}
              <a href="/services" target="_blank" rel="noreferrer" className="underline hover:text-primary-dark font-medium">Services Page (/services)</a>
            </span>
          </div>
          <span className="text-[11px] text-light-ash">
            This brief overview is displayed on service cards across the Home Page and the All Services directory.
          </span>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="e.g. Personalized one-on-one therapy to manage stress, build resilience, and improve emotional well-being"
            className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors mt-0.5"
            required
          />
        </div>

        {/* Long Detailed Description */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-semibold text-dark">
            What Is {title || "This Service"}? (Detailed Description)
          </label>
          <span className="text-[11px] text-light-ash">
            This appears as the main introduction section on the service detail page.
          </span>
          <textarea
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            rows={5}
            placeholder="Enter a thorough, compassionate overview of this service..."
            className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors resize-y"
            required
          />
        </div>

        {/* Who Is It For? */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-semibold text-dark">
            Who Is It For? (Enter each bullet point on a new line)
          </label>
          <span className="text-[11px] text-light-ash">
            Each line will be rendered as a bullet point under the &ldquo;Who Is It For?&rdquo; section on the detail page.
          </span>
          <textarea
            value={whoIsItFor}
            onChange={(e) => setWhoIsItFor(e.target.value)}
            rows={4}
            placeholder="e.g. Individuals navigating anxiety, depression, or emotional overwhelm&#10;Adults seeking self-discovery and personal growth&#10;People experiencing life transitions or relationship challenges"
            className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors resize-y font-mono text-xs"
          />
        </div>

        {/* Therapeutic Approach */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs font-semibold text-dark">
            Our Therapeutic Approach (Enter each bullet point on a new line)
          </label>
          <span className="text-[11px] text-light-ash">
            Each line will be rendered as a bullet point under the &ldquo;Our Therapeutic Approach&rdquo; section on the detail page.
          </span>
          <textarea
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
            rows={4}
            placeholder="e.g. Cognitive Behavioral Therapy (CBT) for actionable coping tools&#10;Person-Centered Therapy for a non-judgmental, empathetic environment&#10;Mindfulness-based strategies for stress reduction and self-regulation"
            className="w-full font-sans text-sm px-4 py-2.5 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors resize-y font-mono text-xs"
            required
          />
        </div>
      </div>

      {/* 4. Session Details (Orange Bullet Items) */}
      <div className="flex flex-col gap-4 border-b border-muted pb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">
          4. Session Specifications (Session Details Block)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Duration
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 50 Minutes"
              className="w-full font-sans text-sm px-3.5 py-2 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Standard Fee Rate
            </label>
            <input
              type="text"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              placeholder="e.g. BDT 2,000 / Session"
              className="w-full font-sans text-sm px-3.5 py-2 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Session Format
            </label>
            <input
              type="text"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              placeholder="e.g. In-person & Online"
              className="w-full font-sans text-sm px-3.5 py-2 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-dark">
              Languages
            </label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. English & Bangla"
              className="w-full font-sans text-sm px-3.5 py-2 bg-light-ash/5 border border-muted focus:border-primary focus:bg-white rounded-xl outline-hidden transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 5. FAQ Accordion Builder */}
      <div className="flex flex-col gap-4 border-b border-muted pb-6">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">
            5. Frequently Asked Questions (FAQ) Accordion
          </h4>
          <button
            type="button"
            onClick={addFaqItem}
            className="text-primary hover:text-primary-dark font-semibold text-xs flex items-center gap-1 cursor-pointer"
          >
            <HiPlus className="w-4 h-4" /> Add FAQ Item
          </button>
        </div>

        {faq.length > 0 ? (
          <div className="flex flex-col gap-4 mt-2">
            {faq.map((faqItem, idx) => (
              <div key={idx} className="bg-light-ash/5 border border-muted rounded-2xl p-4 flex flex-col gap-3 relative">
                <button
                  type="button"
                  onClick={() => removeFaqItem(idx)}
                  className="absolute right-4 top-4 text-light-ash hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove FAQ"
                >
                  <HiTrash className="w-4 h-4" />
                </button>

                <div className="flex flex-col gap-1 pr-10">
                  <label className="text-xs font-bold text-dark uppercase">Question</label>
                  <input
                    type="text"
                    required
                    value={faqItem.question}
                    onChange={(e) => updateFaqItem(idx, "question", e.target.value)}
                    placeholder="e.g. How do I know if this therapy is right for me?"
                    className="px-3.5 py-2 border border-muted rounded-xl bg-white focus:outline-none focus:border-primary text-sm font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-dark uppercase">Answer</label>
                  <textarea
                    required
                    value={faqItem.answer}
                    onChange={(e) => updateFaqItem(idx, "answer", e.target.value)}
                    placeholder="e.g. During your initial consultation, our therapist will assess your personal goals..."
                    className="w-full h-16 px-3.5 py-2 border border-muted bg-white focus:outline-none focus:border-primary text-xs resize-none rounded-xl"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-light-ash border border-dashed border-muted rounded-2xl">
            No FAQ items configured yet. Click &ldquo;Add FAQ Item&rdquo; to add interactive FAQs for this service.
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={onClose}
          className="bg-light-ash/10 hover:bg-light-ash/20 text-dark font-sans text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary-dark text-white font-sans text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? "Saving Content..." : "Save Service Details"}
        </button>
      </div>
    </form>
  );
}