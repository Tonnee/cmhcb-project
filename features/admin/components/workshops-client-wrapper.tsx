"use client";
import Image from "next/image";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HiPlus, HiPencil, HiTrash, HiCalendar, HiBars3, HiStar, HiFolder } from "react-icons/hi2";
import EditWorkshopForm from "./edit-workshop-form";
import { deleteWorkshopAction, reorderWorkshopsAction } from "@/app/(admin)/admin/actions";

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
  isLatest?: boolean;
  content: string | null;
  gallery: string | null; // JSON string
  order?: number;
}

interface WorkshopsClientWrapperProps {
  initialWorkshops: WorkshopDB[];
}

export default function WorkshopsClientWrapper({
  initialWorkshops,
}: WorkshopsClientWrapperProps): React.JSX.Element {
  const router = useRouter();
  const [workshops, setWorkshops] = React.useState<WorkshopDB[]>(initialWorkshops);
  const [activeTab, setActiveTab] = React.useState<"featured" | "more">("featured");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingWorkshop, setEditingWorkshop] = React.useState<WorkshopDB | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const workshopsRef = React.useRef<WorkshopDB[]>(initialWorkshops);
  const draggedIndexRef = React.useRef<number | null>(null);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [isReordering, setIsReordering] = React.useState(false);

  React.useEffect(() => {
    setWorkshops(initialWorkshops);
    workshopsRef.current = initialWorkshops;
  }, [initialWorkshops]);

  // Split workshops into Featured (1 Latest + up to 4 Featured) vs More Events
  const featuredWorkshops = workshops.filter((w) => w.isLatest || w.isFeatured);
  const moreWorkshops = workshops.filter((w) => !w.isLatest && !w.isFeatured);
  const displayedWorkshops = activeTab === "featured" ? featuredWorkshops : moreWorkshops;

  const featuredCount = workshops.filter((w) => w.isFeatured).length;

  // Drag and Drop handlers for reordering workshops within the active tab view
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    draggedIndexRef.current = index;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, targetIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const currentDragged = draggedIndexRef.current;
    if (currentDragged === null || currentDragged === targetIndex) return;

    const currentTabList = activeTab === "featured" ? featuredWorkshops : moreWorkshops;
    const draggedItem = currentTabList[currentDragged];
    const targetItem = currentTabList[targetIndex];

    if (!draggedItem || !targetItem) return;

    setWorkshops((prev) => {
      const updated = [...prev];
      const fromIndex = updated.findIndex((w) => w.id === draggedItem.id);
      const toIndex = updated.findIndex((w) => w.id === targetItem.id);

      if (fromIndex !== -1 && toIndex !== -1) {
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
      }
      workshopsRef.current = updated;
      return updated;
    });

    draggedIndexRef.current = targetIndex;
    setDraggedIndex(targetIndex);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    draggedIndexRef.current = null;
    setIsReordering(true);

    try {
      const currentList = workshopsRef.current;
      const orderedIds = currentList.map((w) => w.id);
      const res = await reorderWorkshopsAction(orderedIds);
      if (!res.success) {
        alert(res.error || "Failed to save new workshop order.");
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("Error saving workshop order:", err);
    } finally {
      setIsReordering(false);
    }
  };

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
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred.");
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
          <div className="flex items-center gap-3">
            <h1 className="font-marcellus text-3xl font-bold text-dark-green">
              Manage Events & Workshops
            </h1>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              featuredCount >= 4
                ? "bg-amber-100 text-amber-800 border border-amber-200"
                : "bg-primary/10 text-primary-dark border border-primary/20"
            }`}>
              Landing Featured: {featuredCount}/4
            </span>
          </div>
          <p className="font-sans text-sm text-light-ash">
            Manage and drag to reorder events. Top 4 featured events appear on the landing page.
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

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-muted pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("featured")}
          className={`px-4 py-2.5 rounded-xl font-sans text-sm font-semibold transition-all cursor-pointer flex items-center gap-2.5 ${
            activeTab === "featured"
              ? "bg-primary text-white shadow-sm"
              : "bg-light/40 text-dark-green hover:bg-light/70"
          }`}
        >
          <HiStar className="w-4 h-4" />
          <span>Featured Events & Workshops</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
            activeTab === "featured" ? "bg-white/20 text-white" : "bg-primary/10 text-primary-dark"
          }`}>
            {featuredWorkshops.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("more")}
          className={`px-4 py-2.5 rounded-xl font-sans text-sm font-semibold transition-all cursor-pointer flex items-center gap-2.5 ${
            activeTab === "more"
              ? "bg-primary text-white shadow-sm"
              : "bg-light/40 text-dark-green hover:bg-light/70"
          }`}
        >
          <HiFolder className="w-4 h-4" />
          <span>More Events & Workshops</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
            activeTab === "more" ? "bg-white/20 text-white" : "bg-primary/10 text-primary-dark"
          }`}>
            {moreWorkshops.length}
          </span>
        </button>
      </div>

      {/* Main content - Table */}
      <div className="bg-white border border-muted rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="bg-light/35 border-b border-muted">
                <th className="px-4 py-4 text-xs font-semibold text-dark uppercase tracking-wider text-center w-16">
                  Order
                </th>
                <th className="px-6 py-4 font-semibold text-dark">Title</th>
                <th className="px-6 py-4 font-semibold text-dark">Instructor</th>
                <th className="px-6 py-4 font-semibold text-dark">Date & Time</th>
                <th className="px-6 py-4 font-semibold text-dark">Location</th>
                <th className="px-6 py-4 font-semibold text-dark text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/60">
              {displayedWorkshops.map((workshop, index) => (
                <tr
                  key={workshop.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`transition-all duration-150 ${
                    draggedIndex === index
                      ? "bg-primary/10 opacity-70 border-2 border-dashed border-primary cursor-grabbing"
                      : "hover:bg-light/10 cursor-grab"
                  }`}
                >
                  <td className="px-4 py-4 text-center shrink-0">
                    <div className="flex items-center justify-center gap-1.5 text-light-ash">
                      <HiBars3
                        className="w-4 h-4 text-light-ash/50 hover:text-primary shrink-0 cursor-grab active:cursor-grabbing"
                        title="Drag up or down to reorder event card serial"
                      />
                      <span className="font-semibold text-dark-green text-sm shrink-0 font-mono">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-dark-green max-w-xs truncate">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-primary/10 shrink-0 relative flex items-center justify-center text-primary-dark">
                        {workshop.image ? (
                          <Image src={workshop.image} alt={workshop.title} width={48} height={48} unoptimized className="w-12 h-12 object-cover rounded-xl" />
                        ) : (
                          <HiCalendar className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="font-semibold text-dark truncate">{workshop.title}</span>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span className="text-[10px] text-light-ash">/{workshop.slug}</span>
                          {workshop.isLatest && (
                            <span className="bg-primary/10 text-primary-dark text-[9px] font-semibold px-1.5 py-0.2 rounded">
                              Workshops Latest (Hero)
                            </span>
                          )}
                          {workshop.isFeatured && (
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-semibold px-1.5 py-0.2 rounded">
                              Landing Upcoming
                            </span>
                          )}
                        </div>
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

              {displayedWorkshops.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-light-ash font-sans">
                    {activeTab === "featured"
                      ? "No featured events or workshops marked."
                      : "No additional events scheduled. Click \u201cCreate Event\u201d to set up a new event."}
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
              currentFeaturedCount={featuredCount}
            />
          </div>
        </div>
      )}
    </div>
  );
}