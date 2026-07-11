"use client";

import * as React from "react";
import { HiPlus as PlusIcon, HiPencilSquare as PencilIcon, HiTrash as TrashIcon, HiPhoto, HiVideoCamera } from "react-icons/hi2";
import { EditGalleryItemForm } from "./edit-gallery-item-form";
import { deleteGalleryItemAction } from "@/app/(admin)/admin/actions";
import { useRouter } from "next/navigation";

interface GalleryItemDB {
  id: string;
  type: "image" | "video";
  src: string;
  thumbnailSrc?: string | null;
  alt: string;
  caption: string;
  category: "event" | "workshop" | "activity" | "occasion";
}

interface GalleryClientWrapperProps {
  initialItems: GalleryItemDB[];
}

export function GalleryClientWrapper({
  initialItems,
}: GalleryClientWrapperProps): React.JSX.Element {
  const router = useRouter();
  const [items, setItems] = React.useState<GalleryItemDB[]>(initialItems);
  const [selectedItem, setSelectedItem] = React.useState<GalleryItemDB | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeletingId, setIsDeletingId] = React.useState<string | null>(null);

  // Sync props with state
  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleDelete = async (id: string, caption: string) => {
    if (!confirm(`Are you sure you want to permanently delete the gallery item "${caption}"?`)) {
      return;
    }
    setIsDeletingId(id);
    try {
      const res = await deleteGalleryItemAction(id);
      if (res.success) {
        setItems(items.filter((item) => item.id !== id));
      } else {
        alert(res.error || "Failed to delete gallery item.");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleEditClick = (item: GalleryItemDB) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Upper Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-muted pb-5">
        <div>
          <h1 className="font-marcellus text-2xl font-bold text-dark-green">
            Manage Media Gallery
          </h1>
          <p className="font-sans text-sm text-light-ash">
            Manage pictures and videos rendered in the public Media Gallery page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddClick}
            className="bg-primary hover:bg-primary-dark text-white font-sans text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors duration-200 flex items-center gap-2 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Add Gallery Item
          </button>
        </div>
      </div>

      {/* Items Grid/List */}
      {items.length === 0 ? (
        <div className="bg-white border border-muted rounded-2xl py-12 text-center">
          <p className="font-marcellus text-lg text-dark mb-1">No Gallery Items Found</p>
          <p className="font-sans text-sm text-light-ash mb-4">
            Create your first gallery image or video highlight.
          </p>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center gap-2 px-4 py-2 border border-primary hover:bg-primary-dark hover:text-white text-primary text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" /> Create Gallery Item
          </button>
        </div>
      ) : (
        <div className="bg-white border border-muted rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-light-ash/5 border-b border-muted">
                  <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider w-40">
                    Preview
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider w-24">
                    Type
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider w-28">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider w-28 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted text-xs">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-page-bg/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-24 h-16 rounded-lg bg-muted border border-muted/50 overflow-hidden flex items-center justify-center shrink-0">
                        {item.type === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-primary-dark bg-secondary/10">
                            <HiVideoCamera className="w-6 h-6" />
                            <span className="text-[9px] font-semibold mt-1">Video</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-semibold uppercase text-[10px] tracking-wider text-dark select-none">
                        {item.type === "image" ? (
                          <>
                            <HiPhoto className="w-4 h-4 text-emerald-600" />
                            Image
                          </>
                        ) : (
                          <>
                            <HiVideoCamera className="w-4 h-4 text-indigo-600" />
                            Video
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-primary/10 text-primary-dark">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 max-w-xl">
                        <p className="font-semibold text-dark leading-relaxed line-clamp-2">
                          {item.caption}
                        </p>
                        <p className="text-light-ash text-[10px]">
                          <strong>Alt:</strong> {item.alt}
                        </p>
                        <a
                          href={item.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-dark hover:underline text-[10px] truncate max-w-sm block"
                        >
                          Source URL: {item.src}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-2 border border-muted hover:border-dark text-dark rounded-xl transition-all cursor-pointer"
                          title="Edit gallery item"
                        >
                          <PencilIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.caption)}
                          disabled={isDeletingId === item.id}
                          className="p-2 border border-muted hover:bg-rose-50 hover:border-rose-300 text-rose-600 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                          title="Delete gallery item"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* modal wrapper */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <EditGalleryItemForm
              initialItem={selectedItem}
              onClose={() => setIsModalOpen(false)}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
