"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const registrationSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  age: z.string().refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, "Age must be a positive number"),
  gender: z.string().min(1, "Gender selection is required"),
  contact: z.string().min(1, "Contact details (Number / Email) are required"),
  training: z.string().min(1, "Please choose a training program"),
  preference: z.enum(["online", "in-person"]),
  message: z.string().optional(),
});

export async function createTrainingRequestAction(data: unknown) {
  const result = registrationSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues.map((i) => i.message).join(", ") };
  }

  const validated = result.data;

  try {
    // Fetch training title
    const trainingRecord = await prisma.training.findUnique({
      where: { slug: validated.training },
    });
    const trainingTitle = trainingRecord?.title || validated.training;

    // Generate human-readable numeric ID based on date of request (e.g. TRN-20260826-1)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const datePrefix = `TRN-${year}${month}${day}`;

    const countToday = await prisma.trainingRequest.count({
      where: {
        id: {
          startsWith: datePrefix,
        },
      },
    });

    let attempt = countToday + 1;
    let requestId = `${datePrefix}-${attempt}`;
    while (await prisma.trainingRequest.findUnique({ where: { id: requestId } })) {
      attempt++;
      requestId = `${datePrefix}-${attempt}`;
    }

    const createdRequest = await prisma.trainingRequest.create({
      data: {
        id: requestId,
        name: validated.name,
        age: parseInt(validated.age, 10),
        gender: validated.gender,
        contact: validated.contact,
        training: trainingTitle,
        preference: validated.preference,
        message: validated.message || null,
        status: "PENDING",
      },
    });

    return { success: true, requestId: createdRequest.id };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred." };
  }
}
