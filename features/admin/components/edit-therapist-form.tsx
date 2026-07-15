"use client";

import * as React from "react";
import { uploadImageToSupabase } from "@/lib/supabase";
import { upsertTherapistAction, getAllServicesForFormAction } from "@/app/(admin)/admin/actions";
import { HiPlus, HiTrash, HiXMark } from "react-icons/hi2";
import { safeJsonParse } from "@/lib/json";
import { z } from "zod";

interface FeeItem {
  label: string;
  amount: string;
  note?: string;
}

interface FeeCategory {
  category: string;
  items: FeeItem[];
  serviceId?: string; // set on auto-generated categories so they can be removed when unchecked
}

interface TherapistFormProps {
  therapist?: {
    id: string;
    name: string;
    role: string;
    bio: string;
    image: string;
    education: string; // JSON string
    training: string; // JSON string
    expertise: string; // JSON string
    experience: string; // JSON string
    fees: string; // JSON string
    services: string; // JSON string
    activities: string; // JSON string
    lastUpdatedBy?: string | null;
    updatedAt?: string | Date;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
  availableRoles: string[];
}


export default function EditTherapistForm({
  therapist,
  onClose,
  onSuccess,
  availableRoles,
}: TherapistFormProps): React.JSX.Element {
  // Input fields state
  const [name, setName] = React.useState(therapist?.name || "");
  const [bio, setBio] = React.useState(therapist?.bio || "");
  const [imageUrl, setImageUrl] = React.useState(therapist?.image || "");

  const [primaryRole, setPrimaryRole] = React.useState(() => {
    if (!therapist?.role) return "";
    const primary = therapist.role.split("|")[0].trim();
    if (availableRoles.includes(primary)) {
      return primary;
    }
    return "custom";
  });

  const [customRoleText, setCustomRoleText] = React.useState(() => {
    if (!therapist?.role) return "";
    const primary = therapist.role.split("|")[0].trim();
    if (availableRoles.includes(primary)) {
      return "";
    }
    return primary;
  });

  const [isCustomRole, setIsCustomRole] = React.useState(() => {
    if (!therapist?.role) return false;
    const primary = therapist.role.split("|")[0].trim();
    return !availableRoles.includes(primary);
  });

  const [extraCredentials, setExtraCredentials] = React.useState(() => {
    if (!therapist?.role) return "";
    const parts = therapist.role.split("|");
    if (parts.length <= 1) return "";
    return parts.slice(1).join("|").trim();
  });
  
  // Lists state
  const [education, setEducation] = React.useState<string[]>(() =>
    therapist ? safeJsonParse<string[]>(therapist.education, []) : []
  );
  const [training, setTraining] = React.useState<string[]>(() =>
    therapist ? safeJsonParse<string[]>(therapist.training, []) : []
  );
  const [expertise, setExpertise] = React.useState<string[]>(() =>
    therapist ? safeJsonParse<string[]>(therapist.expertise, []) : []
  );
  const [experience, setExperience] = React.useState<string[]>(() =>
    therapist ? safeJsonParse<string[]>(therapist.experience, []) : []
  );
  const [services, setServices] = React.useState<string[]>(() =>
    therapist ? safeJsonParse<string[]>(therapist.services, []) : []
  );
  const [fees, setFees] = React.useState<FeeCategory[]>(() =>
    therapist ? safeJsonParse<FeeCategory[]>(therapist.fees, []) : []
  );

  // Loading & error states
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  // Dynamic services list loaded from DB
  const [availableServices, setAvailableServices] = React.useState<{ id: string; label: string }[]>([]);

  React.useEffect(() => {
    getAllServicesForFormAction().then((res) => {
      if (res.success) {
        setAvailableServices(res.data.map((s) => ({ id: s.slug, label: s.title })));
      }
    });
  }, []);

  // Array item state helpers
  const [newEdu, setNewEdu] = React.useState("");
  const [newTrain, setNewTrain] = React.useState("");
  const [newExp, setNewExp] = React.useState("");
  const [newExpert, setNewExpert] = React.useState("");

  // Handling Image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg("");
    try {
      const publicUrl = await uploadImageToSupabase(file);
      setImageUrl(publicUrl);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload image. Ensure Supabase credentials are set.");
    } finally {
      setIsUploading(false);
    }
  };

  // Adding items to arrays
  const addEdu = () => {
    if (newEdu.trim()) {
      setEducation([...education, newEdu.trim()]);
      setNewEdu("");
    }
  };
  const addTrain = () => {
    if (newTrain.trim()) {
      setTraining([...training, newTrain.trim()]);
      setNewTrain("");
    }
  };
  const addExpert = () => {
    if (newExpert.trim()) {
      setExpertise([...expertise, newExpert.trim()]);
      setNewExpert("");
    }
  };
  const addExp = () => {
    if (newExp.trim()) {
      setExperience([...experience, newExp.trim()]);
      setNewExp("");
    }
  };

  // Handle service checkbox toggles — auto-add/remove matching fee category
  const handleServiceToggle = (serviceId: string) => {
    if (services.includes(serviceId)) {
      // Uncheck: remove service and delete its linked fee category
      setServices(services.filter((s) => s !== serviceId));
      setFees((prev) => prev.filter((cat) => cat.serviceId !== serviceId));
    } else {
      // Check: add service and auto-create a locked fee category named after it
      setServices([...services, serviceId]);
      const serviceLabel = availableServices.find((s) => s.id === serviceId)?.label ?? serviceId;
      const alreadyExists = fees.some((cat) => cat.serviceId === serviceId);
      if (!alreadyExists) {
        setFees((prev) => [
          ...prev,
          {
            serviceId,
            category: serviceLabel,
            items: [{ label: "50-minute session", amount: "BDT 2,000" }],
          },
        ]);
      }
    }
  };

  // Fee category management helpers
  const addFeeCategory = () => {
    setFees([...fees, { category: "New Service Category", items: [{ label: "Session description", amount: "BDT 2,000" }] }]);
  };
  const updateCategoryName = (catIndex: number, newName: string) => {
    const updated = [...fees];
    updated[catIndex].category = newName;
    setFees(updated);
  };
  const addFeeItem = (catIndex: number) => {
    const updated = [...fees];
    updated[catIndex].items.push({ label: "New session tier", amount: "BDT 2,500" });
    setFees(updated);
  };
  const updateFeeItem = (catIndex: number, itemIndex: number, key: keyof FeeItem, val: string) => {
    const updated = [...fees];
    updated[catIndex].items[itemIndex] = {
      ...updated[catIndex].items[itemIndex],
      [key]: val,
    };
    setFees(updated);
  };
  const deleteFeeItem = (catIndex: number, itemIndex: number) => {
    const updated = [...fees];
    updated[catIndex].items.splice(itemIndex, 1);
    // If empty category, remove it too
    if (updated[catIndex].items.length === 0) {
      updated.splice(catIndex, 1);
    }
    setFees(updated);
  };

  // Validation schema
  const therapistSchema = z.object({
    name: z.string().min(1, "Name is required"),
    role: z.string().min(1, "Role is required"),
    bio: z.string().min(1, "Bio is required"),
    image: z.string().min(1, "Image is required"),
  });

  // Submit form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || isUploading) return;

    setIsSaving(true);
    setErrorMsg("");

    const finalPrimary = isCustomRole ? customRoleText.trim() : primaryRole;
    const finalRole = extraCredentials.trim()
      ? `${finalPrimary} | ${extraCredentials.trim()}`
      : finalPrimary;

    if (!finalPrimary) {
      setErrorMsg("Role / specialty is required.");
      setIsSaving(false);
      return;
    }

    try {
      const payload = {
        id: therapist?.id,
        name,
        role: finalRole,
        bio,
        image: imageUrl,
        education,
        training,
        expertise,
        experience,
        // Strip internal serviceId markers before persisting
        fees: fees.map(({ serviceId: _sid, ...rest }) => rest),
        services,
        activities: therapist ? safeJsonParse<any[]>(therapist.activities, []) : [],
      };

      // Zod validation on client
      const validation = therapistSchema.safeParse(payload);
      if (!validation.success) {
        setErrorMsg(validation.error.issues.map((issue) => issue.message).join(", "));
        setIsSaving(false);
        return;
      }

      const result = await upsertTherapistAction(payload);

      if (result.success) {
        onSuccess();
      } else {
        setErrorMsg(result.error || "Failed to save therapist details.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2 font-sans">
      <div className="flex items-center justify-between border-b border-muted pb-4">
        <div className="flex flex-col">
          <h2 className="font-marcellus text-xl font-bold text-dark-green">
            {therapist ? "Edit Therapist Record" : "Add New Therapist"}
          </h2>
          {therapist?.lastUpdatedBy && (
            <span className="text-[11px] text-light-ash/70 mt-0.5">
              Last updated by <span className="font-semibold text-primary">{therapist.lastUpdatedBy}</span> on {therapist.updatedAt ? new Date(therapist.updatedAt).toLocaleString() : ""}
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

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-sans font-medium border border-red-100">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-sans text-sm">
        {/* Core fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Sabrina Ahmed"
              className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-dark">Role / Credentials</label>
            <div className="flex flex-col gap-2">
              <select
                value={primaryRole}
                onChange={(e) => {
                  const val = e.target.value;
                  setPrimaryRole(val);
                  if (val === "custom") {
                    setIsCustomRole(true);
                  } else {
                    setIsCustomRole(false);
                  }
                }}
                className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm cursor-pointer"
                required
              >
                <option value="" disabled>Select primary role...</option>
                {availableRoles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
                <option value="custom">+ Add Custom Role...</option>
              </select>

              {isCustomRole && (
                <input
                  type="text"
                  value={customRoleText}
                  onChange={(e) => setCustomRoleText(e.target.value)}
                  placeholder="Type new role (e.g. Art Therapist)"
                  className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm"
                  required
                />
              )}

              <input
                type="text"
                value={extraCredentials}
                onChange={(e) => setExtraCredentials(e.target.value)}
                placeholder="Extra credentials (optional, e.g. Trainer | Assessor)"
                className="w-full px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-dark">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write therapist background, approach, and credentials..."
            className="w-full h-24 px-3.5 py-2 border border-muted rounded-xl bg-page-bg/50 focus:outline-none focus:border-primary resize-none"
            required
          />
        </div>

        {/* Image upload */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-light/10 p-4 rounded-xl border border-muted/50">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="w-16 h-16 rounded-full object-cover border border-primary shrink-0"
            />
          )}
          <div className="flex-1 flex flex-col gap-1">
            <span className="font-semibold text-dark">Profile Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary-dark hover:file:bg-primary/20 text-xs text-light-ash"
              disabled={isUploading}
            />
          </div>
          {isUploading && <span className="text-xs text-primary font-medium animate-pulse">Uploading image to Supabase...</span>}
        </div>

        {/* Services mapping */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-dark">Services offered</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableServices.map((s) => (
              <label key={s.id} className="flex items-center gap-2 cursor-pointer text-light-ash">
                <input
                  type="checkbox"
                  checked={services.includes(s.id)}
                  onChange={() => handleServiceToggle(s.id)}
                  className="rounded border-muted text-primary focus:ring-primary w-4 h-4"
                />
                {s.label}
              </label>
            ))}
          </div>
        </div>

        {/* Fees Editor — shown directly below services, driven by checkbox selection */}
        {fees.length > 0 && (
          <div className="flex flex-col gap-3 p-4 bg-light/10 rounded-2xl border border-muted/50">
            <div className="flex justify-between items-center border-b border-muted pb-2">
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-dark">Fees Categories & Rates</span>
                <span className="text-[11px] text-light-ash">Fee categories are tied to the services checked above.</span>
              </div>
              <button
                type="button"
                onClick={addFeeCategory}
                className="text-xs text-primary font-semibold hover:text-primary-dark flex items-center gap-1"
              >
                <HiPlus className="w-3.5 h-3.5" /> Add Category
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {fees.map((cat, catIdx) => (
                <div key={catIdx} className="bg-white p-3 rounded-xl border border-muted flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {cat.serviceId ? (
                      // Service-linked category: name is fixed and read-only
                      <span className="flex-1 font-semibold text-dark text-xs py-1 border-b border-muted/40">
                        {cat.category}
                      </span>
                    ) : (
                      // Manually-added category: name is editable
                      <input
                        type="text"
                        value={cat.category}
                        onChange={(e) => updateCategoryName(catIdx, e.target.value)}
                        className="flex-1 font-semibold text-dark border-b border-muted focus:outline-none focus:border-primary text-xs py-1"
                        placeholder="Category Name"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => addFeeItem(catIdx)}
                      className="text-[10px] text-primary hover:underline"
                    >
                      + Add Item
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {cat.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => updateFeeItem(catIdx, itemIdx, "label", e.target.value)}
                          placeholder="Session (e.g. 50-minute)"
                          className="px-2 py-1 border border-muted rounded text-xs focus:outline-none focus:border-primary"
                        />
                        <input
                          type="text"
                          value={item.amount}
                          onChange={(e) => updateFeeItem(catIdx, itemIdx, "amount", e.target.value)}
                          placeholder="Amount (e.g. BDT 2,000)"
                          className="px-2 py-1 border border-muted rounded text-xs focus:outline-none focus:border-primary"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.note || ""}
                            onChange={(e) => updateFeeItem(catIdx, itemIdx, "note", e.target.value)}
                            placeholder="Note (optional)"
                            className="flex-1 px-2 py-1 border border-muted rounded text-xs focus:outline-none focus:border-primary"
                          />
                          <button
                            type="button"
                            onClick={() => deleteFeeItem(catIdx, itemIdx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <HiTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Arrays section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education */}
          <div className="flex flex-col gap-3 p-4 bg-light/10 rounded-2xl border border-muted/50">
            <span className="font-semibold text-dark border-b border-muted pb-1">Education</span>
            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
              {education.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-1.5 bg-white rounded-lg border border-muted/60 text-xs">
                  <span className="text-light-ash">{item}</span>
                  <button type="button" onClick={() => setEducation(education.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">
                    <HiTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newEdu}
                onChange={(e) => setNewEdu(e.target.value)}
                placeholder="e.g. MS in Psychology"
                className="flex-1 px-3 py-1.5 border border-muted rounded-lg text-xs focus:outline-none"
              />
              <button type="button" onClick={addEdu} className="p-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark">
                <HiPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Training */}
          <div className="flex flex-col gap-3 p-4 bg-light/10 rounded-2xl border border-muted/50">
            <span className="font-semibold text-dark border-b border-muted pb-1">Training</span>
            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
              {training.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-1.5 bg-white rounded-lg border border-muted/60 text-xs">
                  <span className="text-light-ash">{item}</span>
                  <button type="button" onClick={() => setTraining(training.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">
                    <HiTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTrain}
                onChange={(e) => setNewTrain(e.target.value)}
                placeholder="e.g. CBT Cert"
                className="flex-1 px-3 py-1.5 border border-muted rounded-lg text-xs focus:outline-none"
              />
              <button type="button" onClick={addTrain} className="p-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark">
                <HiPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expertise */}
          <div className="flex flex-col gap-3 p-4 bg-light/10 rounded-2xl border border-muted/50">
            <span className="font-semibold text-dark border-b border-muted pb-1">Areas of Expertise</span>
            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
              {expertise.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-1.5 bg-white rounded-lg border border-muted/60 text-xs">
                  <span className="text-light-ash">{item}</span>
                  <button type="button" onClick={() => setExpertise(expertise.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">
                    <HiTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newExpert}
                onChange={(e) => setNewExpert(e.target.value)}
                placeholder="e.g. Anxiety, Depression"
                className="flex-1 px-3 py-1.5 border border-muted rounded-lg text-xs focus:outline-none"
              />
              <button type="button" onClick={addExpert} className="p-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark">
                <HiPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Experience */}
          <div className="flex flex-col gap-3 p-4 bg-light/10 rounded-2xl border border-muted/50">
            <span className="font-semibold text-dark border-b border-muted pb-1">Experience Highlights</span>
            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
              {experience.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-1.5 bg-white rounded-lg border border-muted/60 text-xs">
                  <span className="text-light-ash">{item}</span>
                  <button type="button" onClick={() => setExperience(experience.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">
                    <HiTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newExp}
                onChange={(e) => setNewExp(e.target.value)}
                placeholder="e.g. 500+ Sessions Conducted"
                className="flex-1 px-3 py-1.5 border border-muted rounded-lg text-xs focus:outline-none"
              />
              <button type="button" onClick={addExp} className="p-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark">
                <HiPlus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>


        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-muted pt-4">
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
            {isSaving ? "Saving..." : "Save Therapist"}
          </button>
        </div>
      </form>
    </div>
  );
}
