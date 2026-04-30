import * as React from "react";
import { Button } from "@/components/ui/button";

interface BookAppointmentButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "white";
}

export function BookAppointmentButton({
  className = "",
  variant = "primary",
}: BookAppointmentButtonProps): React.JSX.Element {
  return (
    <Button href="/book" variant={variant} className={className}>
      Book Appointment
    </Button>
  );
}
