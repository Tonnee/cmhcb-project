"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { safeJsonParse } from "@/lib/json";
import type { FormFieldConfig } from "@/types/form-fields";

const registrationSchema = z
  .object({
    name: z.string().min(1, "Full Name is required"),
    age: z
      .string()
      .or(z.number())
      .transform((val) => String(val))
      .refine((val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      }, "Age must be a valid number"),
    gender: z.string().min(1, "Gender selection is required"),
    contact: z.string().min(1, "Contact details (Number / Email) are required"),
    training: z.string().min(1, "Please choose a training program"),
    preference: z.enum(["online", "in-person"]).default("online"),
    message: z.string().optional(),
    customFields: z.record(z.string(), z.any()).optional().default({}),
  })
  .passthrough();

function sanitizeCustomValue(val: unknown): string | number | boolean {
  if (typeof val === "boolean" || typeof val === "number") return val;
  const str = String(val ?? "").trim();
  // Strip malicious script tags & limit length
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").slice(0, 5000);
}

export async function createTrainingRequestAction(data: unknown) {
  const result = registrationSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues.map((i) => i.message).join(", ") };
  }

  const validated = result.data;
  const rawPayload = data as Record<string, any>;

  try {
    // 1. Process custom fields (collect from customFields object or extra payload properties)
    const rawCustomFields: Record<string, any> = {
      ...(validated.customFields || {}),
    };

    const systemKeys = new Set([
      "name",
      "age",
      "gender",
      "contact",
      "training",
      "preference",
      "message",
      "customFields",
    ]);

    for (const [key, value] of Object.entries(rawPayload)) {
      if (!systemKeys.has(key) && value !== undefined && value !== null) {
        rawCustomFields[key] = value;
      }
    }

    // 2. Validate custom fields according to dynamic schema
    const contentRecord = await (prisma as any).joinTrainingPageContent.findFirst().catch(() => null);
    if (contentRecord?.formFields) {
      const configuredFields = safeJsonParse<FormFieldConfig[]>(contentRecord.formFields, []);
      if (configuredFields && configuredFields.length > 0) {
        for (const field of configuredFields) {
          if (field.enabled !== false && field.required && !field.isSystemField) {
            const val = rawCustomFields[field.label] ?? rawCustomFields[field.id];
            if (val === undefined || val === null || String(val).trim() === "") {
              return { success: false, error: `${field.label} is required.` };
            }
          }
        }
      }
    }

    // 3. Sanitize custom field dictionary
    const sanitizedCustomFields: Record<string, any> = {};
    for (const [key, value] of Object.entries(rawCustomFields)) {
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        const cleanKey = key.slice(0, 100);
        sanitizedCustomFields[cleanKey] = sanitizeCustomValue(value);
      }
    }

    // 4. Fetch training title
    const trainingRecord = await prisma.training.findUnique({
      where: { slug: validated.training },
    });
    const trainingTitle = trainingRecord?.title || validated.training;

    // 5. Generate human-readable numeric ID based on date of request (e.g. TRN-20260826-1)
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

    // 6. Safe database insert with customFields JSON string
    const createdRequest = await prisma.trainingRequest.create({
      data: {
        id: requestId,
        name: validated.name.trim(),
        age: parseInt(validated.age, 10) || 0,
        gender: validated.gender,
        contact: validated.contact.trim(),
        training: trainingTitle,
        preference: validated.preference,
        message: validated.message?.trim() || null,
        customFields: JSON.stringify(sanitizedCustomFields),
        status: "PENDING",
      },
    });

    return { success: true, requestId: createdRequest.id };
  } catch (error: unknown) {
    console.error("Error in createTrainingRequestAction:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred." };
  }
}
