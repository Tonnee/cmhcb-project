"use client";

import * as React from "react";
import {
  HiMagnifyingGlass,
  HiFunnel,
  HiEye,
  HiCheck,
  HiXMark
} from "react-icons/hi2";

interface Appointment {
  id: string;
  clientName: string;
  therapistName: string;
  dateTime: string;
  sessionType: string;
  status: "scheduled" | "completed" | "cancelled";
  amount: string;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "APT-801",
    clientName: "Tahmid Rahman",
    therapistName: "Dr. Sabrina Ahmed",
    dateTime: "June 28, 2026 at 10:00 AM",
    sessionType: "Individual Therapy",
    status: "scheduled",
    amount: "BDT 2,500",
  },
  {
    id: "APT-802",
    clientName: "Sayeeda Islam",
    therapistName: "Nusrat Jahan",
    dateTime: "June 28, 2026 at 03:00 PM",
    sessionType: "Couple Counseling",
    status: "scheduled",
    amount: "BDT 3,000",
  },
  {
    id: "APT-803",
    clientName: "Ayman Faiz",
    therapistName: "Prof. Kamal Uddin",
    dateTime: "June 27, 2026 at 11:30 AM",
    sessionType: "Child Therapy",
    status: "completed",
    amount: "BDT 3,500",
  },
  {
    id: "APT-804",
    clientName: "Mehrab Hossain",
    therapistName: "Sajid Hasan",
    dateTime: "June 26, 2026 at 05:00 PM",
    sessionType: "Cognitive Behavioral Therapy",
    status: "cancelled",
    amount: "BDT 2,500",
  },
];

export function AppointmentsClientWrapper(): React.JSX.Element {
  const [appointments, setAppointments] = React.useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "scheduled" | "completed" | "cancelled">("all");
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null);

  const handleStatusChange = (id: string, nextStatus: "completed" | "cancelled") => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: nextStatus } : apt))
    );
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.therapistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.sessionType.toLowerCase().includes(searchQuery.toLowerCase());

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
          Track and configure therapy sessions, bookings, and appointment schedules.
        </p>
      </div>

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
                <th className="px-6 py-4">Session Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/30">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-light/10 transition-colors">
                    <td className="px-6 py-4 font-semibold text-dark-green">{apt.id}</td>
                    <td className="px-6 py-4 font-semibold text-dark">{apt.clientName}</td>
                    <td className="px-6 py-4 text-light-ash">{apt.therapistName}</td>
                    <td className="px-6 py-4 text-light-ash">{apt.dateTime}</td>
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
                          onClick={() => setSelectedAppointment(apt)}
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
                  <td colSpan={7} className="px-6 py-12 text-center text-light-ash font-medium">
                    No appointments found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 backdrop-blur-md px-4 py-6">
          <div className="bg-white rounded-3xl border border-muted/50 shadow-2xl max-w-md w-full overflow-hidden animate-fade-in flex flex-col p-6 text-left">
            <div className="flex items-center justify-between border-b border-muted pb-4 mb-4">
              <h3 className="font-marcellus text-xl font-bold text-dark-green">
                Appointment Details
              </h3>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="p-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg transition-colors cursor-pointer"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-sm font-sans">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-light-ash font-medium">ID:</span>
                <span className="col-span-2 text-dark font-semibold font-mono">{selectedAppointment.id}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-light-ash font-medium">Client:</span>
                <span className="col-span-2 text-dark font-semibold">{selectedAppointment.clientName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-light-ash font-medium">Therapist:</span>
                <span className="col-span-2 text-dark font-semibold">{selectedAppointment.therapistName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-light-ash font-medium">Date & Time:</span>
                <span className="col-span-2 text-dark">{selectedAppointment.dateTime}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-light-ash font-medium">Session Type:</span>
                <span className="col-span-2 text-dark">{selectedAppointment.sessionType}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-light-ash font-medium">Fee:</span>
                <span className="col-span-2 text-primary-dark font-semibold">{selectedAppointment.amount}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <span className="text-light-ash font-medium">Status:</span>
                <span className="col-span-2">
                  {selectedAppointment.status === "scheduled" && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-accent/15 text-accent border border-accent/20 uppercase tracking-wider text-[10px]">
                      Scheduled
                    </span>
                  )}
                  {selectedAppointment.status === "completed" && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary-dark border border-primary/20 uppercase tracking-wider text-[10px]">
                      Completed
                    </span>
                  )}
                  {selectedAppointment.status === "cancelled" && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 uppercase tracking-wider text-[10px]">
                      Cancelled
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-muted pt-4">
              {selectedAppointment.status === "scheduled" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(selectedAppointment.id, "cancelled");
                      setSelectedAppointment((prev) => prev ? { ...prev, status: "cancelled" } : null);
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer border border-red-200"
                  >
                    Cancel Session
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(selectedAppointment.id, "completed");
                      setSelectedAppointment((prev) => prev ? { ...prev, status: "completed" } : null);
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
      )}
    </div>
  );
}
