"use client";

import * as React from "react";
import { getUnreadNotificationCountsAction } from "@/app/(admin)/admin/actions";

export interface AdminNotificationContextValue {
  unreadAppointments: number;
  unreadTrainingRequests: number;
  decrementAppointments: () => void;
  decrementTrainingRequests: () => void;
  refreshCounts: () => Promise<void>;
}

export const AdminNotificationContext = React.createContext<AdminNotificationContextValue>({
  unreadAppointments: 0,
  unreadTrainingRequests: 0,
  decrementAppointments: () => {},
  decrementTrainingRequests: () => {},
  refreshCounts: async () => {},
});

interface AdminNotificationProviderProps {
  initialAppointments: number;
  initialTrainingRequests: number;
  children: React.ReactNode;
}

const POLLING_INTERVAL_MS = 20000;

export default function AdminNotificationProvider({
  initialAppointments,
  initialTrainingRequests,
  children,
}: AdminNotificationProviderProps): React.JSX.Element {
  const [unreadAppointments, setUnreadAppointments] = React.useState(initialAppointments);
  const [unreadTrainingRequests, setUnreadTrainingRequests] = React.useState(initialTrainingRequests);

  const refreshCounts = React.useCallback(async (): Promise<void> => {
    try {
      const counts = await getUnreadNotificationCountsAction();
      setUnreadAppointments(counts.appointments);
      setUnreadTrainingRequests(counts.trainingRequests);
    } catch {
      // Gracefully ignore polling errors
    }
  }, []);

  const decrementAppointments = React.useCallback((): void => {
    setUnreadAppointments((prev) => Math.max(0, prev - 1));
  }, []);

  const decrementTrainingRequests = React.useCallback((): void => {
    setUnreadTrainingRequests((prev) => Math.max(0, prev - 1));
  }, []);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      void refreshCounts();
    }, POLLING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [refreshCounts]);

  const value = React.useMemo<AdminNotificationContextValue>(() => ({
    unreadAppointments,
    unreadTrainingRequests,
    decrementAppointments,
    decrementTrainingRequests,
    refreshCounts,
  }), [
    unreadAppointments,
    unreadTrainingRequests,
    decrementAppointments,
    decrementTrainingRequests,
    refreshCounts,
  ]);

  return (
    <AdminNotificationContext.Provider value={value}>
      {children}
    </AdminNotificationContext.Provider>
  );
}
