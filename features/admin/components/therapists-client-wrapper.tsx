"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiPlus, HiPencil, HiTrash, HiUser } from "react-icons/hi2";
import EditTherapistForm from "./edit-therapist-form";
import { deleteTherapistAction } from "@/app/(admin)/admin/actions";

interface TherapistDB {
  id: string;
  image: string;
  name: string;
  role: string;
  bio: string;
  education: string;
  training: string;
  expertise: string;
  experience: string;
  fees: string;
  services: string;
  activities: string;
}

interface TherapistsClientWrapperProps {
  initialTherapists: TherapistDB[];
}

export default function TherapistsClientWrapper({
  initialTherapists,
}: TherapistsClientWrapperProps): React.JSX.Element {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTherapist, setEditingTherapist] = React.useState<TherapistDB | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingTherapist(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (therapist: TherapistDB) => {
    setEditingTherapist(therapist);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this therapist record permanently?")) {
      return;
    }
    setIsDeleting(id);
    try {
      const res = await deleteTherapistAction(id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Failed to delete therapist record.");
      }
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingTherapist(null);
    router.refresh();
  };

  // Derive unique primary roles from existing therapists
  const existingRoles = Array.from(
    new Set(
      initialTherapists.map((t) => t.role.split("|")[0].trim())
    )
  );
  const defaultRoles = [
    "Clinical Psychologist",
    "Counseling Psychologist",
    "Counselor",
    "Psychotherapist",
    "Child Psychologist",
    "Psychiatrist"
  ];
  const allRoles = Array.from(new Set([...defaultRoles, ...existingRoles]));

  return (
    <div className="flex flex-col gap-8">
      {/* Header section with add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-marcellus text-3xl font-bold text-dark-green">
            Manage Therapists
          </h1>
          <p className="font-sans text-sm text-light-ash">
            View, edit, suspend, or add new professional therapists to the CMHC,B register.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary-dark text-white font-sans text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors duration-200 self-start sm:self-auto cursor-pointer"
        >
          <HiPlus className="w-5 h-5" />
          Add Therapist
        </button>
      </div>

      {/* Main content - Table */}
      <div className="bg-white border border-muted rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="bg-light/35 border-b border-muted">
                <th className="px-6 py-4 font-semibold text-dark">Name</th>
                <th className="px-6 py-4 font-semibold text-dark">Specialty/Role</th>
                <th className="px-6 py-4 font-semibold text-dark">Services</th>
                <th className="px-6 py-4 font-semibold text-dark text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/60">
              {initialTherapists.map((therapist) => {
                let servicesArray: string[] = [];
                try {
                  servicesArray = JSON.parse(therapist.services);
                } catch {
                  servicesArray = [];
                }

                return (
                  <tr key={therapist.id} className="hover:bg-light/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-primary/10 border border-primary/20 shrink-0 relative flex items-center justify-center text-primary-dark">
                          {therapist.image ? (
                            <img
                              src={therapist.image}
                              alt={therapist.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <HiUser className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-dark">{therapist.name}</span>
                          <span className="text-xs text-light-ash">ID: {therapist.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-light-ash">{therapist.role}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {servicesArray.map((service) => (
                          <span
                            key={service}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-light text-light-ash border border-muted/80 capitalize"
                          >
                            {service.replace("-", " ")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(therapist)}
                          className="p-2 text-light-ash hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                          title="Edit Therapist"
                        >
                          <HiPencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(therapist.id)}
                          className="p-2 text-light-ash hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Therapist"
                          disabled={isDeleting === therapist.id}
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {initialTherapists.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-light-ash font-sans">
                    No therapists registered. Click "Add Therapist" to register a practitioner.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-4xl w-full border border-muted relative animate-in fade-in zoom-in duration-200">
            <EditTherapistForm
              therapist={editingTherapist}
              onClose={() => setIsModalOpen(false)}
              onSuccess={handleFormSuccess}
              availableRoles={allRoles}
            />
          </div>
        </div>
      )}
    </div>
  );
}
