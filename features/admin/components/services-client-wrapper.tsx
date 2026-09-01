"use client";
import Image from "next/image";

import * as React from "react";
import { HiPlus, HiPencilSquare, HiTrash, HiCheck, HiXMark, HiBars3 } from "react-icons/hi2";
import { EditServiceForm } from "./edit-service-form";
import { deleteServiceAction, deleteServiceInfoBlockAction, toggleServiceFeaturedAction, reorderServicesAction, reorderServiceInfoBlocksAction } from "@/app/(admin)/admin/actions";
import { SERVICE_IMAGES } from "@/components/shared/service-card";
import { EditServiceInfoBlockForm } from "./edit-service-info-block-form";
import { useRouter } from "next/navigation";

interface ServiceDB {
  id: string;
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  longDescription: string;
  approach: string;
  isFeatured: boolean;
  showInNavbar?: boolean;
  image?: string | null;
  bgImage?: string | null;
  duration?: string | null;
  fees?: string | null;
  whoIsItFor?: string | null;
  format?: string | null;
  language?: string | null;
  faqs?: string | null;
}

interface ServiceInfoBlockDB {
  id: string;
  heading: string;
  items: string; // JSON string of string[]
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  order: number;
}

interface ServicesClientWrapperProps {
  initialServices: ServiceDB[];
  initialInfoBlocks: ServiceInfoBlockDB[];
}

export function ServicesClientWrapper({
  initialServices,
  initialInfoBlocks,
}: ServicesClientWrapperProps): React.JSX.Element {
  const router = useRouter();
  const [services, setServices] = React.useState<ServiceDB[]>(initialServices);
  const [selectedService, setSelectedService] = React.useState<ServiceDB | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeletingId, setIsDeletingId] = React.useState<string | null>(null);
  const [togglingId, setTogglingId] = React.useState<string | null>(null);

  // Reorder & Drag state
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [draggedBlockIndex, setDraggedBlockIndex] = React.useState<number | null>(null);
  const [isReordering, setIsReordering] = React.useState(false);

  // Tab & Info Block states
  const [activeTab, setActiveTab] = React.useState<"services" | "infoblocks">("services");
  const [infoBlocks, setInfoBlocks] = React.useState<ServiceInfoBlockDB[]>(initialInfoBlocks);
  const [selectedBlock, setSelectedBlock] = React.useState<ServiceInfoBlockDB | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = React.useState(false);
  const [isDeletingBlockId, setIsDeletingBlockId] = React.useState<string | null>(null);

  // Sync props with state
  React.useEffect(() => {
    setServices(initialServices);
    setInfoBlocks(initialInfoBlocks);
  }, [initialServices, initialInfoBlocks]);

  // Drag and Drop handlers for reordering services
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIndex === null || draggedIndex === index) return;

    const newServices = [...services];
    const [draggedItem] = newServices.splice(draggedIndex, 1);
    newServices.splice(index, 0, draggedItem);
    setServices(newServices);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    setIsReordering(true);
    try {
      const orderedIds = services.map((s) => s.id);
      const res = await reorderServicesAction(orderedIds);
      if (!res.success) {
        alert(res.error || "Failed to save new service order.");
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("Error saving service order:", err);
    } finally {
      setIsReordering(false);
    }
  };

  // Drag and Drop handlers for reordering info blocks
  const handleBlockDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    setDraggedBlockIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleBlockDragOver = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedBlockIndex === null || draggedBlockIndex === index) return;

    const newBlocks = [...infoBlocks];
    const [draggedItem] = newBlocks.splice(draggedBlockIndex, 1);
    newBlocks.splice(index, 0, draggedItem);
    setInfoBlocks(newBlocks);
    setDraggedBlockIndex(index);
  };

  const handleBlockDragEnd = async () => {
    setDraggedBlockIndex(null);
    setIsReordering(true);
    try {
      const orderedIds = infoBlocks.map((b) => b.id);
      const res = await reorderServiceInfoBlocksAction(orderedIds);
      if (!res.success) {
        alert(res.error || "Failed to save new info block order.");
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("Error saving info block order:", err);
    } finally {
      setIsReordering(false);
    }
  };

  const handleToggleFeatured = async (service: ServiceDB) => {
    const nextFeatured = !service.isFeatured;
    setTogglingId(service.id);

    // Optimistic update
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, isFeatured: nextFeatured } : s))
    );

    try {
      const res = await toggleServiceFeaturedAction(service.id, nextFeatured);
      if (!res.success) {
        // Revert on error
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, isFeatured: service.isFeatured } : s))
        );
        alert(res.error || "Failed to update featured status.");
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, isFeatured: service.isFeatured } : s))
      );
      alert(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm("Are you sure you want to permanently delete this psychotherapeutic service? This cannot be undone.")) {
      return;
    }
    setIsDeletingId(id);
    try {
      const res = await deleteServiceAction(id, slug);
      if (res.success) {
        setServices(services.filter((s) => s.id !== id));
      } else {
        alert(res.error || "Failed to delete service.");
      }
    } catch (err) {
      alert(err instanceof Error ? (err instanceof Error ? err.message : String(err)) : "An unexpected error occurred.");
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleEditClick = (service: ServiceDB) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    // Reset modal states and refresh page data via SPA
    setIsModalOpen(false);
    setSelectedService(null);
    setIsBlockModalOpen(false);
    setSelectedBlock(null);
    router.refresh();
  };

  const handleBlockDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this services page info block?")) {
      return;
    }
    setIsDeletingBlockId(id);
    try {
      const res = await deleteServiceInfoBlockAction(id);
      if (res.success) {
        setInfoBlocks(infoBlocks.filter((b) => b.id !== id));
      } else {
        alert(res.error || "Failed to delete block.");
      }
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : String(err)) || "An unexpected error occurred.");
    } finally {
      setIsDeletingBlockId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Upper Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-muted pb-5">
        <div>
          <h1 className="font-marcellus text-2xl font-bold text-dark-green">
            Manage Services & Page Blocks
          </h1>
          <p className="font-sans text-sm text-light-ash">
            Configure psychotherapeutic services directory and page-level info blocks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "services" ? (
            <button
              onClick={handleAddClick}
              className="bg-primary hover:bg-primary-dark text-white font-sans text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            >
              <HiPlus className="w-4 h-4" />
              Add Service
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedBlock(null);
                setIsBlockModalOpen(true);
              }}
              className="bg-primary hover:bg-primary-dark text-white font-sans text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            >
              <HiPlus className="w-4 h-4" />
              Add Info Block
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-muted/50 -mt-2">
        <button
          onClick={() => setActiveTab("services")}
          className={`px-5 py-2.5 font-sans text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "services"
              ? "border-primary text-primary-dark"
              : "border-transparent text-light-ash hover:text-dark"
          }`}
        >
          Services Directory ({services.length})
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

      {/* Services Grid/Table */}
      {activeTab === "services" ? (
        <div className="bg-white border border-muted rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-light-ash/5 border-b border-muted">
                <th className="px-4 py-4 text-xs font-semibold text-dark uppercase tracking-wider text-center w-16">
                  Order
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider">
                  Service / Title
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider">
                  Slug Path
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider">
                  Icon
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider text-center">
                  Featured
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-light-ash text-sm">
                    No services found in database. Add one to get started!
                  </td>
                </tr>
              ) : (
                services.map((service, index) => (
                  <tr
                    key={service.id}
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
                        <HiBars3
                          className="w-4 h-4 text-light-ash/50 hover:text-primary shrink-0 cursor-grab active:cursor-grabbing"
                          title="Drag up or down to reorder service card serial"
                        />
                        <span className="font-semibold text-dark-green text-sm shrink-0 font-mono">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-muted/60 shrink-0 bg-light-ash/5">
                          <Image src={service.image || SERVICE_IMAGES[service.slug] || "/home-service-images/individual-therapy.png"} alt={service.title} width={48} height={48} unoptimized className="w-12 h-12 object-cover rounded-xl" />
                        </div>
                        <div>
                          <div className="font-semibold text-dark text-sm leading-snug">
                            {service.title}
                          </div>
                          <div className="text-xs text-light-ash line-clamp-1 mt-0.5 max-w-sm">
                            {service.shortDescription}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-sm text-dark font-mono">
                      /services/{service.slug}
                    </td>
                    <td className="px-6 py-4.5 text-sm text-light-ash">
                      {service.icon}
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(service)}
                        disabled={togglingId === service.id}
                        title={service.isFeatured ? "Click to remove from Home page" : "Click to feature on Home page"}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 disabled:opacity-60 ${
                          service.isFeatured
                            ? "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200"
                            : "bg-light-ash/10 text-dark hover:bg-light-ash/20 border border-muted"
                        }`}
                      >
                        {togglingId === service.id ? (
                          <span className="inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : service.isFeatured ? (
                          <HiCheck className="w-3.5 h-3.5 text-green-700" />
                        ) : (
                          <HiXMark className="w-3.5 h-3.5 text-light-ash" />
                        )}
                        {service.isFeatured ? "Featured" : "Standard"}
                      </button>
                    </td>

                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(service)}
                          className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                          title="Edit Service"
                        >
                          <HiPencilSquare className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id, service.slug)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Service"
                          disabled={isDeletingId === service.id}
                        >
                          <HiTrash className="w-5 h-5" />
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
      ) : (
        <div className="bg-white border border-muted rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-light-ash/5 border-b border-muted">
                  <th className="px-4 py-4 text-xs font-semibold text-dark uppercase tracking-wider text-center w-16">
                    Order
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider">
                    Block Title / Heading
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider">
                    Bullet Points Count
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider">
                    CTA Action
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {infoBlocks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-light-ash text-sm">
                      No info blocks configured. Add one to customize!
                    </td>
                  </tr>
                ) : (
                  infoBlocks.map((block, index) => {
                    let itemsCount = 0;
                    try {
                      itemsCount = JSON.parse(block.items).length;
                    } catch {}
                    
                    return (
                      <tr
                        key={block.id}
                        draggable
                        onDragStart={(e) => handleBlockDragStart(e, index)}
                        onDragOver={(e) => handleBlockDragOver(e, index)}
                        onDragEnd={handleBlockDragEnd}
                        className={`transition-all duration-150 ${
                          draggedBlockIndex === index
                            ? "bg-primary/10 opacity-70 border-2 border-dashed border-primary cursor-grabbing"
                            : "hover:bg-light-ash/5 cursor-grab"
                        }`}
                      >
                        <td className="px-4 py-4.5 text-center shrink-0">
                          <div className="flex items-center justify-center gap-1.5 text-light-ash">
                            <HiBars3
                              className="w-4 h-4 text-light-ash/50 hover:text-primary shrink-0 cursor-grab active:cursor-grabbing"
                              title="Drag up or down to reorder info block serial"
                            />
                            <span className="font-semibold text-dark-green text-sm shrink-0 font-mono">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-muted shrink-0 bg-light-ash/5">
                              <Image src={block.image} alt={block.heading} width={48} height={48} unoptimized className="w-12 h-12 object-cover rounded-xl" />
                            </div>
                            <div className="font-semibold text-dark text-sm leading-snug">
                              {block.heading}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4.5 text-sm text-dark">
                          {itemsCount} bullet points
                        </td>
                        <td className="px-6 py-4.5 text-sm text-light-ash">
                          {block.ctaLabel} ({block.ctaHref})
                        </td>
                        <td className="px-6 py-4.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedBlock(block);
                                setIsBlockModalOpen(true);
                              }}
                              className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                              title="Edit Info Block"
                            >
                              <HiPencilSquare className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleBlockDelete(block.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
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

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-dark-green/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-6 border border-muted animate-in fade-in zoom-in-95 duration-150">
            <EditServiceForm
              initialService={selectedService}
              onClose={() => setIsModalOpen(false)}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      )}

      {/* Info Block Modal Dialog */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 bg-dark-green/30 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-6 border border-muted animate-in fade-in zoom-in-95 duration-150">
            <EditServiceInfoBlockForm
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