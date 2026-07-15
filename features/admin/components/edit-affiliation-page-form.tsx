"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiPlus, HiTrash } from "react-icons/hi2";
import { uploadImageToSupabase } from "@/lib/supabase";
import { upsertAffiliationPageContentAction } from "@/app/(admin)/admin/actions";

interface Partner {
  name: string;
  type: string;
  abbr: string;
  logo?: string | null;
  website?: string | null;
}

interface Benefit {
  title: string;
  description: string;
  icon: string;
}

interface AffiliationPageContent {
  id: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  partners: string; // JSON string of Partner[]
  benefits: string; // JSON string of Benefit[]
  ctaTitle: string;
  ctaDescription: string;
  promises: string; // JSON string of string[]
  lastUpdatedBy?: string | null;
  updatedAt?: Date | string | null;
}

interface EditAffiliationPageFormProps {
  initialContent: AffiliationPageContent;
}

export default function EditAffiliationPageForm({
  initialContent,
}: EditAffiliationPageFormProps): React.JSX.Element {
  const router = useRouter();

  const [heroTitle, setHeroTitle] = React.useState(initialContent.heroTitle);
  const [heroDescription, setHeroDescription] = React.useState(initialContent.heroDescription);
  const [heroImage, setHeroImage] = React.useState(initialContent.heroImage);
  
  const [partners, setPartners] = React.useState<Partner[]>(() => {
    try {
      return JSON.parse(initialContent.partners || "[]");
    } catch {
      return [];
    }
  });

  const [benefits, setBenefits] = React.useState<Benefit[]>(() => {
    try {
      return JSON.parse(initialContent.benefits || "[]");
    } catch {
      return [];
    }
  });

  const [ctaTitle, setCtaTitle] = React.useState(initialContent.ctaTitle);
  const [ctaDescription, setCtaDescription] = React.useState(initialContent.ctaDescription);
  
  const [promises, setPromises] = React.useState<string[]>(() => {
    try {
      return JSON.parse(initialContent.promises || "[]");
    } catch {
      return [];
    }
  });

  // Adding partners helpers
  const [newPartnerName, setNewPartnerName] = React.useState("");
  const [newPartnerType, setNewPartnerType] = React.useState("");
  const [newPartnerAbbr, setNewPartnerAbbr] = React.useState("");
  const [newPartnerLogo, setNewPartnerLogo] = React.useState("");
  const [newPartnerWebsite, setNewPartnerWebsite] = React.useState("");
  const [isLogoUploading, setIsLogoUploading] = React.useState(false);

  const addPartner = () => {
    if (!newPartnerName.trim() || !newPartnerType.trim() || !newPartnerAbbr.trim()) return;
    setPartners([
      ...partners,
      {
        name: newPartnerName.trim(),
        type: newPartnerType.trim(),
        abbr: newPartnerAbbr.trim(),
        logo: newPartnerLogo.trim() || null,
        website: newPartnerWebsite.trim() || null,
      },
    ]);
    setNewPartnerName("");
    setNewPartnerType("");
    setNewPartnerAbbr("");
    setNewPartnerLogo("");
    setNewPartnerWebsite("");
  };

  const deletePartner = (idx: number) => {
    setPartners(partners.filter((_, i) => i !== idx));
  };

  // Adding benefits helpers
  const [newBenefitTitle, setNewBenefitTitle] = React.useState("");
  const [newBenefitDesc, setNewBenefitDesc] = React.useState("");
  const [newBenefitIcon, setNewBenefitIcon] = React.useState("UserGroup");

  const addBenefit = () => {
    if (!newBenefitTitle.trim() || !newBenefitDesc.trim()) return;
    setBenefits([
      ...benefits,
      {
        title: newBenefitTitle.trim(),
        description: newBenefitDesc.trim(),
        icon: newBenefitIcon,
      },
    ]);
    setNewBenefitTitle("");
    setNewBenefitDesc("");
  };

  const deleteBenefit = (idx: number) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };

  // Adding promises helpers
  const [newPromise, setNewPromise] = React.useState("");

  const addPromise = () => {
    if (!newPromise.trim()) return;
    setPromises([...promises, newPromise.trim()]);
    setNewPromise("");
  };

  const deletePromise = (idx: number) => {
    setPromises(promises.filter((_, i) => i !== idx));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isUploading || isLogoUploading) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await upsertAffiliationPageContentAction({
        heroTitle,
        heroDescription,
        heroImage,
        partners,
        benefits,
        ctaTitle,
        ctaDescription,
        promises,
      });

      if (res.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(res.error || "Failed to update Affiliation program page content.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl bg-white border border-muted rounded-2xl p-6 md:p-8 shadow-sm text-sm font-sans">
      {initialContent.lastUpdatedBy && (
        <span className="text-[11px] text-light-ash/70 -mb-2">
          Last updated by <span className="font-semibold text-primary">{initialContent.lastUpdatedBy}</span> on {initialContent.updatedAt ? new Date(initialContent.updatedAt).toLocaleString() : ""}
        </span>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-sans font-medium border border-emerald-100">
          Affiliation page content updated successfully.
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-sm font-sans font-medium border border-rose-100">
          {error}
        </div>
      )}

      {/* Hero Banner */}
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

      {/* Partners List */}
      <div className="flex flex-col gap-4 border-b border-muted/80 pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Trusted Partners Network</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {partners.map((partner, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-white border border-muted rounded-xl text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center font-marcellus font-bold text-primary-dark shrink-0 overflow-hidden relative">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.abbr}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    partner.abbr
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-dark">{partner.name}</span>
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-primary hover:underline truncate max-w-[150px]"
                    >
                      {partner.website}
                    </a>
                  )}
                  <span className="text-[9px] text-light-ash/80">{partner.type}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => deletePartner(idx)}
                className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded-lg shrink-0 cursor-pointer"
              >
                <HiTrash className="w-4 h-4" />
              </button>
            </div>
          ))}

          {partners.length === 0 && (
            <span className="text-xs text-light-ash/80 italic text-center py-4 bg-light/10 border border-dashed border-muted rounded-xl sm:col-span-2">
              No partners added yet.
            </span>
          )}
        </div>

        {/* Add Partner */}
        <div className="bg-light/10 p-4 rounded-2xl border border-muted/50 flex flex-col gap-3">
          <span className="font-semibold text-dark text-xs border-b border-muted pb-1">Add Partner Record</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Partner Name</label>
              <input
                type="text"
                value={newPartnerName}
                onChange={(e) => setNewPartnerName(e.target.value)}
                placeholder="e.g. University of Dhaka"
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Abbr / Code</label>
              <input
                type="text"
                value={newPartnerAbbr}
                onChange={(e) => setNewPartnerAbbr(e.target.value)}
                placeholder="e.g. DU"
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Collaboration Type</label>
              <input
                type="text"
                value={newPartnerType}
                onChange={(e) => setNewPartnerType(e.target.value)}
                placeholder="e.g. Academic Partner"
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
              />
            </div>
            
            {/* Logo Image Upload */}
            <div className="flex flex-col gap-1 sm:col-span-1">
              <label className="text-[10px] text-light-ash">Partner Logo Image</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsLogoUploading(true);
                    try {
                      const url = await uploadImageToSupabase(file, "cmhcb-media");
                      setNewPartnerLogo(url);
                    } catch (err: any) {
                      alert(err.message || "Failed to upload partner logo.");
                    } finally {
                      setIsLogoUploading(false);
                    }
                  }}
                  className="w-full text-[10px] text-light-ash file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 cursor-pointer"
                  disabled={isLogoUploading}
                />
                {newPartnerLogo && (
                  <img
                    src={newPartnerLogo}
                    alt="Logo preview"
                    className="w-8 h-8 rounded border border-muted object-contain bg-white shrink-0"
                  />
                )}
              </div>
              {isLogoUploading && <span className="text-[9px] text-primary animate-pulse">Uploading logo...</span>}
            </div>

            {/* Logo URL Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Logo Image URL (Or path)</label>
              <input
                type="text"
                value={newPartnerLogo}
                onChange={(e) => setNewPartnerLogo(e.target.value)}
                placeholder="e.g. /logos/du.png"
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
              />
            </div>

            {/* Website URL Input */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Website Link (Optional)</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newPartnerWebsite}
                  onChange={(e) => setNewPartnerWebsite(e.target.value)}
                  placeholder="https://du.ac.bd"
                  className="flex-1 px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addPartner}
                  className="px-3 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold flex items-center shrink-0 cursor-pointer disabled:opacity-55"
                  disabled={isLogoUploading}
                >
                  <HiPlus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits List */}
      <div className="flex flex-col gap-4 border-b border-muted/80 pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Partnership Benefits</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start justify-between gap-4 p-3 bg-white border border-muted rounded-xl text-xs">
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-bold text-dark flex items-center gap-1.5">
                  <span className="bg-primary/10 text-primary-dark px-1.5 py-0.5 rounded text-[10px] uppercase font-mono">{benefit.icon}</span>
                  {benefit.title}
                </span>
                <p className="text-light-ash leading-relaxed">{benefit.description}</p>
              </div>
              <button
                type="button"
                onClick={() => deleteBenefit(idx)}
                className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded-lg shrink-0 cursor-pointer"
              >
                <HiTrash className="w-4 h-4" />
              </button>
            </div>
          ))}

          {benefits.length === 0 && (
            <span className="text-xs text-light-ash/80 italic text-center py-4 bg-light/10 border border-dashed border-muted rounded-xl sm:col-span-2">
              No benefits added yet.
            </span>
          )}
        </div>

        {/* Add Benefit */}
        <div className="bg-light/10 p-4 rounded-2xl border border-muted/50 flex flex-col gap-3">
          <span className="font-semibold text-dark text-xs border-b border-muted pb-1">Add Benefit Card</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Benefit Title</label>
              <input
                type="text"
                value={newBenefitTitle}
                onChange={(e) => setNewBenefitTitle(e.target.value)}
                placeholder="e.g. Referral Ecosystem"
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Widget Icon</label>
              <select
                value={newBenefitIcon}
                onChange={(e) => setNewBenefitIcon(e.target.value)}
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
              >
                <option value="UserGroup">UserGroup</option>
                <option value="GlobeAlt">GlobeAlt</option>
                <option value="AcademicCap">AcademicCap</option>
                <option value="ArrowPath">ArrowPath</option>
                <option value="ShieldCheck">ShieldCheck</option>
                <option value="ChatBubble">ChatBubble</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-3">
              <label className="text-[10px] text-light-ash">Description Summary</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBenefitDesc}
                  onChange={(e) => setNewBenefitDesc(e.target.value)}
                  placeholder="Explain how partners benefit from this..."
                  className="flex-1 px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  className="px-3 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold flex items-center shrink-0 cursor-pointer"
                >
                  <HiPlus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section & Promises */}
      <div className="flex flex-col gap-4">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">CTA Partnership Promotion</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">CTA Headline</label>
            <input
              type="text"
              value={ctaTitle}
              onChange={(e) => setCtaTitle(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">CTA Subheading Text</label>
            <textarea
              value={ctaDescription}
              onChange={(e) => setCtaDescription(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary h-20 resize-none"
              required
            />
          </div>
        </div>

        {/* Promises checklist list */}
        <div className="flex flex-col gap-3 mt-2 bg-light/10 p-4 rounded-2xl border border-muted/50">
          <span className="font-semibold text-dark text-xs border-b border-muted pb-1">Checklist of Partnership Promises</span>
          
          <div className="flex flex-col gap-2">
            {promises.map((promise, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 p-2 bg-white border border-muted rounded-lg text-xs">
                <span className="text-light-ash leading-relaxed font-sans">{promise}</span>
                <button
                  type="button"
                  onClick={() => deletePromise(idx)}
                  className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded-lg shrink-0 cursor-pointer"
                >
                  <HiTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            
            {promises.length === 0 && (
              <span className="text-xs text-light-ash/80 italic text-center py-2 bg-white border border-muted border-dashed rounded-lg">
                No promises added yet.
              </span>
            )}
            
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={newPromise}
                onChange={(e) => setNewPromise(e.target.value)}
                placeholder="e.g. Shared research and events coordination"
                className="flex-1 px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={addPromise}
                className="px-3 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold flex items-center shrink-0 cursor-pointer"
              >
                <HiPlus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isUploading || isLogoUploading}
        className="w-full bg-primary hover:bg-primary-dark text-white font-sans text-sm font-semibold py-2.5 rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-50 mt-4"
      >
        {isSubmitting ? "Saving changes..." : "Save Customization Settings"}
      </button>
    </form>
  );
}
