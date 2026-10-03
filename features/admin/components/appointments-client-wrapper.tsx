"use client";

import * as React from "react";
import {
  HiMagnifyingGlass,
  HiEye,
  HiCheck,
  HiXMark
} from "react-icons/hi2";
import {
  updateAppointmentStatusAction,
  markAppointmentAsViewedAction,
} from "@/app/(admin)/admin/actions";
import { useAdminNotifications } from "@/features/admin/hooks/use-admin-notifications";
import { EditAppointmentPageForm, type AppointmentPageContentDB } from "./edit-appointment-page-form";
import { FormFieldsBuilder } from "./form-fields-builder";
import { DEFAULT_APPOINTMENT_FORM_FIELDS } from "@/types/form-fields";
import { safeJsonParse } from "@/lib/json";

interface Appointment {
  id: string;
  clientName: string;
  age?: number | string;
  gender?: string;
  contact?: string;
  therapistName: string;
  date?: string;
  time?: string;
  preference?: string;
  dateTime: string;
  submittedAt: string;
  sessionType: string;
  status: "scheduled" | "completed" | "cancelled";
  amount: string;
  isViewed: boolean;
  message?: string | null;
  customFields?: string | null;
}

export interface AppointmentsClientWrapperProps {
  initialAppointments: Appointment[];
  initialPageContent?: AppointmentPageContentDB | null;
}

export function AppointmentsClientWrapper({
  initialAppointments,
  initialPageContent,
}: AppointmentsClientWrapperProps): React.JSX.Element {
  const [appointments, setAppointments] = React.useState<Appointment[]>(initialAppointments);
  const [activeTab, setActiveTab] = React.useState<"bookings" | "page-content" | "form-fields">("bookings");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "scheduled" | "completed" | "cancelled">("all");
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null);
  const { decrementAppointments } = useAdminNotifications();

  const handleViewDetails = React.useCallback((apt: Appointment): void => {
    setSelectedAppointment(apt);
    if (!apt.isViewed) {
      setAppointments((prev) =>
        prev.map((item) => (item.id === apt.id ? { ...item, isViewed: true } : item))
      );
      decrementAppointments();
      void markAppointmentAsViewedAction(apt.id);
    }
  }, [decrementAppointments]);

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedAppointment) {
        setSelectedAppointment(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAppointment]);

  const handleStatusChange = async (id: string, nextStatus: "scheduled" | "completed" | "cancelled") => {
    const dbStatus = nextStatus === "completed" ? "COMPLETED" : nextStatus === "cancelled" ? "CANCELLED" : "PENDING";
    
    // Save original state for rollback
    const originalAppointments = [...appointments];

    // Optimistically update status
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: nextStatus } : apt))
    );

    try {
      const res = await updateAppointmentStatusAction(id, dbStatus);
      if (!res.success) {
        alert(res.error || "Failed to update status on the server.");
        setAppointments(originalAppointments);
      }
    } catch (err: unknown) {
      console.error(err);
      alert("An unexpected error occurred while saving.");
      setAppointments(originalAppointments);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.therapistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.sessionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (apt.contact && apt.contact.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (apt.gender && apt.gender.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-8 font-sans">
      {/* Header section */}
      <div className="flex flex-col gap-1">
        <h1 className="font-marcellus text-3xl font-bold text-dark-green">
          Manage Appointments
        </h1>
        <p className="text-sm text-light-ash">
          Track client booking requests and customize the public appointment page text and benefit highlights.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-muted/50 -mt-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("bookings")}
          className={`px-5 py-2.5 font-sans text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "bookings"
              ? "border-primary text-primary-dark"
              : "border-transparent text-light-ash hover:text-dark"
          }`}
        >
          Booked Appointments ({appointments.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("page-content")}
          className={`px-5 py-2.5 font-sans text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "page-content"
              ? "border-primary text-primary-dark"
              : "border-transparent text-light-ash hover:text-dark"
          }`}
        >
          Page Text & Highlights
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("form-fields")}
          className={`px-5 py-2.5 font-sans text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "form-fields"
              ? "border-primary text-primary-dark"
              : "border-transparent text-light-ash hover:text-dark"
          }`}
        >
          Form Fields Builder
        </button>
      </div>

      {activeTab === "page-content" ? (
        <EditAppointmentPageForm initialContent={initialPageContent} />
      ) : activeTab === "form-fields" ? (
        <FormFieldsBuilder
          title="Appointment Intake Form Customizer"
          description="Manage existing fields (labels, placeholders, requirement rules) and add new custom input fields to collect specialized information from clients."
          targetType="appointment"
          initialFields={initialPageContent?.formFields}
          defaultFields={DEFAULT_APPOINTMENT_FORM_FIELDS}
          previewUrl="/appointment"
        />
      ) : (
        <>
          {/* Filter and search bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-muted/50 shadow-xs">
        <div className="relative w-full md:w-80">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-light-ash/70" />
          <input
            type="text"
            placeholder="Search by client, therapist, session..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-muted bg-white focus:outline-hidden focus:border-primary rounded-xl text-sm transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer transition-all ${
              statusFilter === "all"
                ? "bg-primary text-white shadow-xs"
                : "bg-light/50 text-dark-green hover:bg-light"
            }`}
          >
            All Bookings
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("scheduled")}
            className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer transition-all ${
              statusFilter === "scheduled"
                ? "bg-primary text-white shadow-xs"
                : "bg-light/50 text-dark-green hover:bg-light"
            }`}
          >
            Scheduled
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("completed")}
            className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer transition-all ${
              statusFilter === "completed"
                ? "bg-primary text-white shadow-xs"
                : "bg-light/50 text-dark-green hover:bg-light"
            }`}
          >
            Completed
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("cancelled")}
            className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer transition-all ${
              statusFilter === "cancelled"
                ? "bg-primary text-white shadow-xs"
                : "bg-light/50 text-dark-green hover:bg-light"
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Main content - Table */}
      <div className="bg-white border border-muted/50 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-light/20 border-b border-muted/50 text-xs font-semibold text-light-ash uppercase tracking-wider">
                <th className="px-6 py-4">Appointment ID</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Therapist</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Date Submitted</th>
                <th className="px-6 py-4">Session Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/30">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => (
                  <tr
                    key={apt.id}
                    className={`transition-colors ${
                      !apt.isViewed
                        ? "bg-amber-50/80 hover:bg-amber-100/70 border-l-4 border-l-amber-500 font-medium"
                        : "hover:bg-light/10"
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-dark-green">
                      <div className="flex items-center gap-2">
                        {!apt.isViewed && (
                          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 shrink-0" title="New" />
                        )}
                        <span>{apt.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-dark">
                      <div>{apt.clientName}</div>
                      {apt.contact && (
                        <div className="text-xs font-normal text-light-ash break-all">{apt.contact}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-light-ash">{apt.therapistName}</td>
                    <td className="px-6 py-4 text-accent font-medium">{apt.dateTime}</td>
                    <td className="px-6 py-4 text-light-ash">{apt.submittedAt}</td>
                    <td className="px-6 py-4 text-light-ash">{apt.sessionType}</td>
                    <td className="px-6 py-4">
                      {apt.status === "scheduled" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-accent/15 text-accent border border-accent/20 uppercase tracking-wider text-[10px]">
                          Scheduled
                        </span>
                      )}
                      {apt.status === "completed" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary-dark border border-primary/20 uppercase tracking-wider text-[10px]">
                          Completed
                        </span>
                      )}
                      {apt.status === "cancelled" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 uppercase tracking-wider text-[10px]">
                          Cancelled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(apt)}
                          className="p-2 text-light-ash hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <HiEye className="w-4 h-4" />
                        </button>
                        {apt.status === "scheduled" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(apt.id, "completed")}
                              className="p-2 text-light-ash hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                              title="Mark Completed"
                            >
                              <HiCheck className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(apt.id, "cancelled")}
                              className="p-2 text-light-ash hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Cancel Session"
                            >
                              <HiXMark className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-light-ash font-medium">
                    No appointments found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="appointment-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 backdrop-blur-md px-4 py-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedAppointment(null);
          }}
        >
          <div className="bg-white rounded-3xl border border-muted/50 shadow-2xl max-w-xl w-full max-h-[92vh] overflow-hidden animate-fade-in flex flex-col text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-muted px-6 py-5 bg-light/20">
              <div className="flex items-center gap-3">
                <h3 id="appointment-modal-title" className="font-marcellus text-xl font-bold text-dark-green">
                  Appointment Details
                </h3>
                <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary-dark rounded-md">
                  #{selectedAppointment.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="p-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-6 flex flex-col gap-5 text-sm font-sans">
              {/* 1. Client Information Card */}
              <div className="bg-light/30 border border-muted/40 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-muted/30 pb-2">
                  <span className="text-xs font-bold text-primary-dark uppercase tracking-wider">
                    Client Information
                  </span>
                  <span className="text-xs text-light-ash">
                    Submitted: {selectedAppointment.submittedAt}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-light-ash text-xs block">Full Name</span>
                    <span className="text-dark font-semibold text-base">{selectedAppointment.clientName}</span>
                  </div>
                  <div>
                    <span className="text-light-ash text-xs block">Age & Gender</span>
                    <span className="text-dark font-medium">
                      {selectedAppointment.age ? `${selectedAppointment.age} years old` : "Not specified"}
                      {selectedAppointment.gender ? ` • ${selectedAppointment.gender}` : ""}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-light-ash text-xs block">Contact Details (Phone / Email)</span>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="text-dark font-medium break-all">
                        {selectedAppointment.contact || "None provided"}
                      </span>
                      {selectedAppointment.contact && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {selectedAppointment.contact.includes("@") && (
                            <a
                              href={`mailto:${selectedAppointment.contact}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                            >
                              Email Client
                            </a>
                          )}
                          {/[0-9]/.test(selectedAppointment.contact) && (
                            <a
                              href={`tel:${selectedAppointment.contact.replace(/[^0-9+]/g, "")}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-dark-green text-white rounded-lg hover:bg-dark-green/90 transition-colors"
                            >
                              Call Client
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Session & Scheduling Card */}
              <div className="bg-light/30 border border-muted/40 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-muted/30 pb-2">
                  <span className="text-xs font-bold text-primary-dark uppercase tracking-wider">
                    Session & Scheduling
                  </span>
                  <div>
                    {selectedAppointment.status === "scheduled" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/15 text-accent border border-accent/20 uppercase tracking-wider text-[10px]">
                        Scheduled
                      </span>
                    )}
                    {selectedAppointment.status === "completed" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary-dark border border-primary/20 uppercase tracking-wider text-[10px]">
                        Completed
                      </span>
                    )}
                    {selectedAppointment.status === "cancelled" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 uppercase tracking-wider text-[10px]">
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-light-ash text-xs block">Service Requested</span>
                    <span className="text-dark font-semibold">{selectedAppointment.sessionType}</span>
                  </div>
                  <div>
                    <span className="text-light-ash text-xs block">Therapist</span>
                    <span className="text-dark font-semibold">{selectedAppointment.therapistName}</span>
                  </div>
                  <div>
                    <span className="text-light-ash text-xs block">Preferred Date & Time</span>
                    <span className="text-dark font-medium">
                      {selectedAppointment.date && selectedAppointment.time
                        ? `${selectedAppointment.date} (${selectedAppointment.time})`
                        : selectedAppointment.dateTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-light-ash text-xs block">Consultation Medium</span>
                    <span className="inline-flex items-center gap-1.5 text-dark font-medium capitalize mt-0.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          selectedAppointment.preference === "online" ? "bg-blue-500" : "bg-emerald-500"
                        }`}
                      />
                      {selectedAppointment.preference === "online" ? "Online Session" : "In-Person Session"}
                    </span>
                  </div>
                  <div>
                    <span className="text-light-ash text-xs block">Session Fee</span>
                    <span className="text-primary-dark font-bold text-base">{selectedAppointment.amount}</span>
                  </div>
                </div>
              </div>

              {/* 3. Reason for Visit / Symptoms Note */}
              {selectedAppointment.message && (
                <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-4 flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Reason for Visit / Symptoms Note
                  </span>
                  <p className="text-dark leading-relaxed whitespace-pre-wrap text-sm">
                    {selectedAppointment.message}
                  </p>
                </div>
              )}

              {/* 4. Additional Custom Form Fields */}
              {(() => {
                if (!selectedAppointment.customFields) return null;
                const parsed = safeJsonParse<Record<string, any>>(selectedAppointment.customFields, {});
                const entries = Object.entries(parsed || {});
                if (entries.length === 0) return null;
                return (
                  <div className="bg-light/30 border border-muted/40 rounded-2xl p-4 flex flex-col gap-2.5">
                    <span className="text-xs font-bold text-primary-dark uppercase tracking-wider border-b border-muted/30 pb-1.5">
                      Additional Form Fields
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {entries.map(([label, val]) => (
                        <div key={label} className="flex flex-col">
                          <span className="text-light-ash text-xs">{label}</span>
                          <span className="text-dark font-medium">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-light/20 border-t border-muted">
              <div>
                {selectedAppointment.status !== "scheduled" && (
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(selectedAppointment.id, "scheduled");
                      setSelectedAppointment((prev) => (prev ? { ...prev, status: "scheduled" } : null));
                    }}
                    className="text-xs text-primary-dark hover:underline font-semibold cursor-pointer"
                  >
                    Reset to Scheduled
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                {selectedAppointment.status === "scheduled" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        handleStatusChange(selectedAppointment.id, "cancelled");
                        setSelectedAppointment((prev) => (prev ? { ...prev, status: "cancelled" } : null));
                      }}
                      className="bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer border border-red-200"
                    >
                      Cancel Session
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleStatusChange(selectedAppointment.id, "completed");
                        setSelectedAppointment((prev) => (prev ? { ...prev, status: "completed" } : null));
                      }}
                      className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-md"
                    >
                      Complete Session
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="bg-light-ash/10 hover:bg-light-ash/20 text-dark text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
