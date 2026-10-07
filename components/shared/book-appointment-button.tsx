import * as React from "react";
import { Button } from "@/components/ui/button";

interface BookAppointmentButtonProps {
  className?: string;
  variant?: "primary" | "primary-dark" | "secondary" | "accent" | "outline" | "ghost" | "white";
  therapistId?: string;
  serviceSlug?: string;
}

export function BookAppointmentButton({
  className = "",
  variant = "outline",
  therapistId,
  serviceSlug,
}: BookAppointmentButtonProps): React.JSX.Element {
  const params = new URLSearchParams();
  if (therapistId) params.set("therapist", therapistId);
  if (serviceSlug) params.set("service", serviceSlug);
  const queryString = params.toString();
  const href = queryString ? `/appointment?${queryString}` : "/appointment";

  return (
    <Button href={href} variant={variant} className={className}>
      Book Appointment
    </Button>
  );
}
