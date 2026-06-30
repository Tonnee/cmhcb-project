import * as React from "react";
import type { Metadata } from "next";
import {
  HiMagnifyingGlass,
  HiFunnel,
  HiEye,
  HiCheck,
  HiXMark
} from "react-icons/hi2";

export const metadata: Metadata = {
  title: "Manage Appointments | Admin Portal | CMHCB",
  description: "View and manage client scheduled therapy appointments for Center for Mental Health and Care, Bangladesh.",
};

interface AppointmentMockData {
  id: string;
  clientName: string;
  therapistName: string;
  dateTime: string;
  sessionType: string;
  status: "scheduled" | "completed" | "cancelled";
  amount: string;
}

const MOCK_APPOINTMENTS: AppointmentMockData[] = [
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

export default function AdminAppointmentsPage(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-8">
      {/* Header section */}
      <div className="flex flex-col gap-1">
        <h1 className="font-marcellus text-3xl font-bold text-dark-green">
          Manage Appointments
        </h1>
        <p className="font-sans text-sm text-light-ash">
          Track and configure therapy sessions, bookings, and appointment schedules.
        </p>
      </div>

      {/* Filter and search bar placeholder */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-muted shadow-sm">
        <div className="relative w-full md:w-80">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-ash/70" />
          <input
            type="text"
            placeholder="Search by client or therapist..."
            className="w-full pl-10 pr-4 py-2 border border-muted rounded-xl text-sm font-sans focus:outline-none focus:border-primary bg-page-bg/50"
            disabled
          />
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl font-sans hover:bg-primary-dark transition-colors cursor-pointer"
          >
            All Bookings
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-light/50 text-dark-green hover:bg-light text-xs font-semibold rounded-xl font-sans transition-colors cursor-pointer"
          >
            Scheduled
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-light/50 text-dark-green hover:bg-light text-xs font-semibold rounded-xl font-sans transition-colors cursor-pointer"
          >
            Completed
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-light/50 text-dark-green hover:bg-light text-xs font-semibold rounded-xl font-sans transition-colors cursor-pointer"
          >
            Cancelled
          </button>
          <button
            type="button"
            className="p-2 border border-muted text-light-ash hover:text-dark hover:bg-light/30 rounded-xl transition-colors shrink-0 cursor-pointer"
            title="Filters"
          >
            <HiFunnel className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main content - Table */}
      <div className="bg-white border border-muted rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="bg-light/35 border-b border-muted">
                <th className="px-6 py-4 font-semibold text-dark">Appointment ID</th>
                <th className="px-6 py-4 font-semibold text-dark">Client</th>
                <th className="px-6 py-4 font-semibold text-dark">Therapist</th>
                <th className="px-6 py-4 font-semibold text-dark">Date & Time</th>
                <th className="px-6 py-4 font-semibold text-dark">Session Type</th>
                <th className="px-6 py-4 font-semibold text-dark">Status</th>
                <th className="px-6 py-4 font-semibold text-dark text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/60">
              {MOCK_APPOINTMENTS.map((apt) => (
                <tr key={apt.id} className="hover:bg-light/10 transition-colors">
                  <td className="px-6 py-4 font-medium text-dark-green">{apt.id}</td>
                  <td className="px-6 py-4 font-medium text-dark">{apt.clientName}</td>
                  <td className="px-6 py-4 text-light-ash">{apt.therapistName}</td>
                  <td className="px-6 py-4 text-light-ash">{apt.dateTime}</td>
                  <td className="px-6 py-4 text-light-ash">{apt.sessionType}</td>
                  <td className="px-6 py-4">
                    {apt.status === "scheduled" && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent">
                        Scheduled
                      </span>
                    )}
                    {apt.status === "completed" && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary-dark">
                        Completed
                      </span>
                    )}
                    {apt.status === "cancelled" && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        Cancelled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        className="p-2 text-light-ash hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <HiEye className="w-4 h-4" />
                      </button>
                      {apt.status === "scheduled" && (
                        <>
                          <button
                            type="button"
                            className="p-2 text-light-ash hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                            title="Mark Completed"
                          >
                            <HiCheck className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
