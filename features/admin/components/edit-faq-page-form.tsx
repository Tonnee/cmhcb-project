"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiPlus, HiTrash } from "react-icons/hi2";
import { uploadImageToSupabase } from "@/lib/supabase";
import { upsertFaqPageContentAction } from "@/app/(admin)/admin/actions";

interface FaqItem {
  category: string;
  question: string;
  answer: string;
}

interface FaqPageContent {
  id: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  items: string; // JSON string of FaqItem[]
}

interface EditFaqPageFormProps {
  initialContent: FaqPageContent;
}

export default function EditFaqPageForm({
  initialContent,
}: EditFaqPageFormProps): React.JSX.Element {
  const router = useRouter();

  const [heroTitle, setHeroTitle] = React.useState(initialContent.heroTitle);
  const [heroDescription, setHeroDescription] = React.useState(initialContent.heroDescription);
  const [heroImage, setHeroImage] = React.useState(initialContent.heroImage);
  
  const [items, setItems] = React.useState<FaqItem[]>(() => {
    try {
      return JSON.parse(initialContent.items || "[]");
    } catch {
      return [];
    }
  });

  const [newCategory, setNewCategory] = React.useState("General");
  const [newQuestion, setNewQuestion] = React.useState("");
  const [newAnswer, setNewAnswer] = React.useState("");

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
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const addFaqItem = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setItems([
      ...items,
      {
        category: newCategory.trim(),
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
      },
    ]);
    setNewQuestion("");
    setNewAnswer("");
  };

  const deleteFaqItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isUploading) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await upsertFaqPageContentAction({
        heroTitle,
        heroDescription,
        heroImage,
        items,
      });

      if (res.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(res.error || "Failed to update FAQ page content.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl bg-white border border-muted rounded-2xl p-6 md:p-8 shadow-sm text-sm font-sans">
      {success && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-sans font-medium border border-emerald-100">
          FAQ page content updated successfully.
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-sm font-sans font-medium border border-rose-100">
          {error}
        </div>
      )}

      {/* Hero */}
      <div className="flex flex-col gap-4 border-b border-muted/80 pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Hero Section Banner</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Hero Title</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Hero Description</label>
            <textarea
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary h-20 resize-none"
              required
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center bg-light/10 p-4 rounded-xl border border-muted/50 mt-2">
          {heroImage && (
            <img
              src={heroImage}
              alt="Preview"
              className="w-24 h-16 rounded-lg object-cover border border-primary shrink-0 bg-white"
            />
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

      {/* FAQ items list */}
      <div className="flex flex-col gap-4">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Frequently Asked Questions</h2>
        
        <div className="flex flex-col gap-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-start justify-between gap-4 p-4 bg-white border border-muted rounded-xl">
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/15 text-primary-dark px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider font-sans">
                    {item.category}
                  </span>
                  <span className="font-semibold text-dark text-xs">Q: {item.question}</span>
                </div>
                <p className="text-light-ash text-xs leading-relaxed pl-1">A: {item.answer}</p>
              </div>
              <button
                type="button"
                onClick={() => deleteFaqItem(idx)}
                className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded-lg shrink-0 cursor-pointer"
              >
                <HiTrash className="w-4 h-4" />
              </button>
            </div>
          ))}

          {items.length === 0 && (
            <span className="text-xs text-light-ash/80 italic text-center py-4 bg-light/10 border border-dashed border-muted rounded-xl">
              No Q&As added yet.
            </span>
          )}
        </div>

        {/* Add Q&A Fields */}
        <div className="bg-light/10 p-4 rounded-2xl border border-muted/50 flex flex-col gap-3">
          <span className="font-semibold text-dark text-xs border-b border-muted pb-1">Add FAQ Record</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Category Group</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
              >
                <option value="General">General</option>
                <option value="Therapy">Therapy</option>
                <option value="Fees & Billing">Fees & Billing</option>
                <option value="Appointments">Appointments</option>
                <option value="Privacy & Policy">Privacy & Policy</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-[10px] text-light-ash">Question</label>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="e.g. How long does a typical counseling session last?"
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-3">
              <label className="text-[10px] text-light-ash">Answer Text</label>
              <div className="flex gap-2">
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Provide a helpful response detail..."
                  className="flex-1 px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none h-16 resize-none"
                />
                <button
                  type="button"
                  onClick={addFaqItem}
                  className="px-4 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold flex items-center justify-center shrink-0 cursor-pointer self-end h-10"
                >
                  <HiPlus className="w-4 h-4" /> Add FAQ
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
          className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? "Saving..." : "Save FAQ Content"}
        </button>
      </div>
    </form>
  );
}
