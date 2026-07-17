"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const appointmentSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  age: z.string().refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, "Age must be a positive number"),
  gender: z.string().min(1, "Gender selection is required"),
  contact: z.string().min(1, "Contact details (Number / Email) are required"),
  service: z.string().min(1, "Please choose a service"),
  therapist: z.string().min(1, "Please select a therapist"),
  date: z.string().min(1, "Pick a valid date"),
  time: z.string().min(1, "Pick a valid time"),
  preference: z.enum(["online", "in-person"]),
  message: z.string().optional(),
});

export async function createAppointmentAction(data: unknown) {
  const result = appointmentSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues.map((i) => i.message).join(", ") };
  }

  const validated = result.data;

  try {
    // Fetch therapist name for storage clarity
    const therapistRecord = await prisma.therapist.findUnique({
      where: { id: validated.therapist },
    });
    const therapistName = therapistRecord?.name || validated.therapist;

    // Fetch service title
    const serviceRecord = await prisma.service.findUnique({
      where: { slug: validated.service },
    });
    const serviceTitle = serviceRecord?.title || validated.service;

    await prisma.appointment.create({
      data: {
        name: validated.name,
        age: parseInt(validated.age, 10),
        gender: validated.gender,
        contact: validated.contact,
        service: serviceTitle,
        therapist: therapistName,
        date: validated.date,
        time: validated.time,
        preference: validated.preference,
        message: validated.message || null,
        status: "PENDING",
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
