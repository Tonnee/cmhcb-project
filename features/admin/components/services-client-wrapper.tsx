"use client";

import * as React from "react";
import { HiPlus, HiPencilSquare, HiTrash, HiCheck, HiXMark } from "react-icons/hi2";
import { EditServiceForm } from "./edit-service-form";
import { deleteServiceAction } from "@/app/(admin)/admin/actions";

interface ServiceDB {
  id: string;
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  longDescription: string;
  approach: string;
  isFeatured: boolean;
}

interface ServicesClientWrapperProps {
  initialServices: ServiceDB[];
}

export function ServicesClientWrapper({
  initialServices,
}: ServicesClientWrapperProps): React.JSX.Element {
  const [services, setServices] = React.useState<ServiceDB[]>(initialServices);
  const [selectedService, setSelectedService] = React.useState<ServiceDB | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeletingId, setIsDeletingId] = React.useState<string | null>(null);

  // Sync props with state
  React.useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

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

  return (
    <div className="flex flex-col gap-6">
      {/* Upper Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-marcellus text-2xl font-bold text-dark-green">
            Manage Services
          </h1>
          <p className="font-sans text-sm text-light-ash">
            Create, edit, and configure psychotherapeutic services and clinical assessment directories.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-primary hover:bg-primary-dark text-white font-sans text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors duration-200 flex items-center gap-2 cursor-pointer"
        >
          <HiPlus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Services Grid/Table */}
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
                <th className="px-6 py-4 text-xs font-semibold text-dark uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-light-ash text-sm">
                    No services found in database. Add one to get started!
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-light-ash/5 transition-colors">
                    <td className="px-6 py-4.5">
                      <div className="font-semibold text-dark text-sm leading-snug">
                        {service.title}
                      </div>
                      <div className="text-xs text-light-ash line-clamp-1 mt-0.5 max-w-sm">
                        {service.shortDescription}
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
    </div>
  );
}
