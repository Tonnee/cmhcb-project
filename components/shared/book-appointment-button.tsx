import * as React from "react";
import { Button } from "@/components/ui/button";

interface BookAppointmentButtonProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
}

export function BookAppointmentButton({
  className = "",
  size = "md",
  variant = "primary",
}: BookAppointmentButtonProps): React.JSX.Element {
  return (
    <Button href="/book" variant={variant} size={size} className={className}>
      Book Appointment
    </Button>
  );
}
