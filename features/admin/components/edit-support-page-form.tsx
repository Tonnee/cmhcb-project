"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiPlus, HiTrash, HiPhoto, HiOutlinePhone } from "react-icons/hi2";
import { uploadImageToSupabase } from "@/lib/supabase";
import { upsertSupportPageContentAction } from "@/app/(admin)/admin/actions";

interface EmergencyContact {
  title: string;
  description: string;
  phone: string;
  hours: string;
  iconName: string; // "phone" | "warning" | "shield"
  isPrimary: boolean;
}

interface SupportPageContent {
  id: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  contacts: string; // JSON string of EmergencyContact[]
  advisoryText: string;
}

interface EditSupportPageFormProps {
  initialContent: SupportPageContent;
}

export default function EditSupportPageForm({
  initialContent,
}: EditSupportPageFormProps): React.JSX.Element {
  const router = useRouter();

  const [heroTitle, setHeroTitle] = React.useState(initialContent.heroTitle);
  const [heroDescription, setHeroDescription] = React.useState(initialContent.heroDescription);
  const [heroImage, setHeroImage] = React.useState(initialContent.heroImage);
  const [advisoryText, setAdvisoryText] = React.useState(initialContent.advisoryText);

  const [contacts, setContacts] = React.useState<EmergencyContact[]>(() => {
    try {
      return JSON.parse(initialContent.contacts || "[]");
    } catch {
      return [];
    }
  });

  const [newTitle, setNewTitle] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");
  const [newPhone, setNewPhone] = React.useState("");
  const [newHours, setNewHours] = React.useState("Available 24/7");
  const [newIconName, setNewIconName] = React.useState("phone");
  const [newIsPrimary, setNewIsPrimary] = React.useState(false);

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

  const addContact = () => {
    if (!newTitle.trim() || !newPhone.trim() || !newDescription.trim()) {
      alert("Please fill in Title, Phone, and Description.");
      return;
    }

    setContacts([
      ...contacts,
      {
        title: newTitle.trim(),
        description: newDescription.trim(),
        phone: newPhone.trim(),
        hours: newHours.trim(),
        iconName: newIconName,
        isPrimary: newIsPrimary,
      },
    ]);

    setNewTitle("");
    setNewDescription("");
    setNewPhone("");
    setNewHours("Available 24/7");
    setNewIconName("phone");
    setNewIsPrimary(false);
  };

  const deleteContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isUploading) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await upsertSupportPageContentAction({
        heroTitle,
        heroDescription,
        heroImage,
        contacts,
        advisoryText,
      });

      if (res.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(res.error || "Failed to update support page content.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl bg-white border border-muted rounded-2xl p-6 md:p-8 shadow-xs text-sm font-sans">
      {success && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-sans font-medium border border-emerald-100">
          Support page content updated successfully.
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

      {/* Advisory Text */}
      <div className="flex flex-col gap-4 border-b border-muted/80 pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Important Advisory Notice</h2>
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-dark text-xs">Advisory Text Disclaimer</label>
          <textarea
            value={advisoryText}
            onChange={(e) => setAdvisoryText(e.target.value)}
            className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary h-24 resize-y font-sans leading-relaxed text-xs"
            required
          />
        </div>
      </div>

      {/* Emergency Contacts List */}
      <div className="flex flex-col gap-4">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Emergency Helplines</h2>
        
        <div className="flex flex-col gap-3">
          {contacts.map((contact, idx) => (
            <div key={idx} className="flex items-start justify-between gap-4 p-4 bg-white border border-muted rounded-xl">
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/15 text-primary-dark px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider font-sans">
                    {contact.iconName}
                  </span>
                  {contact.isPrimary && (
                    <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider font-sans border border-red-100">
                      Primary
                    </span>
                  )}
                  <span className="font-semibold text-dark text-xs">{contact.title}</span>
                </div>
                <p className="text-light-ash text-xs leading-relaxed pl-1">{contact.description}</p>
                <div className="flex items-center gap-4 text-xs font-semibold pl-1 text-primary-dark mt-1">
                  <span>Phone: {contact.phone}</span>
                  <span className="text-light-ash font-medium">({contact.hours})</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => deleteContact(idx)}
                className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded-lg shrink-0 cursor-pointer"
              >
                <HiTrash className="w-4 h-4" />
              </button>
            </div>
          ))}

          {contacts.length === 0 && (
            <span className="text-xs text-light-ash/80 italic text-center py-4 bg-light/10 border border-dashed border-muted rounded-xl">
              No emergency contacts added yet.
            </span>
          )}
        </div>

        {/* Add Contact Fields */}
        <div className="bg-light/10 p-4 rounded-2xl border border-muted/50 flex flex-col gap-3">
          <span className="font-semibold text-dark text-xs border-b border-muted pb-1">Add Contact Record</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Contact Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. National Child Helpline"
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Phone Number</label>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="e.g. 1098 or +880 19..."
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Hours / Availability</label>
              <input
                type="text"
                value={newHours}
                onChange={(e) => setNewHours(e.target.value)}
                placeholder="e.g. Available 24/7"
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-light-ash">Icon Type</label>
              <select
                value={newIconName}
                onChange={(e) => setNewIconName(e.target.value)}
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none"
              >
                <option value="phone">Phone / Helpline</option>
                <option value="warning">Warning / Emergency</option>
                <option value="shield">Shield / Guard</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-[10px] text-light-ash">Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Briefly explain who this contact handles..."
                className="px-3 py-1.5 border border-muted rounded-lg text-xs bg-white focus:outline-none h-12 resize-none"
              />
            </div>

            <div className="flex items-center gap-2 sm:col-span-3 mt-1 bg-white p-2.5 rounded-lg border border-muted/50">
              <input
                type="checkbox"
                id="newIsPrimary"
                checked={newIsPrimary}
                onChange={(e) => setNewIsPrimary(e.target.checked)}
                className="w-4 h-4 text-primary border-muted rounded focus:ring-primary cursor-pointer"
              />
              <label htmlFor="newIsPrimary" className="text-xs font-semibold text-dark cursor-pointer select-none">
                Set as Primary Crisis Contact (Will be styled in Dark Green highlight block)
              </label>
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <button
                type="button"
                onClick={addContact}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold flex items-center justify-center shrink-0 cursor-pointer gap-1.5"
              >
                <HiPlus className="w-4 h-4" /> Add Helpline
              </button>
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
          {isSubmitting ? "Saving..." : "Save Support Page"}
        </button>
      </div>
    </form>
  );
}
