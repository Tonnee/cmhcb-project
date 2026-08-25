"use client";
import Image from "next/image";

import * as React from "react";
import { HiPlus, HiTrash, HiXMark } from "react-icons/hi2";
import { upsertTrainingAction } from "@/app/(admin)/admin/actions";
import { uploadImageToSupabase } from "@/lib/supabase";

import type { TrainingDB } from "./trainings-client-wrapper";

interface Section {
  title: string;
  items: string[];
}

interface FAQItem {
  question: string;
  answer: string;
}

interface EditTrainingFormProps {
  training?: TrainingDB | null;
  onClose: () => void;
  onSuccess: (savedTraining?: TrainingDB) => void;
}

export function EditTrainingForm({
  training,
  onClose,
  onSuccess,
}: EditTrainingFormProps): React.JSX.Element {
  // Simple field states
  const [title, setTitle] = React.useState(training?.title || "");
  const [slug, setSlug] = React.useState(training?.slug || "");
  const [isSlugCustom, setIsSlugCustom] = React.useState(Boolean(training?.slug));
  const [heroTitle, setHeroTitle] = React.useState(training?.heroTitle || "");
  const [heroDescription, setHeroDescription] = React.useState(training?.heroDescription || "");
  const [introTitle, setIntroTitle] = React.useState(training?.introTitle || "");
  const [introDescription, setIntroDescription] = React.useState(training?.introDescription || "");
  const [duration, setDuration] = React.useState(training?.duration || "");
  const [fees, setFees] = React.useState(training?.fees || "");
  const [variant, setVariant] = React.useState(training?.variant || "primary");
  const [imageUrl, setImageUrl] = React.useState(training?.image || "");
  const [bgImageUrl, setBgImageUrl] = React.useState(training?.bgImage || "");
  const [order, setOrder] = React.useState(training?.order ?? 0);

  // Complex list states (parsed from JSON on load)
  const [features, setFeatures] = React.useState<string[]>(() => {
    try {
      return training ? JSON.parse(training.features) : [];
    } catch {
      return [];
    }
  });

  const [sections, setSections] = React.useState<Section[]>(() => {
    try {
      return training ? JSON.parse(training.sections) : [];
    } catch {
      return [];
    }
  });

  const [faq, setFaq] = React.useState<FAQItem[]>(() => {
    try {
      return training ? JSON.parse(training.faq) : [];
    } catch {
      return [];
    }
  });

  // Status states
  const [isUploading, setIsUploading] = React.useState(false);
  const [isUploadingBg, setIsUploadingBg] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  // Auto-generate slug from Title if not customized
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!training && !isSlugCustom) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
    if (!training && !heroTitle) {
      setHeroTitle(val);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugCustom(true);
    const val = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-");
    setSlug(val);
  };

  // Section actions
  const addSection = () => {
    setSections([...sections, { title: "New Section Outline", items: ["Section bullet item description"] }]);
  };

  const updateSectionTitle = (secIndex: number, newTitle: string) => {
    const updated = [...sections];
    updated[secIndex].title = newTitle;
    setSections(updated);
  };

  const removeSection = (secIndex: number) => {
    setSections(sections.filter((_, i) => i !== secIndex));
  };

  // Section items actions
  const addSectionItem = (secIndex: number) => {
    const updated = [...sections];
    updated[secIndex].items.push("New topic description");
    setSections(updated);
  };

  const updateSectionItem = (secIndex: number, itemIndex: number, newVal: string) => {
    const updated = [...sections];
    updated[secIndex].items[itemIndex] = newVal;
    setSections(updated);
  };

  const removeSectionItem = (secIndex: number, itemIndex: number) => {
    const updated = [...sections];
    updated[secIndex].items.splice(itemIndex, 1);
    setSections(updated);
  };

  // FAQ actions
  const addFaqItem = () => {
    setFaq([...faq, { question: "Frequently asked question?", answer: "Detail answer goes here..." }]);
  };

  const updateFaqItem = (idx: number, key: keyof FAQItem, val: string) => {
    const updated = [...faq];
    updated[idx] = { ...updated[idx], [key]: val };
    setFaq(updated);
  };

  const removeFaqItem = (idx: number) => {
    setFaq(faq.filter((_, i) => i !== idx));
  };

  // Handle Image Upload
  const [cardPreviewUrl, setCardPreviewUrl] = React.useState(training?.image || "");
  const [bgPreviewUrl, setBgPreviewUrl] = React.useState(training?.bgImage || "");
  const [pendingCardFile, setPendingCardFile] = React.useState<File | null>(null);
  const [pendingBgFile, setPendingBgFile] = React.useState<File | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, isBg: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    if (isBg) {
      setPendingBgFile(file);
      setBgPreviewUrl(localPreview);
      setIsUploadingBg(true);
    } else {
      setPendingCardFile(file);
      setCardPreviewUrl(localPreview);
      setIsUploading(true);
    }
    setErrorMsg("");

    try {
      const publicUrl = await uploadImageToSupabase(file);
      if (isBg) {
        setBgImageUrl(publicUrl);
        setBgPreviewUrl(publicUrl);
      } else {
        setImageUrl(publicUrl);
        setCardPreviewUrl(publicUrl);
      }
    } catch (err: unknown) {
      setErrorMsg((err instanceof Error ? err.message : String(err)) || "Failed to upload image.");
    } finally {
      if (isBg) setIsUploadingBg(false);
      else setIsUploading(false);
    }
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    if (!title || !finalSlug || !heroTitle || !heroDescription || !introTitle || !introDescription || !duration || !fees) {
      setErrorMsg("All core description fields, pricing, and duration are required.");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");

    try {
      let finalCardUrl = imageUrl;
      if (pendingCardFile && (!finalCardUrl || finalCardUrl.startsWith("blob:"))) {
        setIsUploading(true);
        try {
          finalCardUrl = await uploadImageToSupabase(pendingCardFile);
          setImageUrl(finalCardUrl);
          setCardPreviewUrl(finalCardUrl);
        } catch (uploadErr) {
          setErrorMsg("Failed to upload featured card image.");
          setIsSaving(false);
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
          setErrorMsg("Failed to upload hero background image.");
          setIsSaving(false);
          setIsUploadingBg(false);
          return;
        } finally {
          setIsUploadingBg(false);
        }
      }

      const payload = {
        id: training?.id,
        title,
        slug: finalSlug,
        heroTitle,
        heroDescription,
        introTitle,
        introDescription,
        sections,
        faq,
        features,
        duration,
        fees,
        variant,
        image: finalCardUrl || null,
        bgImage: finalBgUrl || null,
        order: Number(order) || 0,
      };

      const res = await upsertTrainingAction(payload);
      if (res.success) {
        onSuccess(res.data);
      } else {
        setErrorMsg(res.error || "Failed to save training program details.");
      }
    } catch (err: unknown) {
      setErrorMsg((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col max-h-[90vh] overflow-hidden font-sans">
      {/* Header with audit meta */}
      <div className="flex items-center justify-between p-5 border-b border-muted shrink-0 bg-light/10">
        <div className="flex flex-col">
          <h2 className="font-marcellus text-xl font-bold text-dark-green">
            {training ? "Edit Training Program" : "Create Training Program"}
          </h2>
          {training?.lastUpdatedBy && (
            <span className="text-[11px] text-light-ash/70 mt-0.5 animate-pulse">
              Last updated by <span className="font-semibold text-primary">{training.lastUpdatedBy}</span> on {training.updatedAt ? new Date(training.updatedAt).toLocaleString() : ""}
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

      {/* Main scrolling form body */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 text-sm">
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-semibold border border-red-100 shrink-0">
            {errorMsg}
          </div>
        )}

        {/* 1. Basics Info section */}
        <div className="flex flex-col gap-4 border-b border-muted pb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">
            Basic Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-dark">Program Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Psychological First Aid"
                className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-dark">URL Slug * (Unique Identifier)</label>
              <div className="flex items-center">
                <span className="bg-muted/30 px-3 py-2 border border-r-0 border-muted rounded-l-xl text-xs text-light-ash font-mono select-none">
                  /training/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="e.g. psychological-first-aid"
                  className="w-full px-3.5 py-2 border border-muted rounded-r-xl bg-page-bg/50 focus:outline-none focus:border-primary font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-dark">Session Duration *</label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 2 Days / 16 Hrs"
                className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-dark">Course Fees *</label>
              <input
                type="text"
                required
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                placeholder="e.g. BDT 5,000"
                className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-dark">Card Variant</label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-xs font-semibold"
              >
                <option value="primary">Primary (Blue/Teal Badge)</option>
                <option value="secondary">Secondary (Green Badge)</option>
                <option value="accent">Accent (Orange/Amber Badge)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-dark">Display Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                placeholder="e.g. 0"
                className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* 2. Hero Configuration section */}
        <div className="flex flex-col gap-4 border-b border-muted pb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">
            Hero Headline Settings
          </h3>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">Hero Banner Title</label>
            <input
              type="text"
              required
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="e.g. Psychological First Aid (PFA)"
              className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">Hero Description</label>
            <textarea
              required
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              placeholder="Provide a compelling hook introducing the training program..."
              className="w-full h-20 px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* 3. Introduction section */}
        <div className="flex flex-col gap-4 border-b border-muted pb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">
            Detailed Introduction
          </h3>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">Intro Headline Title</label>
            <input
              type="text"
              required
              value={introTitle}
              onChange={(e) => setIntroTitle(e.target.value)}
              placeholder="e.g. What Is Psychological First Aid?"
              className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">Intro Details Description</label>
            <textarea
              required
              value={introDescription}
              onChange={(e) => setIntroDescription(e.target.value)}
              placeholder="Write a detailed explanation of the program..."
              className="w-full h-24 px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* 4. What You Will Learn / Course Content Sections */}
        <div className="flex flex-col gap-4 border-b border-muted pb-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">
                What You Will Learn / Course Content Sections
              </h3>
              <span className="text-[11px] text-light-ash pl-2.5">
                Add bulleted sections shown on the training page (e.g. &ldquo;What You Will Learn&rdquo;, &ldquo;Who Should Attend?&rdquo;, &ldquo;Topics Covered&rdquo;).
              </span>
            </div>
            <button
              type="button"
              onClick={addSection}
              className="text-primary hover:text-primary-dark font-semibold text-xs flex items-center gap-1 cursor-pointer shrink-0"
            >
              <HiPlus className="w-4 h-4" /> Add Section
            </button>
          </div>

          {sections.length > 0 ? (
            <div className="flex flex-col gap-4 mt-2">
              {sections.map((sec, secIdx) => (
                <div key={secIdx} className="bg-light/10 border border-muted rounded-2xl p-4 flex flex-col gap-3 relative">
                  <button
                    type="button"
                    onClick={() => removeSection(secIdx)}
                    className="absolute right-4 top-4 text-light-ash hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove Section"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col gap-1 pr-10">
                    <label className="text-xs font-bold text-dark uppercase">Section Header / Title</label>
                    <input
                      type="text"
                      required
                      value={sec.title}
                      onChange={(e) => updateSectionTitle(secIdx, e.target.value)}
                      placeholder="e.g. What You Will Learn (or Who Should Attend?)"
                      className="px-3.5 py-1.5 border border-muted rounded-xl bg-white focus:outline-none focus:border-primary text-sm font-semibold"
                    />
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-light-ash">Bullet points list</label>
                      <button
                        type="button"
                        onClick={() => addSectionItem(secIdx)}
                        className="text-primary hover:text-primary-dark text-xs font-semibold flex items-center gap-0.5 cursor-pointer"
                      >
                        <HiPlus className="w-3.5 h-3.5" /> Add bullet point
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 pl-3">
                      {sec.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            required
                            value={item}
                            onChange={(e) => updateSectionItem(secIdx, itemIdx, e.target.value)}
                            placeholder="e.g. Core skills and practical techniques covered..."
                            className="flex-1 px-3 py-1.5 border border-muted bg-white focus:outline-none rounded-xl text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => removeSectionItem(secIdx, itemIdx)}
                            className="p-1 text-light-ash hover:text-red-600 rounded-lg cursor-pointer"
                          >
                            <HiXMark className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-light-ash border border-dashed border-muted rounded-2xl">
              No sections added yet. Click &ldquo;Add Section&rdquo; to add &ldquo;What You Will Learn&rdquo; or &ldquo;Who Should Attend&rdquo; details.
            </div>
          )}
        </div>

        {/* 5. FAQ Builder section */}
        <div className="flex flex-col gap-4 border-b border-muted pb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">
              Frequently Asked Questions (FAQ)
            </h3>
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
                <div key={idx} className="bg-light/10 border border-muted rounded-2xl p-4 flex flex-col gap-3 relative">
                  <button
                    type="button"
                    onClick={() => removeFaqItem(idx)}
                    className="absolute right-4 top-4 text-light-ash hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition-colors"
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
                      placeholder="e.g. Will I receive a certificate?"
                      className="px-3.5 py-1.5 border border-muted rounded-xl bg-white focus:outline-none focus:border-primary text-sm font-semibold"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-dark uppercase">Answer Details</label>
                    <textarea
                      required
                      value={faqItem.answer}
                      onChange={(e) => updateFaqItem(idx, "answer", e.target.value)}
                      placeholder="e.g. Yes. All participants who complete the full hours receive..."
                      className="w-full h-16 px-3.5 py-1.5 border border-muted bg-white focus:outline-none focus:border-primary text-xs resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-light-ash border border-dashed border-muted rounded-2xl">
              No FAQ items added yet. Click &ldquo;Add FAQ Item&rdquo; to resolve common candidate queries.
            </div>
          )}
        </div>

        {/* 6. Image uploads section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">
            Page Graphics Banner
          </h3>
          <div className="flex flex-col gap-4">
            {/* Row 1: Featured Card Image */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-light/10 p-4 rounded-xl border border-muted/50">
              <div className="relative w-28 h-20 bg-light-ash/10 rounded-xl overflow-hidden border border-muted/60 flex items-center justify-center shrink-0">
                {(cardPreviewUrl || imageUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cardPreviewUrl || imageUrl}
                    alt="Training Card Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-light-ash/60 gap-1">
                    <span className="text-[9px] font-semibold">No Card Image</span>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-1 w-full">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-dark text-xs">Featured Card Image (Optional)</span>
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
                  onChange={(e) => handleImageChange(e, false)}
                  className="file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 text-xs text-light-ash mt-1"
                  disabled={isUploading}
                />
              </div>
              {isUploading && <span className="text-[10px] text-primary animate-pulse shrink-0">Uploading...</span>}
            </div>

            {/* Row 2: Hero Background Image */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-light/10 p-4 rounded-xl border border-muted/50">
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
                    <span className="text-[9px] font-semibold">No Hero Banner</span>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-1 w-full">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-dark text-xs">Hero Background Image</span>
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
                  onChange={(e) => handleImageChange(e, true)}
                  className="file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 text-xs text-light-ash mt-1"
                  disabled={isUploadingBg}
                />
              </div>
              {isUploadingBg && <span className="text-[10px] text-primary animate-pulse shrink-0">Uploading...</span>}
            </div>
          </div>
        </div>

        {/* Modal actions footer */}
        <div className="flex items-center justify-end gap-3 border-t border-muted pt-5 mt-4 shrink-0 bg-light/5 p-4 -mx-6 -mb-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-muted text-light-ash hover:bg-light text-xs font-semibold rounded-xl"
            disabled={isSaving || isUploading || isUploadingBg}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
            disabled={isSaving || isUploading || isUploadingBg}
          >
            {isSaving ? "Saving..." : "Save Program"}
          </button>
        </div>
      </form>
    </div>
  );
}