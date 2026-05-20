import * as React from "react";
import { Button } from "@/components/ui/button";

interface BookAppointmentButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "white";
  therapistId?: string;
}

export function BookAppointmentButton({
  className = "",
  variant = "outline",
  therapistId,
}: BookAppointmentButtonProps): React.JSX.Element {
  const href = therapistId ? `/appointment?therapist=${therapistId}` : "/appointment";

  return (
    <Button href={href} variant={variant} className={className}>
      Book Appointment
    </Button>
  );
}
