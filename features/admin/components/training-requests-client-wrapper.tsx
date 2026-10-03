"use client";

import * as React from "react";
import { HiMagnifyingGlass, HiEye, HiCheck, HiXMark, HiArrowTopRightOnSquare } from "react-icons/hi2";
import {
  updateTrainingRequestStatusAction,
  markTrainingRequestAsViewedAction,
} from "@/app/(admin)/admin/actions";
import { useAdminNotifications } from "@/features/admin/hooks/use-admin-notifications";
import {
  EditJoinTrainingPageForm,
  type JoinTrainingPageContentDB,
} from "./edit-join-training-page-form";
import { FormFieldsBuilder } from "./form-fields-builder";
import { DEFAULT_TRAINING_FORM_FIELDS } from "@/types/form-fields";
import { safeJsonParse } from "@/lib/json";

interface TrainingRequest {
  id: string;
  clientName: string;
  age: string;
  gender: string;
  contact: string;
  trainingName: string;
  trainingSlug?: string | null;
  trainingFee?: string | null;
  trainingDuration?: string | null;
  trainingFormat?: string | null;
  preference: "online" | "in-person";
  message?: string;
  status: "pending" | "approved" | "rejected";
  dateTime: string;
  submittedAt?: string;
  isViewed: boolean;
  customFields?: string | null;
}

export interface TrainingRequestsClientWrapperProps {
  initialRequests: TrainingRequest[];
  initialPageContent?: JoinTrainingPageContentDB | null;
}

export function TrainingRequestsClientWrapper({
  initialRequests,
  initialPageContent,
}: TrainingRequestsClientWrapperProps): React.JSX.Element {
  const [activeTab, setActiveTab] = React.useState<"requests" | "page-content" | "form-fields">("requests");
  const [requests, setRequests] = React.useState<TrainingRequest[]>(initialRequests);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selectedRequest, setSelectedRequest] = React.useState<TrainingRequest | null>(null);
  const { decrementTrainingRequests } = useAdminNotifications();

  const handleViewDetails = React.useCallback((req: TrainingRequest): void => {
    setSelectedRequest(req);
    if (!req.isViewed) {
      setRequests((prev) =>
        prev.map((item) => (item.id === req.id ? { ...item, isViewed: true } : item))
      );
      decrementTrainingRequests();
      void markTrainingRequestAsViewedAction(req.id);
    }
  }, [decrementTrainingRequests]);

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedRequest) {
        setSelectedRequest(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRequest]);

  const handleStatusChange = async (id: string, nextStatus: "pending" | "approved" | "rejected") => {
    const dbStatus = nextStatus === "approved" ? "APPROVED" : nextStatus === "rejected" ? "REJECTED" : "PENDING";
    
    // Save original state for rollback
    const originalRequests = [...requests];

    // Optimistically update
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: nextStatus } : req))
    );

    try {
      const res = await updateTrainingRequestStatusAction(id, dbStatus);
      if (!res.success) {
        alert(res.error || "Failed to update status on the server.");
        setRequests(originalRequests);
      }
    } catch (err: unknown) {
      console.error(err);
      alert("An unexpected error occurred while saving.");
      setRequests(originalRequests);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.trainingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.contact && req.contact.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.gender && req.gender.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-8 font-sans">
      <div className="flex flex-col gap-1">
        <h1 className="font-marcellus text-3xl font-bold text-dark-green">Training Requests</h1>
        <p className="text-sm text-light-ash">
          Track participant registration requests and customize the public join-training page text and benefit highlights.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-muted/50 -mt-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("requests")}
          className={`px-5 py-2.5 font-sans text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "requests"
              ? "border-primary text-primary-dark"
              : "border-transparent text-light-ash hover:text-dark"
          }`}
        >
          Training Requests ({requests.length})
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
        <EditJoinTrainingPageForm initialContent={initialPageContent} />
      ) : activeTab === "form-fields" ? (
        <FormFieldsBuilder
          title="Training Cohort Registration Form Customizer"
          description="Manage existing fields (labels, placeholders, requirement rules) and add new custom input fields to collect specialized information from trainees."
          targetType="training"
          initialFields={initialPageContent?.formFields}
          defaultFields={DEFAULT_TRAINING_FORM_FIELDS}
          previewUrl="/join-training"
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-muted/50 shadow-xs">
            <div className="relative w-full md:w-80">
              <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-light-ash/70" />
              <input
                type="text"
                placeholder="Search by client or training..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-muted bg-white focus:outline-hidden focus:border-primary rounded-xl text-sm transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto overflow-x-auto pb-1 md:pb-0">
              {(["all", "pending", "approved", "rejected"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer transition-all capitalize ${
                    statusFilter === status ? "bg-primary text-white shadow-xs" : "bg-light/50 text-dark-green hover:bg-light"
                  }`}
                >
                  {status === "all" ? "All Requests" : status}
                </button>
              ))}
            </div>
          </div>

      <div className="bg-white border border-muted/50 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-light/20 border-b border-muted/50 text-xs font-semibold text-light-ash uppercase tracking-wider">
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">Participant</th>
                <th className="px-6 py-4">Training Program</th>
                <th className="px-6 py-4">Preference</th>
                <th className="px-6 py-4">Date of Request</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/30">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className={`transition-colors ${
                      !req.isViewed
                        ? "bg-amber-50/80 hover:bg-amber-100/70 border-l-4 border-l-amber-500 font-medium"
                        : "hover:bg-light/10"
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-dark-green">
                      <div className="flex items-center gap-2">
                        {!req.isViewed && (
                          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 shrink-0" title="New" />
                        )}
                        <span>{req.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-dark">
                      <div>{req.clientName}</div>
                      {req.contact && (
                        <div className="text-xs font-normal text-light-ash break-all">{req.contact}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-light-ash">{req.trainingName}</td>
                    <td className="px-6 py-4 text-light-ash capitalize">{req.preference}</td>
                    <td className="px-6 py-4 text-light-ash">{req.dateTime}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider text-[10px] ${
                        req.status === "pending" ? "bg-accent/15 text-accent border-accent/20" :
                        req.status === "approved" ? "bg-primary/10 text-primary-dark border-primary/20" :
                        "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(req)}
                          className="p-2 text-light-ash hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <HiEye className="w-4 h-4" />
                        </button>
                        {req.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(req.id, "approved")}
                              className="p-2 text-light-ash hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                              title="Approve"
                            >
                              <HiCheck className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(req.id, "rejected")}
                              className="p-2 text-light-ash hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Reject"
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
                  <td colSpan={7} className="px-6 py-12 text-center text-light-ash font-medium">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="training-request-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 backdrop-blur-md px-4 py-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedRequest(null);
          }}
        >
          <div className="bg-white rounded-3xl border border-muted/50 shadow-2xl max-w-xl w-full max-h-[92vh] overflow-hidden animate-fade-in flex flex-col text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-muted px-6 py-5 bg-light/20">
              <div className="flex items-center gap-3">
                <h3 id="training-request-modal-title" className="font-marcellus text-xl font-bold text-dark-green">
                  Training Registration Details
                </h3>
                <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary-dark rounded-md">
                  #{selectedRequest.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-6 flex flex-col gap-5 text-sm font-sans">
              {/* 1. Participant Information Card */}
              <div className="bg-light/30 border border-muted/40 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-muted/30 pb-2">
                  <span className="text-xs font-bold text-primary-dark uppercase tracking-wider">
                    Participant Information
                  </span>
                  <span className="text-xs text-light-ash">
                    Submitted: {selectedRequest.submittedAt || selectedRequest.dateTime}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-light-ash text-xs block">Full Name (Certificate Name)</span>
                    <span className="text-dark font-semibold text-base">{selectedRequest.clientName}</span>
                  </div>
                  <div>
                    <span className="text-light-ash text-xs block">Age & Gender</span>
                    <span className="text-dark font-medium">
                      {selectedRequest.age ? `${selectedRequest.age} years old` : "Not specified"}
                      {selectedRequest.gender ? ` • ${selectedRequest.gender}` : ""}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-light-ash text-xs block">Contact Details (Phone / Email)</span>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="text-dark font-medium break-all">
                        {selectedRequest.contact || "None provided"}
                      </span>
                      {selectedRequest.contact && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {selectedRequest.contact.includes("@") && (
                            <a
                              href={`mailto:${selectedRequest.contact}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                            >
                              Email Participant
                            </a>
                          )}
                          {/[0-9]/.test(selectedRequest.contact) && (
                            <a
                              href={`tel:${selectedRequest.contact.replace(/[^0-9+]/g, "")}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-dark-green text-white rounded-lg hover:bg-dark-green/90 transition-colors"
                            >
                              Call Participant
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Program & Preferences Card */}
              <div className="bg-light/30 border border-muted/40 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-muted/30 pb-2">
                  <span className="text-xs font-bold text-primary-dark uppercase tracking-wider">
                    Training Program & Attendance
                  </span>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider text-[10px] ${
                        selectedRequest.status === "pending"
                          ? "bg-accent/15 text-accent border-accent/20"
                          : selectedRequest.status === "approved"
                          ? "bg-primary/10 text-primary-dark border-primary/20"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="sm:col-span-2 flex items-start justify-between gap-3">
                    <div>
                      <span className="text-light-ash text-xs block">Training Program</span>
                      <span className="text-dark font-semibold text-base">{selectedRequest.trainingName}</span>
                    </div>
                    {selectedRequest.trainingSlug && (
                      <a
                        href={`/training/${selectedRequest.trainingSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary-dark hover:text-primary font-medium bg-primary/5 hover:bg-primary/10 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
                        title="View Public Training Page"
                      >
                        <span>View Training</span>
                        <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <div>
                    <span className="text-light-ash text-xs block">Attendance Medium</span>
                    <span className="inline-flex items-center gap-1.5 text-dark font-medium capitalize mt-0.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          selectedRequest.preference === "online" ? "bg-blue-500" : "bg-emerald-500"
                        }`}
                      />
                      {selectedRequest.preference === "online" ? "Online Session" : "In-Person Session"}
                    </span>
                  </div>
                  {selectedRequest.trainingDuration && (
                    <div>
                      <span className="text-light-ash text-xs block">Duration</span>
                      <span className="text-dark font-medium">{selectedRequest.trainingDuration}</span>
                    </div>
                  )}
                  {selectedRequest.trainingFee && (
                    <div>
                      <span className="text-light-ash text-xs block">Program Fee</span>
                      <span className="text-primary-dark font-bold text-base">{selectedRequest.trainingFee}</span>
                    </div>
                  )}
                  {selectedRequest.trainingFormat && (
                    <div>
                      <span className="text-light-ash text-xs block">Delivery Format</span>
                      <span className="text-dark font-medium">{selectedRequest.trainingFormat}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Reason / Background Message */}
              {selectedRequest.message && (
                <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-4 flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Educational Background / Specific Goals & Note
                  </span>
                  <p className="text-dark leading-relaxed whitespace-pre-wrap text-sm">
                    {selectedRequest.message}
                  </p>
                </div>
              )}

              {/* 4. Additional Custom Form Fields */}
              {(() => {
                if (!selectedRequest.customFields) return null;
                const parsed = safeJsonParse<Record<string, any>>(selectedRequest.customFields, {});
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
                {selectedRequest.status !== "pending" && (
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, "pending");
                      setSelectedRequest((prev) => (prev ? { ...prev, status: "pending" } : null));
                    }}
                    className="text-xs text-primary-dark hover:underline font-semibold cursor-pointer"
                  >
                    Reset to Pending
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                {selectedRequest.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        handleStatusChange(selectedRequest.id, "rejected");
                        setSelectedRequest((prev) => (prev ? { ...prev, status: "rejected" } : null));
                      }}
                      className="bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer border border-red-200"
                    >
                      Reject Request
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleStatusChange(selectedRequest.id, "approved");
                        setSelectedRequest((prev) => (prev ? { ...prev, status: "approved" } : null));
                      }}
                      className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-md"
                    >
                      Approve Request
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="bg-light-ash/10 hover:bg-light-ash/20 text-dark text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )}
</div>
  );
}
