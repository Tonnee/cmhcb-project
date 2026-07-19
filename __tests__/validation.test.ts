import { describe, it, expect } from "vitest";
import { workshopRegistrationSchema } from "@/features/workshops/components/workshop-registration-form";
import { eventRegistrationSchema } from "@/features/events/components/event-registration-form";
import { appointmentSchema } from "@/features/appointment/components/appointment-form";
import { registrationSchema } from "@/features/training/components/training-registration-form";

describe("Workshop Registration Validation Schema", () => {
  it("should validate correct workshop registration inputs", () => {
    const validData = {
      name: "John Doe",
      contact: "+8801700000000",
      email: "john.doe@cmhcbd.com",
      notes: "Looking forward to it",
    };
    const result = workshopRegistrationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email in workshop registration", () => {
    const invalidData = {
      name: "John Doe",
      contact: "+8801700000000",
      email: "not-an-email",
    };
    const result = workshopRegistrationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe("Event Registration Validation Schema", () => {
  it("should validate correct event registration inputs", () => {
    const validData = {
      name: "Jane Doe",
      contact: "+8801711111111",
      email: "jane.doe@cmhcbd.com",
      notes: "Please register me",
    };
    const result = eventRegistrationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject empty name in event registration", () => {
    const invalidData = {
      name: "",
      contact: "+8801711111111",
      email: "jane.doe@cmhcbd.com",
    };
    const result = eventRegistrationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe("Appointment Validation Schema", () => {
  it("should validate correct appointment inputs", () => {
    const validData = {
      name: "Alice Smith",
      age: "25",
      gender: "female",
      contact: "alice@cmhcbd.com",
      service: "depression-counseling",
      therapist: "therapist-123",
      date: "2026-07-25",
      time: "14:30",
      preference: "online",
      message: "Need immediate session",
    };
    const result = appointmentSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid age in appointment", () => {
    const invalidData = {
      name: "Alice Smith",
      age: "-5",
      gender: "female",
      contact: "alice@cmhcbd.com",
      service: "depression-counseling",
      therapist: "therapist-123",
      date: "2026-07-25",
      time: "14:30",
      preference: "online",
    };
    const result = appointmentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe("Training Registration Validation Schema", () => {
  it("should validate correct training registration inputs", () => {
    const validData = {
      name: "Bob Jones",
      age: "30",
      gender: "male",
      contact: "bob@cmhcbd.com",
      training: "mental-health-first-aid",
      preference: "in-person",
      message: "Ready to start",
    };
    const result = registrationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid preference option", () => {
    const invalidData = {
      name: "Bob Jones",
      age: "30",
      gender: "male",
      contact: "bob@cmhcbd.com",
      training: "mental-health-first-aid",
      preference: "invalid-preference",
    };
    const result = registrationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
