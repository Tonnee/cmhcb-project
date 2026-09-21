"use client";
import Image from "next/image";

import * as React from "react";
import {
  HiPlus as PlusIcon,
  HiPencilSquare as PencilIcon,
  HiTrash as TrashIcon,
  HiCheck as CheckIcon,
  HiXMark as XIcon,
  HiBars3 as BarsIcon,
} from "react-icons/hi2";
import { EditTestimonialForm } from "./edit-testimonial-form";
import { deleteTestimonialAction, reorderTestimonialsAction } from "@/app/(admin)/admin/actions";
import { useRouter } from "next/navigation";

interface TestimonialDB {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  isFeatured: boolean;
  order?: number;
  createdAt: Date | string;
}

interface SuccessStoriesClientWrapperProps {
  initialStories: TestimonialDB[];
}

export function SuccessStoriesClientWrapper({
  initialStories,
}: SuccessStoriesClientWrapperProps): React.JSX.Element {
  const router = useRouter();
  const [stories, setStories] = React.useState<TestimonialDB[]>(initialStories);
  const [selectedStory, setSelectedStory] = React.useState<TestimonialDB | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeletingId, setIsDeletingId] = React.useState<string | null>(null);

  // Drag & Reorder state
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const draggedIndexRef = React.useRef<number | null>(null);
  const storiesRef = React.useRef<TestimonialDB[]>(stories);
  const [isReordering, setIsReordering] = React.useState(false);

  // Sync props with state
  React.useEffect(() => {
    setStories(initialStories);
    storiesRef.current = initialStories;
  }, [initialStories]);

  // Drag and Drop handlers for reordering success stories
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

    const currentList = storiesRef.current;
    const draggedItem = currentList[currentDragged];
    const targetItem = currentList[targetIndex];

    if (!draggedItem || !targetItem) return;

    setStories((prev) => {
      const updated = [...prev];
      const fromIndex = updated.findIndex((s) => s.id === draggedItem.id);
      const toIndex = updated.findIndex((s) => s.id === targetItem.id);

      if (fromIndex !== -1 && toIndex !== -1) {
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
      }
      storiesRef.current = updated;
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
      const currentList = storiesRef.current;
      const orderedIds = currentList.map((s) => s.id);
      const res = await reorderTestimonialsAction(orderedIds);
      if (!res.success) {
        alert(res.error || "Failed to save new success story order.");
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("Error saving success story order:", err);
    } finally {
      setIsReordering(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the success story of "${name}"?`)) {
      return;
    }
    setIsDeletingId(id);
    try {
      const res = await deleteTestimonialAction(id);
      if (res.success) {
        const updated = stories.filter((s) => s.id !== id);
        setStories(updated);
        storiesRef.current = updated;
      } else {
        alert(res.error || "Failed to delete success story.");
      }
    } catch (err) {
      alert(err instanceof Error ? (err instanceof Error ? err.message : String(err)) : "An unexpected error occurred.");
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleEditClick = (story: TestimonialDB) => {
    setSelectedStory(story);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedStory(null);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedStory(null);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Upper Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-muted pb-5">
        <div>
          <h1 className="font-marcellus text-2xl font-bold text-dark-green">
            Manage Success Stories / Feedback
          </h1>
          <p className="font-sans text-sm text-light-ash">
            Drag to reorder stories (determines card sequence on the <span className="font-semibold text-primary">/success-stories</span> page). Toggle which ones appear on the home page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isReordering && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary-dark border border-primary/20 animate-pulse">
              Saving order...
            </span>
          )}
          <button
            onClick={handleAddClick}
            className="bg-primary hover:bg-primary-dark text-white font-sans text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors duration-200 flex items-center gap-2 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Add Success Story
          </button>
        </div>
      </div>

      {/* Stories Table */}
      <div className="bg-white border border-muted rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-light-ash/5 border-b border-muted">
                <th className="px-4 py-4 text-xs font-semibold text-dark uppercase tracking-wider text-center w-16">
                  Order
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider">
                  Client / Avatar
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider">
                  Designation / Role
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider">
                  Feedback Quote Preview
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider text-center">
                  Featured on Home
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {stories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-light-ash text-sm">
                    No success stories found in database. Add one to get started!
                  </td>
                </tr>
              ) : (
                stories.map((story, index) => (
                  <tr
                    key={story.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`transition-all duration-150 ${
                      draggedIndex === index
                        ? "bg-primary/10 opacity-70 border-2 border-dashed border-primary cursor-grabbing"
                        : "hover:bg-light-ash/5 cursor-grab"
                    }`}
                  >
                    <td className="px-4 py-4.5 text-center shrink-0">
                      <div className="flex items-center justify-center gap-1.5 text-light-ash">
                        <BarsIcon
                          className="w-4 h-4 text-light-ash/50 hover:text-primary shrink-0 cursor-grab active:cursor-grabbing"
                          title="Drag up or down to reorder story"
                        />
                        <span className="font-semibold text-dark-green text-sm shrink-0 font-mono">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-muted/60 shrink-0 bg-light-ash/5">
                          <Image src={story.avatar || "/home-review/mental-health-therapy-client-woman.png"} alt={story.name} width={48} height={48} unoptimized className="w-12 h-12 object-cover rounded-xl" />
                        </div>
                        <div className="font-semibold text-dark text-sm leading-snug">
                          {story.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-sm text-dark font-medium">
                      {story.role}
                    </td>
                    <td className="px-6 py-4.5 text-sm text-light-ash max-w-sm">
                      <p className="line-clamp-2 italic">&ldquo;{story.quote}&rdquo;</p>
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      {story.isFeatured ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium border border-green-100">
                          <CheckIcon className="w-3 h-3" /> Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-light-ash/10 text-light-ash px-2.5 py-1 rounded-full text-xs font-medium">
                          <XIcon className="w-3 h-3" /> Standard
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(story)}
                          className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                          title="Edit Story"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(story.id, story.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Story"
                          disabled={isDeletingId === story.id}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-dark-green/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-6 border border-muted animate-in fade-in zoom-in-95 duration-150">
            <EditTestimonialForm
              initialTestimonial={selectedStory}
              onClose={() => setIsModalOpen(false)}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}