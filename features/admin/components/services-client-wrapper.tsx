"use client";

import * as React from "react";
import { HiPlus, HiPencilSquare, HiTrash, HiCheck, HiXMark } from "react-icons/hi2";
import { EditServiceForm } from "./edit-service-form";
import { deleteServiceAction, deleteServiceInfoBlockAction } from "@/app/(admin)/admin/actions";
import { SERVICE_IMAGES } from "@/components/shared/service-card";
import { EditServiceInfoBlockForm } from "./edit-service-info-block-form";

interface ServiceDB {
  id: string;
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  longDescription: string;
  approach: string;
  isFeatured: boolean;
  showInNavbar: boolean;
  image?: string | null;
  bgImage?: string | null;
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
  const [services, setServices] = React.useState<ServiceDB[]>(initialServices);
  const [selectedService, setSelectedService] = React.useState<ServiceDB | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeletingId, setIsDeletingId] = React.useState<string | null>(null);

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
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred.");
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
    // Reload page data to get the updated list from parent server page
    window.location.reload();
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
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred.");
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
                <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider text-center">
                  Navbar
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
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-light-ash/5 transition-colors">
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-muted/60 shrink-0 bg-light-ash/5">
                          <img
                            src={service.image || SERVICE_IMAGES[service.slug] || "/home-service-images/individual-therapy.png"}
                            alt=""
                            className="w-full h-full object-cover"
                          />
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
                      {service.isFeatured ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium border border-green-100">
                          <HiCheck className="w-3 h-3" /> Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-light-ash/10 text-light-ash px-2.5 py-1 rounded-full text-xs font-medium">
                          <HiXMark className="w-3 h-3" /> Standard
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      {service.showInNavbar ? (
                        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary-dark px-2.5 py-1 rounded-full text-xs font-medium border border-primary/20">
                          <HiCheck className="w-3 h-3" /> Shown
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-light-ash/10 text-light-ash px-2.5 py-1 rounded-full text-xs font-medium">
                          <HiXMark className="w-3 h-3" /> Hidden
                        </span>
                      )}
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
                  <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider">
                    Block Title / Heading
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider">
                    Bullet Points Count
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider">
                    CTA Action
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider text-center">
                    Display Order
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
                  infoBlocks.map((block) => {
                    let itemsCount = 0;
                    try {
                      itemsCount = JSON.parse(block.items).length;
                    } catch {}
                    
                    return (
                      <tr key={block.id} className="hover:bg-light-ash/5 transition-colors">
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-muted shrink-0 bg-light-ash/5">
                              <img
                                src={block.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
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
                        <td className="px-6 py-4.5 text-center text-sm text-dark">
                          {block.order}
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
