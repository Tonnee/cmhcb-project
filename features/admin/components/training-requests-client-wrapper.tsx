"use client";

import * as React from "react";
import { HiMagnifyingGlass, HiEye, HiCheck, HiXMark } from "react-icons/hi2";
import { updateTrainingRequestStatusAction } from "@/app/(admin)/admin/actions";

interface TrainingRequest {
  id: string;
  clientName: string;
  age: string;
  gender: string;
  contact: string;
  trainingName: string;
  preference: "online" | "in-person";
  message?: string;
  status: "pending" | "approved" | "rejected";
  dateTime: string;
}


export interface TrainingRequestsClientWrapperProps {
  initialRequests: TrainingRequest[];
}

export function TrainingRequestsClientWrapper({ initialRequests }: TrainingRequestsClientWrapperProps): React.JSX.Element {
  const [requests, setRequests] = React.useState<TrainingRequest[]>(initialRequests);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selectedRequest, setSelectedRequest] = React.useState<TrainingRequest | null>(null);

  const handleStatusChange = async (id: string, nextStatus: "approved" | "rejected") => {
    const dbStatus = nextStatus === "approved" ? "APPROVED" : "REJECTED";
    
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
      req.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-8 font-sans">
      <div className="flex flex-col gap-1">
        <h1 className="font-marcellus text-3xl font-bold text-dark-green">Training Requests</h1>
        <p className="text-sm text-light-ash">View and manage registration requests for training batches.</p>
      </div>

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
                  <tr key={req.id} className="hover:bg-light/10 transition-colors">
                    <td className="px-6 py-4 font-semibold text-dark-green">{req.id}</td>
                    <td className="px-6 py-4 font-semibold text-dark">{req.clientName}</td>
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
                          onClick={() => setSelectedRequest(req)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 backdrop-blur-md px-4 py-6">
          <div className="bg-white rounded-3xl border border-muted/50 shadow-2xl max-w-md w-full overflow-hidden flex flex-col p-6 text-left">
            <div className="flex items-center justify-between border-b border-muted pb-4 mb-4">
              <h3 className="font-marcellus text-xl font-bold text-dark-green">Request Details</h3>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-sm font-sans">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-light-ash font-medium">ID:</span>
                <span className="col-span-2 text-dark font-semibold font-mono">{selectedRequest.id}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-light-ash font-medium">Participant:</span>
                <span className="col-span-2 text-dark font-semibold">{selectedRequest.clientName} (Age: {selectedRequest.age}, {selectedRequest.gender})</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-light-ash font-medium">Contact:</span>
                <span className="col-span-2 text-dark">{selectedRequest.contact}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-light-ash font-medium">Training:</span>
                <span className="col-span-2 text-dark">{selectedRequest.trainingName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-light-ash font-medium">Preference:</span>
                <span className="col-span-2 text-dark capitalize">{selectedRequest.preference}</span>
              </div>
              {selectedRequest.message && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-light-ash font-medium">Message:</span>
                  <span className="col-span-2 text-dark leading-relaxed">{selectedRequest.message}</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-light-ash font-medium">Status:</span>
                <span className="col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider text-[10px] ${
                    selectedRequest.status === "pending" ? "bg-accent/15 text-accent border-accent/20" :
                    selectedRequest.status === "approved" ? "bg-primary/10 text-primary-dark border-primary/20" :
                    "bg-red-50 text-red-700 border-red-200"
                  }`}>
                    {selectedRequest.status}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-muted pt-4">
              {selectedRequest.status === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, "rejected");
                      setSelectedRequest((prev) => prev ? { ...prev, status: "rejected" } : null);
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer border border-red-200"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, "approved");
                      setSelectedRequest((prev) => prev ? { ...prev, status: "approved" } : null);
                    }}
                    className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-md"
                  >
                    Approve
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
      )}
    </div>
  );
}
