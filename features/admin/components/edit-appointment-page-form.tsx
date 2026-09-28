"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  HiPlus,
  HiTrash,
  HiArrowTopRightOnSquare,
  HiUserGroup,
  HiClock,
  HiShieldCheck,
  HiHeart,
  HiSparkles,
  HiAcademicCap,
  HiCheck,
} from "react-icons/hi2";
import { PhoneIcon } from "@/components/layout/footer-icons";
import { safeJsonParse } from "@/lib/json";
import { upsertAppointmentPageContentAction } from "@/app/(admin)/admin/actions";

export interface FeatureItem {
  title: string;
  description: string;
  iconName?: string;
}

export interface AppointmentPageContentDB {
  id?: string;
  subtitle?: string | null;
  title: string;
  description: string;
  features?: string | null;
  formFields?: string | null;
  lastUpdatedBy?: string | null;
  updatedAt?: string | Date;
}

interface EditAppointmentPageFormProps {
  initialContent?: AppointmentPageContentDB | null;
}

const AVAILABLE_ICONS = [
  { value: "HiUserGroup", label: "User Group (Expert Care / Team)" },
  { value: "HiClock", label: "Clock (Flexible Timing)" },
  { value: "PhoneIcon", label: "Phone (Confidential / Direct Line)" },
  { value: "HiShieldCheck", label: "Shield (Privacy & Safety)" },
  { value: "HiHeart", label: "Heart (Compassionate Care)" },
  { value: "HiSparkles", label: "Sparkles (Holistic Healing)" },
  { value: "HiAcademicCap", label: "Academic Cap (Qualified Psychologists)" },
];

export function renderAdminFeatureIcon(iconName?: string) {
  switch (iconName) {
    case "HiClock":
      return <HiClock className="w-5 h-5 text-primary" />;
    case "PhoneIcon":
    case "phone":
      return <PhoneIcon className="w-5 h-5 text-primary" />;
    case "HiShieldCheck":
      return <HiShieldCheck className="w-5 h-5 text-primary" />;
    case "HiHeart":
      return <HiHeart className="w-5 h-5 text-primary" />;
    case "HiSparkles":
      return <HiSparkles className="w-5 h-5 text-primary" />;
    case "HiAcademicCap":
      return <HiAcademicCap className="w-5 h-5 text-primary" />;
    case "HiUserGroup":
    default:
      return <HiUserGroup className="w-5 h-5 text-primary" />;
  }
}

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    title: "Expert Care",
    description: "Connect with highly qualified mental health professionals.",
    iconName: "HiUserGroup",
  },
  {
    title: "Flexible Timing",
    description: "Choose a time that works best for your schedule.",
    iconName: "HiClock",
  },
  {
    title: "Private & Confidential",
    description: "Your sessions are held in strict professional confidence.",
    iconName: "PhoneIcon",
  },
];

export function EditAppointmentPageForm({
  initialContent,
}: EditAppointmentPageFormProps): React.JSX.Element {
  const router = useRouter();

  const [subtitle, setSubtitle] = React.useState(initialContent?.subtitle || "Get Started");
  const [title, setTitle] = React.useState(initialContent?.title || "Book an Appointment");
  const [description, setDescription] = React.useState(
    initialContent?.description ||
      "Take the first step toward better mental well-being. Choose your preferred therapist, service, and time. Our team is here to support you every step of the way."
  );

  const [features, setFeatures] = React.useState<FeatureItem[]>(() => {
    if (initialContent?.features) {
      const parsed = safeJsonParse<FeatureItem[]>(initialContent.features, []);
      if (parsed.length > 0) return parsed;
    }
    return DEFAULT_FEATURES;
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // Feature item helpers
  const addFeature = () => {
    setFeatures([
      ...features,
      {
        title: "New Highlight",
        description: "Add a supportive benefit description here.",
        iconName: "HiShieldCheck",
      },
    ]);
  };

  const removeFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const updateFeature = (idx: number, field: keyof FeatureItem, value: string) => {
    const updated = [...features];
    updated[idx] = { ...updated[idx], [field]: value };
    setFeatures(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await upsertAppointmentPageContentAction({
        subtitle: subtitle.trim(),
        title: title.trim(),
        description: description.trim(),
        features: features.map((f) => ({
          title: f.title.trim(),
          description: f.description.trim(),
          iconName: f.iconName || "HiUserGroup",
        })),
      });

      if (res.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(res.error || "Failed to update appointment page text.");
      }
    } catch (err: unknown) {
      setError(
        (err instanceof Error ? err.message : String(err)) ||
          "An unexpected error occurred while saving."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 max-w-4xl bg-white border border-muted/50 rounded-2xl p-6 md:p-8 shadow-xs text-sm font-sans"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-muted pb-4">
        <div>
          <h2 className="font-marcellus text-xl font-bold text-dark-green">
            Appointment Page Content & Highlights
          </h2>
          <p className="text-xs text-light-ash mt-0.5">
            Customize the heading, subtitle badge, intro message, and benefit pillars displayed on the public <span className="font-semibold text-primary">/appointment</span> page.
          </p>
        </div>
        <a
          href="/appointment"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-dark text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto py-1 px-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
        >
          View Live Page <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
        </a>
      </div>

      {initialContent?.lastUpdatedBy && (
        <span className="text-[11px] text-light-ash/70 -mt-2">
          Last updated by <span className="font-semibold text-primary">{initialContent.lastUpdatedBy}</span> on{" "}
          {initialContent.updatedAt ? new Date(initialContent.updatedAt).toLocaleString() : ""}
        </span>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-sans font-medium border border-emerald-100 flex items-center gap-2">
          <HiCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          Appointment page texts and highlights updated successfully.
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-sans font-medium border border-red-100">
          {error}
        </div>
      )}

      {/* Main Page Heading and Subtitle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-dark uppercase tracking-wider">
            Subtitle Badge
          </label>
          <input
            type="text"
            required
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g. Get Started"
            className="w-full px-3.5 py-2.5 border border-muted rounded-xl bg-light-ash/5 focus:bg-white focus:border-primary focus:outline-none text-sm transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-dark uppercase tracking-wider">
            Page Title (H1)
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Book an Appointment"
            className="w-full px-3.5 py-2.5 border border-muted rounded-xl bg-light-ash/5 focus:bg-white focus:border-primary focus:outline-none text-sm font-semibold transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-bold text-dark uppercase tracking-wider">
            Introductory Description Paragraph
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Take the first step toward better mental well-being..."
            className="w-full px-3.5 py-2.5 border border-muted rounded-xl bg-light-ash/5 focus:bg-white focus:border-primary focus:outline-none text-sm leading-relaxed transition-colors resize-none"
          />
        </div>
      </div>

      {/* Feature Highlights Builder */}
      <div className="flex flex-col gap-4 border-t border-muted pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-marcellus text-base font-bold text-dark-green">
              Key Benefit Pillars / Highlights
            </h3>
            <p className="text-xs text-light-ash">
              These icon cards reinforce safety, expertise, and confidentiality beside the booking form.
            </p>
          </div>
          <button
            type="button"
            onClick={addFeature}
            className="text-primary hover:text-primary-dark font-semibold text-xs flex items-center gap-1 cursor-pointer bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            <HiPlus className="w-4 h-4" /> Add Pillar
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-1">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-light-ash/5 border border-muted rounded-2xl p-4 flex flex-col sm:flex-row gap-4 relative items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-muted/60 flex items-center justify-center shrink-0 shadow-xs">
                {renderAdminFeatureIcon(feature.iconName)}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 flex-1 w-full pr-8 sm:pr-0">
                <div className="sm:col-span-5 flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-dark">Title</label>
                  <input
                    type="text"
                    required
                    value={feature.title}
                    onChange={(e) => updateFeature(idx, "title", e.target.value)}
                    placeholder="e.g. Expert Care"
                    className="px-3 py-1.5 border border-muted rounded-lg bg-white focus:outline-none focus:border-primary text-xs font-semibold"
                  />
                </div>

                <div className="sm:col-span-4 flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-dark">Icon</label>
                  <select
                    value={feature.iconName || "HiUserGroup"}
                    onChange={(e) => updateFeature(idx, "iconName", e.target.value)}
                    className="px-3 py-1.5 border border-muted rounded-lg bg-white focus:outline-none focus:border-primary text-xs"
                  >
                    {AVAILABLE_ICONS.map((icon) => (
                      <option key={icon.value} value={icon.value}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-12 flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-dark">Description</label>
                  <input
                    type="text"
                    required
                    value={feature.description}
                    onChange={(e) => updateFeature(idx, "description", e.target.value)}
                    placeholder="e.g. Connect with highly qualified mental health professionals."
                    className="px-3 py-1.5 border border-muted rounded-lg bg-white focus:outline-none focus:border-primary text-xs"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeFeature(idx)}
                className="absolute right-3 top-3 text-light-ash hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Remove pillar"
              >
                <HiTrash className="w-4 h-4" />
              </button>
            </div>
          ))}

          {features.length === 0 && (
            <div className="text-center py-6 text-xs text-light-ash border border-dashed border-muted rounded-xl bg-white/50">
              No benefit pillars configured. Click &ldquo;Add Pillar&rdquo; to add highlight items.
            </div>
          )}
        </div>
      </div>

      {/* Form Submission */}
      <div className="flex justify-end gap-3 border-t border-muted pt-4">
        <button
          type="button"
          onClick={() => {
            setSubtitle(initialContent?.subtitle || "Get Started");
            setTitle(initialContent?.title || "Book an Appointment");
            setDescription(
              initialContent?.description ||
                "Take the first step toward better mental well-being. Choose your preferred therapist, service, and time. Our team is here to support you every step of the way."
            );
            setFeatures(
              initialContent?.features
                ? safeJsonParse<FeatureItem[]>(initialContent.features, DEFAULT_FEATURES)
                : DEFAULT_FEATURES
            );
            setError(null);
            setSuccess(false);
          }}
          disabled={isSubmitting}
          className="bg-light-ash/10 hover:bg-light-ash/20 text-dark font-sans text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary-dark text-white font-sans text-xs font-semibold px-5 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? "Saving Changes..." : "Save Appointment Page Content"}
        </button>
      </div>
    </form>
  );
}
