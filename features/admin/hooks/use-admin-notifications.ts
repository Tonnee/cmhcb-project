"use client";

import * as React from "react";
import {
  AdminNotificationContext,
  type AdminNotificationContextValue,
} from "@/features/admin/components/admin-notification-provider";

export function useAdminNotifications(): AdminNotificationContextValue {
  const context = React.useContext(AdminNotificationContext);
  if (!context) {
    throw new Error("useAdminNotifications must be used within an AdminNotificationProvider");
  }
  return context;
}
