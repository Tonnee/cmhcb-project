"use client";

import * as React from "react";
import { HiPlus as PlusIcon, HiPencilSquare as PencilIcon, HiTrash as TrashIcon, HiCheck as CheckIcon, HiXMark as XIcon } from "react-icons/hi2";
import { EditTestimonialForm } from "./edit-testimonial-form";
import { deleteTestimonialAction } from "@/app/(admin)/admin/actions";

interface TestimonialDB {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  isFeatured: boolean;
  createdAt: Date | string;
}

interface SuccessStoriesClientWrapperProps {
  initialStories: TestimonialDB[];
}

export function SuccessStoriesClientWrapper({
  initialStories,
}: SuccessStoriesClientWrapperProps): React.JSX.Element {
  const [stories, setStories] = React.useState<TestimonialDB[]>(initialStories);
  const [selectedStory, setSelectedStory] = React.useState<TestimonialDB | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeletingId, setIsDeletingId] = React.useState<string | null>(null);

  // Sync props with state
  React.useEffect(() => {
    setStories(initialStories);
  }, [initialStories]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the success story of "${name}"?`)) {
      return;
    }
    setIsDeletingId(id);
    try {
      const res = await deleteTestimonialAction(id);
      if (res.success) {
        setStories(stories.filter((s) => s.id !== id));
      } else {
        alert(res.error || "Failed to delete success story.");
      }
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred.");
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
    window.location.reload();
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
            Manage client reviews, dynamic success stories, and toggle which ones appear on the home page.
          </p>
        </div>
        <div className="flex items-center gap-2">
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
                  <td colSpan={5} className="px-6 py-12 text-center text-light-ash text-sm">
                    No success stories found in database. Add one to get started!
                  </td>
                </tr>
              ) : (
                stories.map((story) => (
                  <tr key={story.id} className="hover:bg-light-ash/5 transition-colors">
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-muted/60 shrink-0 bg-light-ash/5">
                          <img
                            src={story.avatar || "/home-review/mental-health-therapy-client-woman.png"}
                            alt=""
                            className="w-full h-full object-cover"
                          />
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
                      <p className="line-clamp-2 italic">"{story.quote}"</p>
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
