"use client";
import Image from "next/image";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiPlus, HiTrash } from "react-icons/hi2";
import { uploadImageToSupabase } from "@/lib/supabase";
import { upsertAboutPageContentAction } from "@/app/(admin)/admin/actions";

interface CoreValue {
  title: string;
  description: string;
  icon: string;
}

interface AboutPageContent {
  id: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
  coreValues: string; // JSON string of CoreValue[]
  lastUpdatedBy?: string | null;
  updatedAt?: Date | string | null;
}

interface EditAboutPageFormProps {
  initialContent: AboutPageContent;
}

export default function EditAboutPageForm({
  initialContent,
}: EditAboutPageFormProps): React.JSX.Element {
  const router = useRouter();

  const [heroTitle, setHeroTitle] = React.useState(initialContent.heroTitle);
  const [heroDescription, setHeroDescription] = React.useState(initialContent.heroDescription);
  const [heroImage, setHeroImage] = React.useState(initialContent.heroImage);
  
  const [missionTitle, setMissionTitle] = React.useState(initialContent.missionTitle);
  const [missionText, setMissionText] = React.useState(initialContent.missionText);
  const [visionTitle, setVisionTitle] = React.useState(initialContent.visionTitle);
  const [visionText, setVisionText] = React.useState(initialContent.visionText);
  
  const [coreValues, setCoreValues] = React.useState<CoreValue[]>(() => {
    try {
      return JSON.parse(initialContent.coreValues || "[]");
    } catch {
      return [];
    }
  });

  const [newValueTitle, setNewValueTitle] = React.useState("");
  const [newValueDesc, setNewValueDesc] = React.useState("");
  const [newValueIcon, setNewValueIcon] = React.useState("Heart");

  const [isUploading, setIsUploading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadImageToSupabase(file, "cmhcb-media");
      setHeroImage(publicUrl);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const addCoreValue = () => {
    if (!newValueTitle.trim() || !newValueDesc.trim()) return;
    setCoreValues([
      ...coreValues,
      {
        title: newValueTitle.trim(),
        description: newValueDesc.trim(),
        icon: newValueIcon,
      },
    ]);
    setNewValueTitle("");
    setNewValueDesc("");
  };

  const deleteCoreValue = (index: number) => {
    setCoreValues(coreValues.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isUploading) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await upsertAboutPageContentAction({
        heroTitle,
        heroDescription,
        heroImage,
        missionTitle,
        missionText,
        visionTitle,
        visionText,
        coreValues,
      });

      if (res.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(res.error || "Failed to update page content.");
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl bg-white border border-muted rounded-2xl p-6 md:p-8 shadow-sm">
      {initialContent.lastUpdatedBy && (
        <span className="text-[11px] text-light-ash/70 -mb-2">
          Last updated by <span className="font-semibold text-primary">{initialContent.lastUpdatedBy}</span> on {initialContent.updatedAt ? new Date(initialContent.updatedAt).toLocaleString() : ""}
        </span>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-sans font-medium border border-emerald-100">
          About Us page content updated successfully.
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
            <label className="font-semibold text-dark text-xs">Hero Description</label>
            <textarea
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm font-sans h-20 resize-none"
              required
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center bg-light/10 p-4 rounded-xl border border-muted/50 mt-2">
          {heroImage && (
            <Image src={heroImage} alt="Hero Preview" width={800} height={300} className="w-full max-h-48 object-cover rounded-xl border border-muted" />
          )}
          <div className="flex-1 flex flex-col gap-1">
            <span className="font-semibold text-dark text-xs">Hero Background Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 text-xs text-light-ash"
              disabled={isUploading}
            />
          </div>
          {isUploading && <span className="text-xs text-primary font-medium animate-pulse">Uploading image...</span>}
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="flex flex-col gap-4 border-b border-muted/80 pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Mission & Vision</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4 bg-light/10 p-4 rounded-2xl border border-muted/50">
            <span className="font-semibold text-dark text-xs border-b border-muted pb-1">Our Mission</span>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={missionTitle}
                onChange={(e) => setMissionTitle(e.target.value)}
                placeholder="Mission Title"
                className="px-3.5 py-1.5 border border-muted rounded-lg bg-white focus:outline-none focus:border-primary text-xs"
                required
              />
              <textarea
                value={missionText}
                onChange={(e) => setMissionText(e.target.value)}
                placeholder="Mission Description text"
                className="px-3.5 py-1.5 border border-muted rounded-lg bg-white focus:outline-none focus:border-primary text-xs h-20 resize-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-light/10 p-4 rounded-2xl border border-muted/50">
            <span className="font-semibold text-dark text-xs border-b border-muted pb-1">Our Vision</span>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={visionTitle}
                onChange={(e) => setVisionTitle(e.target.value)}
                placeholder="Vision Title"
                className="px-3.5 py-1.5 border border-muted rounded-lg bg-white focus:outline-none focus:border-primary text-xs"
                required
              />
              <textarea
                value={visionText}
                onChange={(e) => setVisionText(e.target.value)}
                placeholder="Vision Description text"
                className="px-3.5 py-1.5 border border-muted rounded-lg bg-white focus:outline-none focus:border-primary text-xs h-20 resize-none"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="flex flex-col gap-4">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Core Values</h2>
        
        <div className="flex flex-col gap-3">
          {coreValues.map((value, idx) => (
            <div key={idx} className="flex items-start justify-between gap-4 p-3 bg-white border border-muted rounded-xl text-xs">
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-bold text-dark flex items-center gap-1.5">
                  <span className="bg-primary/10 text-primary-dark px-1.5 py-0.5 rounded text-[10px] uppercase font-mono">{value.icon}</span>
                  {value.title}
                </span>
                <p className="text-light-ash">{value.description}</p>
              </div>
              <button
                type="button"
                onClick={() => deleteCoreValue(idx)}
                className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded-lg shrink-0 cursor-pointer"
              >
                <HiTrash className="w-4 h-4" />
              </button>
            </div>
          ))}

          {coreValues.length === 0 && (
            <span className="text-xs text-light-ash/80 italic text-center py-4 bg-light/10 border border-dashed border-muted rounded-xl">
              No core values added yet.
            </span>
          )}
        </div>

        {/* Add Value fields */}
        <div className="bg-light/10 p-4 rounded-2xl border border-muted/50 flex flex-col gap-3">
          <span className="font-semibold text-dark text-xs border-b border-muted pb-1">Add Core Value</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Value Title</label>
              <input
                type="text"
                value={newValueTitle}
                onChange={(e) => setNewValueTitle(e.target.value)}
                placeholder="e.g. Integrity"
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Value Icon Category</label>
              <select
                value={newValueIcon}
                onChange={(e) => setNewValueIcon(e.target.value)}
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
              >
                <option value="Heart">Heart</option>
                <option value="Shield">Shield</option>
                <option value="Sparkles">Sparkles</option>
                <option value="Academic">Academic</option>
                <option value="Users">Users</option>
                <option value="Check">Check</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 sm:col-span-3">
              <label className="text-[10px] text-light-ash">Value Description</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newValueDesc}
                  onChange={(e) => setNewValueDesc(e.target.value)}
                  placeholder="Short explanation of how this value guides CMHCB..."
                  className="flex-1 px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCoreValue}
                  className="px-3 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <HiPlus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end border-t border-muted pt-6 mt-4">
        <button
          type="submit"
          className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? "Saving..." : "Save About Page Content"}
        </button>
      </div>
    </form>
  );
}