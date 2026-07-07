"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiPlus, HiPencil, HiTrash, HiCalendar } from "react-icons/hi2";
import EditWorkshopForm from "./edit-workshop-form";
import { deleteWorkshopAction } from "@/app/(admin)/admin/actions";

interface WorkshopDB {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  author: string;
  tags: string; // JSON string
  isFeatured: boolean;
  content: string | null;
  gallery: string | null; // JSON string
}

interface WorkshopsClientWrapperProps {
  initialWorkshops: WorkshopDB[];
}

export default function WorkshopsClientWrapper({
  initialWorkshops,
}: WorkshopsClientWrapperProps): React.JSX.Element {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingWorkshop, setEditingWorkshop] = React.useState<WorkshopDB | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingWorkshop(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (workshop: WorkshopDB) => {
    setEditingWorkshop(workshop);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm("Are you sure you want to delete this workshop record permanently?")) {
      return;
    }
    setIsDeleting(id);
    try {
      const res = await deleteWorkshopAction(id, slug);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Failed to delete workshop record.");
      }
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingWorkshop(null);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header section with add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-marcellus text-3xl font-bold text-dark-green">
            Manage Events & Workshops
          </h1>
          <p className="font-sans text-sm text-light-ash">
            Create, edit, delete, and feature events and workshops dynamically.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary-dark text-white font-sans text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors duration-200 self-start sm:self-auto cursor-pointer"
        >
          <HiPlus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Main content - Table */}
      <div className="bg-white border border-muted rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="bg-light/35 border-b border-muted">
                <th className="px-6 py-4 font-semibold text-dark">Title</th>
                <th className="px-6 py-4 font-semibold text-dark">Instructor</th>
                <th className="px-6 py-4 font-semibold text-dark">Date & Time</th>
                <th className="px-6 py-4 font-semibold text-dark">Location</th>
                <th className="px-6 py-4 font-semibold text-dark text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/60">
              {initialWorkshops.map((workshop) => (
                <tr key={workshop.id} className="hover:bg-light/10 transition-colors">
                  <td className="px-6 py-4 font-medium text-dark-green max-w-xs truncate">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-primary/10 shrink-0 relative flex items-center justify-center text-primary-dark">
                        {workshop.image ? (
                          <img
                            src={workshop.image}
                            alt={workshop.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <HiCalendar className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="font-semibold text-dark truncate">{workshop.title}</span>
                        <span className="text-[10px] text-light-ash">/{workshop.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-light-ash">{workshop.author}</td>
                  <td className="px-6 py-4 text-light-ash text-xs">
                    <div>{workshop.date.substring(0, 10)}</div>
                    <div className="text-[10px] text-light-ash/80">{workshop.time}</div>
                  </td>
                  <td className="px-6 py-4 text-light-ash max-w-xs truncate">{workshop.location}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(workshop)}
                        className="p-2 text-light-ash hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                        title="Edit Workshop"
                      >
                        <HiPencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(workshop.id, workshop.slug)}
                        className="p-2 text-light-ash hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete Workshop"
                        disabled={isDeleting === workshop.id}
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {initialWorkshops.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-light-ash font-sans">
                    No workshops scheduled. Click "Create Workshop" to set up a new event.
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
            <EditWorkshopForm
              workshop={editingWorkshop}
              onClose={() => setIsModalOpen(false)}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
