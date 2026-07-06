"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { upsertContactPageContentAction } from "@/app/(admin)/admin/actions";

interface ContactPageContent {
  id: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  mapEmbedUrl: string;
}

interface EditContactPageFormProps {
  initialContent: ContactPageContent;
}

export default function EditContactPageForm({
  initialContent,
}: EditContactPageFormProps): React.JSX.Element {
  const router = useRouter();

  const [phone, setPhone] = React.useState(initialContent.phone);
  const [email, setEmail] = React.useState(initialContent.email);
  const [addressLine1, setAddressLine1] = React.useState(initialContent.addressLine1);
  const [addressLine2, setAddressLine2] = React.useState(initialContent.addressLine2);
  const [addressLine3, setAddressLine3] = React.useState(initialContent.addressLine3);
  
  const [facebookUrl, setFacebookUrl] = React.useState(initialContent.facebookUrl);
  const [instagramUrl, setInstagramUrl] = React.useState(initialContent.instagramUrl);
  const [twitterUrl, setTwitterUrl] = React.useState(initialContent.twitterUrl);
  const [linkedinUrl, setLinkedinUrl] = React.useState(initialContent.linkedinUrl);
  
  const [mapEmbedUrl, setMapEmbedUrl] = React.useState(initialContent.mapEmbedUrl);

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
      const res = await upsertContactPageContentAction({
        phone,
        email,
        addressLine1,
        addressLine2,
        addressLine3,
        facebookUrl,
        instagramUrl,
        twitterUrl,
        linkedinUrl,
        mapEmbedUrl,
      });

      if (res.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(res.error || "Failed to update contact page content.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl bg-white border border-muted rounded-2xl p-6 md:p-8 shadow-sm font-sans text-sm">
      {success && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm font-sans font-medium border border-emerald-100">
          Contact page details updated successfully.
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-sm font-sans font-medium border border-rose-100">
          {error}
        </div>
      )}

      {/* Main details */}
      <div className="flex flex-col gap-4 border-b border-muted/80 pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Primary Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="flex flex-col gap-4 border-b border-muted/80 pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Clinic Address</h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Address Line 1</label>
            <input
              type="text"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="e.g. CMHC Office Room, 78/2 (2nd Floor)"
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Address Line 2</label>
            <input
              type="text"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="e.g. New Airport Road, Tejkunipara"
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Address Line 3</label>
            <input
              type="text"
              value={addressLine3}
              onChange={(e) => setAddressLine3(e.target.value)}
              placeholder="e.g. Tejgoan, Dhaka-1212"
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="flex flex-col gap-4 border-b border-muted/80 pb-6">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Social Networks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Facebook URL</label>
            <input
              type="text"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Instagram URL</label>
            <input
              type="text"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">Twitter / X URL</label>
            <input
              type="text"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark text-xs">LinkedIn URL</label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Map Embed URL */}
      <div className="flex flex-col gap-4">
        <h2 className="font-marcellus text-lg font-bold text-dark-green">Map Location Iframe</h2>
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-dark text-xs">Google Map Embed Link (src attribute)</label>
          <textarea
            value={mapEmbedUrl}
            onChange={(e) => setMapEmbedUrl(e.target.value)}
            placeholder="Paste Google Maps iframe 'src' URL here..."
            className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary h-20 resize-none"
            required
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end border-t border-muted pt-6 mt-4">
        <button
          type="submit"
          className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl cursor-pointer disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Contact Info"}
        </button>
      </div>
    </form>
  );
}
