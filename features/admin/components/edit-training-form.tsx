"use client";
import Image from "next/image";

import * as React from "react";
import { HiPlus, HiTrash, HiXMark, HiUserGroup } from "react-icons/hi2";
import { upsertTrainingAction, getAllTherapistsForFormAction } from "@/app/(admin)/admin/actions";
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


export const AVAILABLE_TRAINING_ICONS = [
  { value: "HiPlusCircle", label: "Plus Circle (Crisis / First Aid)" },
  { value: "HiFaceFrown", label: "Face / Emotion (Anger / Stress)" },
  { value: "HiArrowsPointingOut", label: "Arrows Pointing Out (Stress Management)" },
  { value: "HiSun", label: "Sun (Relaxation / Mind & Body)" },
  { value: "HiStar", label: "Star (Confidence / Development)" },
  { value: "HiHandRaised", label: "Hand Raised (Behavior / Boundary)" },
  { value: "HiAcademicCap", label: "Academic Cap (Professional Certification)" },
  { value: "HiBookOpen", label: "Book Open (Skills & Education)" },
  { value: "HiSparkles", label: "Sparkles (Wellness & Growth)" },
  { value: "HiUserGroup", label: "User Group (Community / Group Dynamics)" },
  { value: "HiHeart", label: "Heart (Empathy & Emotional Care)" },
  { value: "HiPuzzlePiece", label: "Puzzle Piece (Cognitive & Skill Building)" },
  { value: "HiBriefcase", label: "Briefcase (Workplace & Institutional)" },
  { value: "HiShieldCheck", label: "Shield Check (Safety & Ethics)" },
  { value: "HiGlobeAlt", label: "Globe (Outreach & Public Programs)" },
];

interface EditTrainingFormProps {
  training?: TrainingDB | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditTrainingForm({
  training,
  onClose,
  onSuccess,
}: EditTrainingFormProps): React.JSX.Element {
  // Simple field states
  const [title, setTitle] = React.useState(training?.title || "");
  const [slug, setSlug] = React.useState(training?.slug || "");
  const [heroTitle, setHeroTitle] = React.useState(training?.heroTitle || "");
  const [heroDescription, setHeroDescription] = React.useState(training?.heroDescription || "");
  const [introTitle, setIntroTitle] = React.useState(training?.introTitle || "");
  const [introDescription, setIntroDescription] = React.useState(training?.introDescription || "");
  const [duration, setDuration] = React.useState(training?.duration || "");
  const [fees, setFees] = React.useState(training?.fees || "");
  const [format, setFormat] = React.useState(training?.format || "In-person / Online (if applicable)");
  const [language, setLanguage] = React.useState(training?.language || "Bangla / English");
  const [variant, setVariant] = React.useState<string>(training?.variant || "primary");
  const [icon, setIcon] = React.useState(training?.icon || "HiAcademicCap");
  const [imageUrl, setImageUrl] = React.useState(training?.bgImage || training?.image || "");
  const [order, setOrder] = React.useState(training?.order ?? 0);

  // Available therapists from database
  const [allTherapists, setAllTherapists] = React.useState<{ id: string; name: string; role: string }[]>([]);

  React.useEffect(() => {
    getAllTherapistsForFormAction().then((res) => {
      if (res.success && res.data) {
        setAllTherapists(res.data);
      }
    });
  }, []);

  // Selected trainers list state
  const [selectedTrainers, setSelectedTrainers] = React.useState<string[]>(() => {
    try {
      return training?.trainers ? JSON.parse(training.trainers) : [];
    } catch {
      return [];
    }
  });

  // Complex list states (parsed from JSON on load)
  const [features, setFeatures] = React.useState<string[]>(() => {
    try {
      if (training?.features) {
        const parsedFeat = typeof training.features === "string" ? JSON.parse(training.features) : training.features;
        if (Array.isArray(parsedFeat) && parsedFeat.length > 0) return parsedFeat;
      }
      if (training?.sections) {
        const parsedSecs = typeof training.sections === "string" ? JSON.parse(training.sections) : training.sections;
        if (Array.isArray(parsedSecs)) {
          const whoSec = parsedSecs.find((s: any) => s.title?.toLowerCase().includes("who"));
          if (whoSec && Array.isArray(whoSec.items)) return whoSec.items;
        }
      }
    } catch {}
    return [];
  });

  const [learnItems, setLearnItems] = React.useState<string[]>(() => {
    try {
      if (training?.sections) {
        const parsedSecs = typeof training.sections === "string" ? JSON.parse(training.sections) : training.sections;
        if (Array.isArray(parsedSecs)) {
          const learnSec = parsedSecs.find((s: any) =>
            s.title?.toLowerCase().includes("learn") || s.title?.toLowerCase().includes("what")
          );
          if (learnSec && Array.isArray(learnSec.items)) {
            return learnSec.items;
          }
        }
      }
    } catch {}
    return [];
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
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  // Auto-generate slug from Title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!training) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
      setHeroTitle(val);
    }
  };

  // Feature bullets actions (Who Should Attend)
  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const updateFeature = (index: number, val: string) => {
    const updated = [...features];
    updated[index] = val;
    setFeatures(updated);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // What You Will Learn actions
  const addLearnItem = () => {
    setLearnItems([...learnItems, ""]);
  };

  const updateLearnItem = (index: number, val: string) => {
    const updated = [...learnItems];
    updated[index] = val;
    setLearnItems(updated);
  };

  const removeLearnItem = (index: number) => {
    setLearnItems(learnItems.filter((_, i) => i !== index));
  };

  // Trainer actions
  const addTrainer = (therapistId: string) => {
    if (therapistId && !selectedTrainers.includes(therapistId)) {
      setSelectedTrainers([...selectedTrainers, therapistId]);
    }
  };

  const removeTrainer = (therapistId: string) => {
    setSelectedTrainers(selectedTrainers.filter((id) => id !== therapistId));
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
  const [previewUrl, setPreviewUrl] = React.useState(training?.bgImage || training?.image || "");
  const [pendingFile, setPendingFile] = React.useState<File | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPendingFile(file);
    setPreviewUrl(localPreview);
    setIsUploading(true);
    setErrorMsg("");

    try {
      const publicUrl = await uploadImageToSupabase(file);
      setImageUrl(publicUrl);
      setPreviewUrl(publicUrl);
    } catch (err: unknown) {
      setErrorMsg((err instanceof Error ? err.message : String(err)) || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    const finalSlug = slug || training?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    if (!title.trim()) {
      setErrorMsg("Program title is required.");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");

    try {
      let finalImageUrl = imageUrl;
      if (pendingFile && (!finalImageUrl || finalImageUrl.startsWith("blob:"))) {
        setIsUploading(true);
        try {
          finalImageUrl = await uploadImageToSupabase(pendingFile);
          setImageUrl(finalImageUrl);
          setPreviewUrl(finalImageUrl);
        } catch (uploadErr) {
          setErrorMsg((uploadErr instanceof Error ? uploadErr.message : String(uploadErr)) || "Failed to upload training image.");
          setIsSaving(false);
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      const cleanFeatures = features.filter((f) => f.trim().length > 0);
      const cleanLearnItems = learnItems.filter((f) => f.trim().length > 0);

      const otherSections = sections.filter(
        (s) =>
          !s.title?.toLowerCase().includes("who") &&
          !s.title?.toLowerCase().includes("learn") &&
          !s.title?.toLowerCase().includes("what")
      );

      const builtSections: Section[] = [];
      if (cleanFeatures.length > 0) {
        builtSections.push({
          title: "Who Should Attend?",
          items: cleanFeatures,
        });
      }
      if (cleanLearnItems.length > 0) {
        builtSections.push({
          title: "What You Will Learn",
          items: cleanLearnItems,
        });
      }
      builtSections.push(...otherSections);

      const payload = {
        id: training?.id,
        title,
        slug: finalSlug,
        heroTitle: heroTitle || title,
        heroDescription: heroDescription || "",
        introTitle: introTitle || `What Is ${title}?`,
        introDescription: introDescription || heroDescription || "",
        sections: builtSections.length > 0 ? builtSections : [],
        faq: faq.length > 0 ? faq : [],
        features: cleanFeatures,
        trainers: selectedTrainers,
        duration: duration || "",
        fees: fees || "",
        format: format || null,
        language: language || null,
        variant: variant || "primary",
        icon: icon || "HiAcademicCap",
        image: finalImageUrl || null,
        bgImage: finalImageUrl || null,
        order: Number(order) || 0,
      };

      const res = await upsertTrainingAction(payload);
      if (res.success) {
        onSuccess();
        onClose();
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
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">Program Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Psychological First Aid"
              className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-dark">Session Duration</label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 2 Days / 16 Hrs"
                className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-dark">Course Fees</label>
              <input
                type="text"
                required
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                placeholder="e.g. BDT 5,000"
                className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-dark">Training Type</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm cursor-pointer"
              >
                <option value="In-person / Online (if applicable)">In-person / Online (if applicable)</option>
                <option value="Online">Online</option>
                <option value="In-person">In-person</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-dark">Training Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm cursor-pointer"
              >
                <option value="Bangla / English">Bangla / English</option>
                <option value="Bangla">Bangla</option>
                <option value="English">English</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="font-semibold text-dark flex items-center justify-between">
                <span>Icon Representation</span>
                <span className="text-xs text-primary font-normal">Appears in header megamenu & badges</span>
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm cursor-pointer"
              >
                {AVAILABLE_TRAINING_ICONS.map((i) => (
                  <option key={i.value} value={i.value}>
                    {i.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Our Top Trainers Selector */}
          <div className="flex flex-col gap-3 pt-2 bg-light/10 p-4 rounded-2xl border border-muted/50">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-semibold text-dark text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <HiUserGroup className="w-4 h-4 text-primary" />
                  Our Top Trainers (Shown on Program Detail Page)
                </label>
                <p className="text-[11px] text-light-ash">
                  Select therapists from the dropdown to assign them as the featured trainers for this program.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    addTrainer(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="w-full px-3.5 py-2 border border-muted rounded-xl bg-white focus:outline-none focus:border-primary text-xs cursor-pointer"
              >
                <option value="" disabled>-- Select a therapist to add as Top Trainer --</option>
                {allTherapists.map((therapist) => (
                  <option
                    key={therapist.id}
                    value={therapist.id}
                    disabled={selectedTrainers.includes(therapist.id)}
                  >
                    {therapist.name} ({therapist.role}) {selectedTrainers.includes(therapist.id) ? "✓ Added" : ""}
                  </option>
                ))}
              </select>
            </div>

            {selectedTrainers.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedTrainers.map((trainerId) => {
                  const therapist = allTherapists.find((t) => t.id === trainerId);
                  const displayName = therapist ? `${therapist.name} (${therapist.role})` : trainerId;
                  return (
                    <div
                      key={trainerId}
                      className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary-dark px-3 py-1.5 rounded-xl text-xs font-medium"
                    >
                      <span>{displayName}</span>
                      <button
                        type="button"
                        onClick={() => removeTrainer(trainerId)}
                        className="p-0.5 hover:bg-primary/20 rounded-md text-red-600 cursor-pointer"
                        title="Remove trainer"
                      >
                        <HiXMark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-light-ash italic">
                No specific trainers selected. (If none are selected, therapists with &quot;Trainer&quot; in their role will be shown by default).
              </div>
            )}
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

          {/* Who Should Attend? / Bullet Points List (placed right after Intro Details Description) */}
          <div className="flex flex-col gap-3 pt-2 bg-light/10 p-4 rounded-2xl border border-muted/50">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-semibold text-dark text-xs uppercase tracking-wide">
                  Who Should Attend? (Bullet Points List)
                </label>
                <p className="text-[11px] text-light-ash">
                  Bullet points displayed under Who Should Attend? on the training page and cards.
                </p>
              </div>
              <button
                type="button"
                onClick={addFeature}
                className="text-primary hover:text-primary-dark font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                <HiPlus className="w-3.5 h-3.5" /> Add Bullet Point
              </button>
            </div>
            {features.length > 0 ? (
              <div className="flex flex-col gap-2">
                {features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => updateFeature(fIdx, e.target.value)}
                      placeholder="e.g. Core skills and practical techniques covered..."
                      className="flex-1 px-3 py-1.5 border border-muted bg-white focus:outline-none focus:border-primary rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(fIdx)}
                      className="p-1 text-light-ash hover:text-red-600 rounded-lg cursor-pointer"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-light-ash italic">
                No bullet points added yet. Click &ldquo;Add Bullet Point&rdquo; to add key items.
              </div>
            )}
          </div>

          {/* What You Will Learn / Bullet Points List */}
          <div className="flex flex-col gap-3 pt-2 bg-light/10 p-4 rounded-2xl border border-muted/50">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-semibold text-dark text-xs uppercase tracking-wide">
                  What You Will Learn (Bullet Points List)
                </label>
                <p className="text-[11px] text-light-ash">
                  Bullet points displayed under What You Will Learn on the training detail page.
                </p>
              </div>
              <button
                type="button"
                onClick={addLearnItem}
                className="text-primary hover:text-primary-dark font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                <HiPlus className="w-3.5 h-3.5" /> Add Bullet Point
              </button>
            </div>
            {learnItems.length > 0 ? (
              <div className="flex flex-col gap-2">
                {learnItems.map((item, lIdx) => (
                  <div key={lIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateLearnItem(lIdx, e.target.value)}
                      placeholder="e.g. Core skills, techniques, and topics covered..."
                      className="flex-1 px-3 py-1.5 border border-muted bg-white focus:outline-none focus:border-primary rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeLearnItem(lIdx)}
                      className="p-1 text-light-ash hover:text-red-600 rounded-lg cursor-pointer"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-light-ash italic">
                No bullet points added yet. Click &ldquo;Add Bullet Point&rdquo; to add key items.
              </div>
            )}
          </div>
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

        {/* 6. Single Image Upload section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2">
            Program Display & Hero Image
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-light/10 p-4 rounded-xl border border-muted/50">
            <div className="relative w-36 h-24 bg-light-ash/10 rounded-xl overflow-hidden border border-muted/60 flex items-center justify-center shrink-0">
              {(previewUrl || imageUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl || imageUrl}
                  alt="Program Banner Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-light-ash/60 gap-1 text-center p-2">
                  <span className="text-[9px] font-semibold">No Program Image</span>
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-1 w-full">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-dark text-xs">Hero & Card Image</span>
                {(previewUrl || imageUrl) && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl("");
                      setPreviewUrl("");
                      setPendingFile(null);
                    }}
                    className="text-[11px] text-red-500 hover:text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <span className="text-[11px] text-light-ash">
                Recommended Size: <strong>1200×800 px</strong> (3:2 ratio) • Format: <strong>.jpg, .png, .webp</strong> (Max 10MB)
              </span>
              <span className="text-[10px] text-light-ash/80 italic">
                * Note: This hero banner image will also be used as the featured program card image across the site.
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 text-xs text-light-ash mt-1 cursor-pointer"
                disabled={isUploading}
              />
            </div>
            {isUploading && <span className="text-[10px] text-primary animate-pulse shrink-0">Uploading...</span>}
          </div>
        </div>

        {/* Modal actions footer */}
        <div className="flex items-center justify-end gap-3 border-t border-muted pt-5 mt-4 shrink-0 bg-light/5 p-4 -mx-6 -mb-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-muted text-light-ash hover:bg-light text-xs font-semibold rounded-xl"
            disabled={isSaving || isUploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
            disabled={isSaving || isUploading}
          >
            {isSaving ? "Saving..." : "Save Program"}
          </button>
        </div>
      </form>
    </div>
  );
}