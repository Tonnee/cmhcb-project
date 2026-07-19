"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const workshopRegistrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact: z.string().min(1, "Contact detail is required"),
  email: z.string().email("Invalid email address"),
  notes: z.string().optional(),
  workshopId: z.string().min(1, "Workshop ID is required"),
  workshopTitle: z.string().min(1, "Workshop Title is required"),
});

export async function createWorkshopRegistrationAction(data: unknown) {
  const result = workshopRegistrationSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues.map((i) => i.message).join(", ") };
  }

  const validated = result.data;

  try {
    await prisma.workshopRegistration.create({
      data: {
        name: validated.name,
        contact: validated.contact,
        email: validated.email,
        notes: validated.notes || null,
        workshopId: validated.workshopId,
        workshopTitle: validated.workshopTitle,
        status: "PENDING",
      },
    });

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred." };
  }
}
