"use client";

import * as React from "react";
import { HiPlus, HiPencilSquare, HiTrash, HiMagnifyingGlass, HiDocumentText } from "react-icons/hi2";
import { EditTrainingForm } from "./edit-training-form";
import { EditTrainingInfoBlockForm } from "./edit-training-info-block-form";
import { deleteTrainingAction, deleteTrainingInfoBlockAction } from "@/app/(admin)/admin/actions";
import { useRouter } from "next/navigation";

interface TrainingDB {
  id: string;
  title: string;
  slug: string;
  heroTitle: string;
  heroDescription: string;
  introTitle: string;
  introDescription: string;
  sections: string; // JSON string
  faq: string; // JSON string
  features: string; // JSON string
  duration: string;
  fees: string;
  variant: string;
  image?: string | null;
  bgImage?: string | null;
  lastUpdatedBy?: string | null;
  updatedAt: Date;
}

interface TrainingInfoBlockDB {
  id: string;
  heading: string;
  items: string; // JSON string of string[]
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  order: number;
}

interface TrainingsClientWrapperProps {
  initialTrainings: TrainingDB[];
  initialInfoBlocks: TrainingInfoBlockDB[];
}

export default function TrainingsClientWrapper({
  initialTrainings,
  initialInfoBlocks,
}: TrainingsClientWrapperProps): React.JSX.Element {
  const router = useRouter();
  const [trainings, setTrainings] = React.useState<TrainingDB[]>(initialTrainings);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTraining, setSelectedTraining] = React.useState<TrainingDB | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeletingId, setIsDeletingId] = React.useState<string | null>(null);

  // Tab & Info Block states
  const [activeTab, setActiveTab] = React.useState<"trainings" | "infoblocks">("trainings");
  const [infoBlocks, setInfoBlocks] = React.useState<TrainingInfoBlockDB[]>(initialInfoBlocks);
  const [selectedBlock, setSelectedBlock] = React.useState<TrainingInfoBlockDB | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = React.useState(false);
  const [isDeletingBlockId, setIsDeletingBlockId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setTrainings(initialTrainings);
    setInfoBlocks(initialInfoBlocks);
  }, [initialTrainings, initialInfoBlocks]);

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm("Are you sure you want to permanently delete this training program? This action cannot be undone.")) {
      return;
    }
    setIsDeletingId(id);
    try {
      const res = await deleteTrainingAction(id, slug);
      if (res.success) {
        setTrainings(trainings.filter((t) => t.id !== id));
      } else {
        alert(res.error || "Failed to delete training program.");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleEditClick = (training: TrainingDB) => {
    setSelectedTraining(training);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedTraining(null);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedTraining(null);
    setIsBlockModalOpen(false);
    setSelectedBlock(null);
    router.refresh();
  };

  const handleBlockDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this training page info block?")) {
      return;
    }
    setIsDeletingBlockId(id);
    try {
      const res = await deleteTrainingInfoBlockAction(id);
      if (res.success) {
        setInfoBlocks(infoBlocks.filter((b) => b.id !== id));
      } else {
        alert(res.error || "Failed to delete block.");
      }
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred.");
    } finally {
      setIsDeletingBlockId(null);
    }
  };

  // Filter trainings based on search query
  const filteredTrainings = trainings.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-muted/50 pb-5">
        <div>
          <h1 className="font-marcellus text-2xl md:text-3xl font-bold text-dark-green">
            Manage Training & Page Blocks
          </h1>
          <p className="text-light-ash text-sm">
            Configure dynamic training programs and customize page-level informational content blocks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "trainings" ? (
            <button
              onClick={handleAddClick}
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer text-sm shadow-md"
            >
              <HiPlus className="w-5 h-5" />
              Add Training Program
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedBlock(null);
                setIsBlockModalOpen(true);
              }}
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer text-sm shadow-md"
            >
              <HiPlus className="w-5 h-5" />
              Add Info Block
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-muted/50 -mt-2">
        <button
          onClick={() => setActiveTab("trainings")}
          className={`px-5 py-2.5 font-sans text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "trainings"
              ? "border-primary text-primary-dark"
              : "border-transparent text-light-ash hover:text-dark"
          }`}
        >
          Training Programs ({trainings.length})
        </button>
        <button
          onClick={() => setActiveTab("infoblocks")}
          className={`px-5 py-2.5 font-sans text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "infoblocks"
              ? "border-primary text-primary-dark"
              : "border-transparent text-light-ash hover:text-dark"
          }`}
        >
          Split Content Info Blocks ({infoBlocks.length})
        </button>
      </div>

      {/* Dynamic Tab Body */}
      {activeTab === "trainings" ? (
        <div className="bg-white border border-muted/50 rounded-2xl shadow-sm overflow-hidden">
          {/* Search bar inside header */}
          <div className="p-4 border-b border-muted/50 flex items-center bg-light/10">
            <div className="relative max-w-md w-full">
              <HiMagnifyingGlass className="w-5 h-5 text-light-ash/60 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search trainings by title or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-muted bg-white focus:outline-none focus:border-primary rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Directory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-light/20 text-xs font-semibold text-light-ash uppercase tracking-wider border-b border-muted/50">
                  <th className="px-6 py-4">Program Details</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Fees</th>
                  <th className="px-6 py-4">Card Variant</th>
                  <th className="px-6 py-4">Last Modified By</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/30 text-sm">
                {filteredTrainings.length > 0 ? (
                  filteredTrainings.map((t) => {
                    return (
                      <tr key={t.id} className="hover:bg-light/10 transition-colors">
                        {/* Title & Slug */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-dark truncate text-base">
                              {t.title}
                            </span>
                            <span className="text-xs text-light-ash truncate font-mono">
                              /training/{t.slug}
                            </span>
                          </div>
                        </td>

                        {/* Duration */}
                        <td className="px-6 py-4 text-light-ash font-medium">
                          {t.duration}
                        </td>

                        {/* Fees */}
                        <td className="px-6 py-4 text-primary-dark font-semibold">
                          {t.fees}
                        </td>

                        {/* Badge Variant */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide border ${
                            t.variant === "primary"
                              ? "text-primary-dark bg-primary/5 border-primary/20"
                              : t.variant === "secondary"
                              ? "text-green-700 bg-green-50 border-green-200"
                              : "text-amber-700 bg-amber-50 border-amber-200"
                          }`}>
                            {t.variant}
                          </span>
                        </td>

                        {/* Last Modified By */}
                        <td className="px-6 py-4 text-xs text-light-ash">
                          <div className="flex flex-col">
                            <span className="font-medium">{t.lastUpdatedBy || "System Seed"}</span>
                            <span className="text-[10px] text-light-ash/60">
                              {new Date(t.updatedAt).toLocaleString()}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(t)}
                              title="Edit Program"
                              className="p-2 text-light-ash hover:text-primary hover:bg-primary/5 rounded-lg transition-all cursor-pointer"
                            >
                              <HiPencilSquare className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(t.id, t.slug)}
                              disabled={isDeletingId === t.id}
                              title="Delete Program"
                              className="p-2 text-light-ash hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                            >
                              <HiTrash className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-light-ash font-medium">
                      No training programs found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-muted/50 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-light/20 text-xs font-semibold text-light-ash uppercase tracking-wider border-b border-muted/50">
                  <th className="px-6 py-4">Block Heading</th>
                  <th className="px-6 py-4">List Items</th>
                  <th className="px-6 py-4">CTA Button</th>
                  <th className="px-6 py-4 text-center">Display Order</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/30 text-sm">
                {infoBlocks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-light-ash font-medium">
                      No info blocks configured. Add one to customize!
                    </td>
                  </tr>
                ) : (
                  infoBlocks.map((block) => {
                    let itemsCount = 0;
                    try {
                      itemsCount = JSON.parse(block.items).length;
                    } catch {}
                    
                    return (
                      <tr key={block.id} className="hover:bg-light/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-muted/50 shrink-0 bg-light/5">
                              <img
                                src={block.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="font-semibold text-dark text-base leading-snug">
                              {block.heading}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-light-ash font-medium">
                          {itemsCount} bullet points
                        </td>
                        <td className="px-6 py-4 text-primary-dark font-medium">
                          {block.ctaLabel} ({block.ctaHref})
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-dark">
                          {block.order}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedBlock(block);
                                setIsBlockModalOpen(true);
                              }}
                              className="p-2 text-light-ash hover:text-primary hover:bg-primary/5 rounded-lg transition-all cursor-pointer"
                              title="Edit Info Block"
                            >
                              <HiPencilSquare className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleBlockDelete(block.id)}
                              className="p-2 text-light-ash hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                              title="Delete Info Block"
                              disabled={isDeletingBlockId === block.id}
                            >
                              <HiTrash className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE & EDIT FORM MODAL CONTAINER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 backdrop-blur-md px-4 py-6">
          <div className="bg-white rounded-3xl border border-muted/50 shadow-2xl max-w-4xl w-full overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            <EditTrainingForm
              training={selectedTraining}
              onClose={() => setIsModalOpen(false)}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      )}

      {/* INFO BLOCK MODAL DIALOG */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 backdrop-blur-md px-4 py-6">
          <div className="bg-white rounded-3xl border border-muted/50 shadow-2xl max-w-2xl w-full overflow-hidden animate-fade-in flex flex-col max-h-[90vh] p-6">
            <EditTrainingInfoBlockForm
              initialBlock={selectedBlock}
              onClose={() => setIsBlockModalOpen(false)}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
