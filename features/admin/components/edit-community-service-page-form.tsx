"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";
import { upsertCommunityServicePageContentAction } from "@/app/(admin)/admin/actions";

interface StatItem {
  value: string;
  title: string;
  description: string;
}

interface PillarItem {
  badge: string;
  title: string;
  description: string;
  iconName: string; // "userGroup" | "academicCap" | "globe" | "shield"
}

interface SimpleListItem {
  title: string;
  description: string;
}

interface CommunityServicePageContent {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  introTitle: string;
  introDescription1: string;
  introDescription2: string;
  stats: string;
  pillars: string;
  eligibilityTitle: string;
  eligibilityDescription: string;
  eligibilityItems: string;
  guidelinesTitle: string;
  guidelinesDescription: string;
  guidelinesItems: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaEmail: string;
}

interface EditCommunityServicePageFormProps {
  initialContent: CommunityServicePageContent;
}

export default function EditCommunityServicePageForm({
  initialContent,
}: EditCommunityServicePageFormProps): React.JSX.Element {
  const router = useRouter();

  const [heroTitle, setHeroTitle] = React.useState(initialContent.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = React.useState(initialContent.heroSubtitle);
  const [heroDescription, setHeroDescription] = React.useState(initialContent.heroDescription);
  
  const [introTitle, setIntroTitle] = React.useState(initialContent.introTitle);
  const [introDescription1, setIntroDescription1] = React.useState(initialContent.introDescription1);
  const [introDescription2, setIntroDescription2] = React.useState(initialContent.introDescription2);

  const [stats, setStats] = React.useState<StatItem[]>(() => {
    try {
      return JSON.parse(initialContent.stats || "[]");
    } catch {
      return [];
    }
  });

  const [pillars, setPillars] = React.useState<PillarItem[]>(() => {
    try {
      return JSON.parse(initialContent.pillars || "[]");
    } catch {
      return [];
    }
  });

  const [eligibilityTitle, setEligibilityTitle] = React.useState(initialContent.eligibilityTitle);
  const [eligibilityDescription, setEligibilityDescription] = React.useState(initialContent.eligibilityDescription);
  const [eligibilityItems, setEligibilityItems] = React.useState<SimpleListItem[]>(() => {
    try {
      return JSON.parse(initialContent.eligibilityItems || "[]");
    } catch {
      return [];
    }
  });

  const [guidelinesTitle, setGuidelinesTitle] = React.useState(initialContent.guidelinesTitle);
  const [guidelinesDescription, setGuidelinesDescription] = React.useState(initialContent.guidelinesDescription);
  const [guidelinesItems, setGuidelinesItems] = React.useState<SimpleListItem[]>(() => {
    try {
      return JSON.parse(initialContent.guidelinesItems || "[]");
    } catch {
      return [];
    }
  });

  const [ctaTitle, setCtaTitle] = React.useState(initialContent.ctaTitle);
  const [ctaDescription, setCtaDescription] = React.useState(initialContent.ctaDescription);
  const [ctaEmail, setCtaEmail] = React.useState(initialContent.ctaEmail);

  // Stats helpers
  const [newStatValue, setNewStatValue] = React.useState("");
  const [newStatTitle, setNewStatTitle] = React.useState("");
  const [newStatDesc, setNewStatDesc] = React.useState("");

  const addStat = () => {
    if (!newStatValue.trim() || !newStatTitle.trim() || !newStatDesc.trim()) return;
    setStats([...stats, { value: newStatValue.trim(), title: newStatTitle.trim(), description: newStatDesc.trim() }]);
    setNewStatValue("");
    setNewStatTitle("");
    setNewStatDesc("");
  };

  const deleteStat = (idx: number) => {
    setStats(stats.filter((_, i) => i !== idx));
  };

  // Pillars helpers
  const [newPillarBadge, setNewPillarBadge] = React.useState("");
  const [newPillarTitle, setNewPillarTitle] = React.useState("");
  const [newPillarDesc, setNewPillarDesc] = React.useState("");
  const [newPillarIcon, setNewPillarIcon] = React.useState("globe");

  const addPillar = () => {
    if (!newPillarTitle.trim() || !newPillarDesc.trim() || !newPillarBadge.trim()) return;
    setPillars([
      ...pillars,
      { badge: newPillarBadge.trim(), title: newPillarTitle.trim(), description: newPillarDesc.trim(), iconName: newPillarIcon }
    ]);
    setNewPillarBadge("");
    setNewPillarTitle("");
    setNewPillarDesc("");
    setNewPillarIcon("globe");
  };

  const deletePillar = (idx: number) => {
    setPillars(pillars.filter((_, i) => i !== idx));
  };

  // Eligibility helpers
  const [newEligTitle, setNewEligTitle] = React.useState("");
  const [newEligDesc, setNewEligDesc] = React.useState("");

  const addEligItem = () => {
    if (!newEligTitle.trim() || !newEligDesc.trim()) return;
    setEligibilityItems([...eligibilityItems, { title: newEligTitle.trim(), description: newEligDesc.trim() }]);
    setNewEligTitle("");
    setNewEligDesc("");
  };

  const deleteEligItem = (idx: number) => {
    setEligibilityItems(eligibilityItems.filter((_, i) => i !== idx));
  };

  // Guidelines helpers
  const [newGuideTitle, setNewGuideTitle] = React.useState("");
  const [newGuideDesc, setNewGuideDesc] = React.useState("");

  const addGuideItem = () => {
    if (!newGuideTitle.trim() || !newGuideDesc.trim()) return;
    setGuidelinesItems([...guidelinesItems, { title: newGuideTitle.trim(), description: newGuideDesc.trim() }]);
    setNewGuideTitle("");
    setNewGuideDesc("");
  };

  const deleteGuideItem = (idx: number) => {
    setGuidelinesItems(guidelinesItems.filter((_, i) => i !== idx));
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await upsertCommunityServicePageContentAction({
        heroTitle,
        heroSubtitle,
        heroDescription,
        introTitle,
        introDescription1,
        introDescription2,
        stats,
        pillars,
        eligibilityTitle,
        eligibilityDescription,
        eligibilityItems,
        guidelinesTitle,
        guidelinesDescription,
        guidelinesItems,
        ctaTitle,
        ctaDescription,
        ctaEmail,
      });

      if (res.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(res.error || "Failed to update page content.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl bg-white border border-muted rounded-2xl p-6 md:p-8 shadow-sm font-sans text-sm text-dark">
      {success && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-sans font-medium border border-emerald-100">
          Community Service page content updated successfully.
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-sm font-sans font-medium border border-rose-100">
          {error}
        </div>
      )}

      {/* Hero Header Section */}
      <div className="flex flex-col gap-4 border-b border-muted pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green border-b border-muted/50 pb-2">Hero Header & Visuals</h2>
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
            <label className="font-semibold text-dark text-xs">Hero Subtitle</label>
            <input
              type="text"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="font-semibold text-dark text-xs">Hero Description</label>
            <textarea
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary h-20 resize-none leading-relaxed"
              required
            />
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="flex flex-col gap-4 border-b border-muted pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green border-b border-muted/50 pb-2">Introduction Block</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Introduction Section Heading</label>
            <input
              type="text"
              value={introTitle}
              onChange={(e) => setIntroTitle(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Paragraph 1 (Outreach Commitment)</label>
            <textarea
              value={introDescription1}
              onChange={(e) => setIntroDescription1(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary h-24 resize-y leading-relaxed"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Paragraph 2 (Confidentiality & Ethical Volunteer Standpoints)</label>
            <textarea
              value={introDescription2}
              onChange={(e) => setIntroDescription2(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary h-24 resize-y leading-relaxed"
              required
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex flex-col gap-4 border-b border-muted pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green border-b border-muted/50 pb-2">Outreach Statistics (Impact Metrics)</h2>
        <div className="flex flex-col gap-3">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 p-4 bg-white border border-muted rounded-xl">
              <div>
                <span className="font-bold text-primary-dark text-sm mr-2">{stat.value}</span>
                <span className="font-semibold text-dark text-xs">{stat.title}</span>
                <p className="text-light-ash text-xs mt-0.5">{stat.description}</p>
              </div>
              <button
                type="button"
                onClick={() => deleteStat(idx)}
                className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded-lg shrink-0 cursor-pointer"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
          {stats.length === 0 && <span className="text-xs text-light-ash italic">No statistics added yet.</span>}
        </div>
        
        {/* Add Stat Inline fields */}
        <div className="bg-light/10 p-4 rounded-xl border border-muted/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-light-ash">Value (e.g. 15% or 2,500+)</label>
            <input
              type="text"
              value={newStatValue}
              onChange={(e) => setNewStatValue(e.target.value)}
              className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-light-ash">Title (e.g. Hours Allocation)</label>
            <input
              type="text"
              value={newStatTitle}
              onChange={(e) => setNewStatTitle(e.target.value)}
              className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-light-ash">Brief Description</label>
            <input
              type="text"
              value={newStatDesc}
              onChange={(e) => setNewStatDesc(e.target.value)}
              className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
            />
          </div>
          <div className="sm:col-span-3 flex justify-end">
            <button
              type="button"
              onClick={addStat}
              className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <HiOutlinePlus className="w-3.5 h-3.5" /> Add Stat
            </button>
          </div>
        </div>
      </div>

      {/* Pillars Section */}
      <div className="flex flex-col gap-4 border-b border-muted pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green border-b border-muted/50 pb-2">Outreach Program Pillars</h2>
        <div className="grid grid-cols-1 gap-3">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="flex items-start justify-between gap-4 p-4 bg-white border border-muted rounded-xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-primary/10 text-primary-dark font-sans font-bold text-[10px] uppercase px-2 py-0.5 rounded">
                    {pillar.iconName}
                  </span>
                  <span className="bg-accent/15 text-accent px-2 py-0.5 rounded text-[10px] font-bold">
                    {pillar.badge}
                  </span>
                  <h4 className="font-semibold text-dark text-xs">{pillar.title}</h4>
                </div>
                <p className="text-light-ash text-xs leading-relaxed">{pillar.description}</p>
              </div>
              <button
                type="button"
                onClick={() => deletePillar(idx)}
                className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded-lg shrink-0 cursor-pointer"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
          {pillars.length === 0 && <span className="text-xs text-light-ash italic">No outreach pillars added yet.</span>}
        </div>

        {/* Add Pillar Inline fields */}
        <div className="bg-light/10 p-4 rounded-xl border border-muted/50 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-light-ash">Badge Name (e.g. Clinical Care)</label>
            <input
              type="text"
              value={newPillarBadge}
              onChange={(e) => setNewPillarBadge(e.target.value)}
              className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-light-ash">Pillar Title (e.g. Pro-Bono Services)</label>
            <input
              type="text"
              value={newPillarTitle}
              onChange={(e) => setNewPillarTitle(e.target.value)}
              className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-light-ash">Icon Representation</label>
            <select
              value={newPillarIcon}
              onChange={(e) => setNewPillarIcon(e.target.value)}
              className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
            >
              <option value="userGroup">People / User Group</option>
              <option value="academicCap">Education / Academic Cap</option>
              <option value="globe">Outreach / Globe</option>
              <option value="shield">Crisis / Shield</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-light-ash">Description Text</label>
            <textarea
              value={newPillarDesc}
              onChange={(e) => setNewPillarDesc(e.target.value)}
              className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white h-12 resize-none focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="button"
              onClick={addPillar}
              className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <HiOutlinePlus className="w-3.5 h-3.5" /> Add Pillar
            </button>
          </div>
        </div>
      </div>

      {/* Eligibility Block */}
      <div className="flex flex-col gap-4 border-b border-muted pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green border-b border-muted/50 pb-2">Eligibility Checklist</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Section Heading</label>
            <input
              type="text"
              value={eligibilityTitle}
              onChange={(e) => setEligibilityTitle(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Section Description Summary</label>
            <textarea
              value={eligibilityDescription}
              onChange={(e) => setEligibilityDescription(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary h-12 resize-none"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {eligibilityItems.map((item, idx) => (
            <div key={idx} className="flex items-start justify-between gap-4 p-4 bg-white border border-muted rounded-xl">
              <div>
                <h4 className="font-semibold text-dark text-xs">{item.title}</h4>
                <p className="text-light-ash text-xs mt-0.5 leading-relaxed">{item.description}</p>
              </div>
              <button
                type="button"
                onClick={() => deleteEligItem(idx)}
                className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded-lg shrink-0 cursor-pointer"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
          {eligibilityItems.length === 0 && <span className="text-xs text-light-ash italic">No eligibility rules added yet.</span>}
        </div>

        {/* Add Elig Inline fields */}
        <div className="bg-light/10 p-4 rounded-xl border border-muted/50 flex flex-col gap-3">
          <span className="font-semibold text-dark text-xs">Add Verification Rule</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Rule Heading</label>
              <input
                type="text"
                value={newEligTitle}
                onChange={(e) => setNewEligTitle(e.target.value)}
                placeholder="e.g. Economic Assessment"
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Rule Explanation</label>
              <textarea
                value={newEligDesc}
                onChange={(e) => setNewEligDesc(e.target.value)}
                placeholder="Details of the assessment rule..."
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white h-12 resize-none focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={addEligItem}
                className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <HiOutlinePlus className="w-3.5 h-3.5" /> Add Rule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines Block */}
      <div className="flex flex-col gap-4 border-b border-muted pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green border-b border-muted/50 pb-2">Operational Guidelines</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Section Heading</label>
            <input
              type="text"
              value={guidelinesTitle}
              onChange={(e) => setGuidelinesTitle(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Section Description Summary</label>
            <textarea
              value={guidelinesDescription}
              onChange={(e) => setGuidelinesDescription(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary h-12 resize-none"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {guidelinesItems.map((item, idx) => (
            <div key={idx} className="flex items-start justify-between gap-4 p-4 bg-white border border-muted rounded-xl">
              <div>
                <h4 className="font-semibold text-dark text-xs">{item.title}</h4>
                <p className="text-light-ash text-xs mt-0.5 leading-relaxed">{item.description}</p>
              </div>
              <button
                type="button"
                onClick={() => deleteGuideItem(idx)}
                className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded-lg shrink-0 cursor-pointer"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
          {guidelinesItems.length === 0 && <span className="text-xs text-light-ash italic">No guidelines added yet.</span>}
        </div>

        {/* Add Guide Inline fields */}
        <div className="bg-light/10 p-4 rounded-xl border border-muted/50 flex flex-col gap-3">
          <span className="font-semibold text-dark text-xs">Add Operational Directive</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Directive Heading</label>
              <input
                type="text"
                value={newGuideTitle}
                onChange={(e) => setNewGuideTitle(e.target.value)}
                placeholder="e.g. Scope of Care Limitations"
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Directive Description</label>
              <textarea
                value={newGuideDesc}
                onChange={(e) => setNewGuideDesc(e.target.value)}
                placeholder="Details of the operational directive..."
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white h-12 resize-none focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={addGuideItem}
                className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <HiOutlinePlus className="w-3.5 h-3.5" /> Add Directive
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action (CTA) Section */}
      <div className="flex flex-col gap-4 border-b border-muted pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green border-b border-muted/50 pb-2">Outreach Contact (CTA)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">CTA Banner Title</label>
            <input
              type="text"
              value={ctaTitle}
              onChange={(e) => setCtaTitle(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Outreach Email Coordinate</label>
            <input
              type="email"
              value={ctaEmail}
              onChange={(e) => setCtaEmail(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="font-semibold text-dark text-xs">CTA Banner Description</label>
            <textarea
              value={ctaDescription}
              onChange={(e) => setCtaDescription(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary h-16 resize-none leading-relaxed"
              required
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end border-t border-muted pt-6 mt-4">
        <button
          type="submit"
          className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl flex items-center justify-center shrink-0 cursor-pointer gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Community Service Content"}
        </button>
      </div>
    </form>
  );
}
