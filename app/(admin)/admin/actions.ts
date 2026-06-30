"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";

// Helper to slugify strings if slug is not provided or modified
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ============================================================================
// Zod Validation Schemas
// ============================================================================

const TherapistInputSchema = z.object({
  id: z.string().optional(),
  image: z.string().min(1, "Image URL is required"),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  bio: z.string().min(1, "Bio is required"),
  education: z.array(z.string()).default([]),
  training: z.array(z.string()).default([]),
  expertise: z.array(z.string()).default([]),
  experience: z.array(z.string()).default([]),
  fees: z.array(
    z.object({
      category: z.string(),
      items: z.array(
        z.object({
          label: z.string(),
          amount: z.string(),
          note: z.string().optional(),
        })
      ),
    })
  ).default([]),
  services: z.array(z.string()).default([]),
  activities: z.array(z.string()).default([]),
});

const WorkshopInputSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image URL is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  author: z.string().min(1, "Instructor/Author is required"),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  content: z.string().optional(),
  gallery: z.array(z.string()).default([]),
});

const BlogPostInputSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  image: z.string().min(1, "Image URL is required"),
  publishedAt: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
});

// ============================================================================
// Server Actions - Therapists
// ============================================================================

export async function upsertTherapistAction(
  rawData: z.infer<typeof TherapistInputSchema>
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const validated = TherapistInputSchema.parse(rawData);
    
    // Generate id/slug if new
    const id = validated.id || slugify(validated.name);

    const dataPayload = {
      image: validated.image,
      name: validated.name,
      role: validated.role,
      bio: validated.bio,
      education: JSON.stringify(validated.education),
      training: JSON.stringify(validated.training),
      expertise: JSON.stringify(validated.expertise),
      experience: JSON.stringify(validated.experience),
      fees: JSON.stringify(validated.fees),
      services: JSON.stringify(validated.services),
      activities: JSON.stringify(validated.activities),
    };

    const therapist = await prisma.therapist.upsert({
      where: { id },
      update: dataPayload,
      create: {
        id,
        ...dataPayload,
      },
    });

    // Revalidate paths
    revalidatePath("/therapists");
    revalidatePath(`/therapists/${id}`);
    revalidatePath("/admin/therapists");

    return { success: true, data: therapist };
  } catch (error: any) {
    console.error("Error in upsertTherapistAction:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(", ") };
    }
    return { success: false, error: error.message || "An unexpected database error occurred" };
  }
}

export async function deleteTherapistAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.therapist.delete({
      where: { id },
    });

    revalidatePath("/therapists");
    revalidatePath(`/therapists/${id}`);
    revalidatePath("/admin/therapists");

    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteTherapistAction:", error);
    return { success: false, error: error.message || "Failed to delete therapist record" };
  }
}

// ============================================================================
// Server Actions - Workshops
// ============================================================================

export async function upsertWorkshopAction(
  rawData: z.infer<typeof WorkshopInputSchema>
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const validated = WorkshopInputSchema.parse(rawData);
    
    // Generate id/slug if new
    const titleSlug = validated.slug || slugify(validated.title);
    const id = validated.id || `ws-${titleSlug}`;

    const dataPayload = {
      slug: titleSlug,
      title: validated.title,
      description: validated.description,
      image: validated.image,
      date: validated.date,
      time: validated.time,
      location: validated.location,
      author: validated.author,
      tags: JSON.stringify(validated.tags),
      isFeatured: validated.isFeatured,
      content: validated.content || "",
      gallery: JSON.stringify(validated.gallery),
    };

    const workshop = await prisma.workshop.upsert({
      where: { id },
      update: dataPayload,
      create: {
        id,
        ...dataPayload,
      },
    });

    revalidatePath("/workshops");
    revalidatePath(`/workshops/${titleSlug}`);
    revalidatePath("/admin/workshops");

    return { success: true, data: workshop };
  } catch (error: any) {
    console.error("Error in upsertWorkshopAction:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(", ") };
    }
    return { success: false, error: error.message || "An unexpected database error occurred" };
  }
}

export async function deleteWorkshopAction(
  id: string,
  slug?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.workshop.delete({
      where: { id },
    });

    revalidatePath("/workshops");
    if (slug) {
      revalidatePath(`/workshops/${slug}`);
    }
    revalidatePath("/admin/workshops");

    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteWorkshopAction:", error);
    return { success: false, error: error.message || "Failed to delete workshop record" };
  }
}

// ============================================================================
// Server Actions - Blog Posts
// ============================================================================

export async function upsertBlogPostAction(
  rawData: z.infer<typeof BlogPostInputSchema>
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const validated = BlogPostInputSchema.parse(rawData);
    
    // Generate id/slug if new
    const postSlug = validated.slug || slugify(validated.title);
    const id = validated.id || `post-${postSlug}`;
    const publishedAt = validated.publishedAt || new Date().toISOString();

    const dataPayload = {
      slug: postSlug,
      title: validated.title,
      excerpt: validated.excerpt,
      content: validated.content,
      image: validated.image,
      publishedAt,
      author: validated.author,
      tags: JSON.stringify(validated.tags),
      isFeatured: validated.isFeatured,
    };

    const blogPost = await prisma.blogPost.upsert({
      where: { id },
      update: dataPayload,
      create: {
        id,
        ...dataPayload,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${postSlug}`);
    revalidatePath("/admin/blogs");

    return { success: true, data: blogPost };
  } catch (error: any) {
    console.error("Error in upsertBlogPostAction:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(", ") };
    }
    return { success: false, error: error.message || "An unexpected database error occurred" };
  }
}

export async function deleteBlogPostAction(
  id: string,
  slug?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.blogPost.delete({
      where: { id },
    });

    revalidatePath("/blog");
    if (slug) {
      revalidatePath(`/blog/${slug}`);
    }
    revalidatePath("/admin/blogs");

    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteBlogPostAction:", error);
    return { success: false, error: error.message || "Failed to delete blog post record" };
  }
}

// ============================================================================
// Server Actions - Landing Page Content
// ============================================================================

const LandingPageContentInputSchema = z.object({
  heroHeadline: z.string().min(1, "Hero headline is required"),
  heroSubtitle: z.string().min(1, "Hero subtitle is required"),
  heroBgImage: z.string().min(1, "Hero background image is required"),
  heroFigureImage: z.string().min(1, "Hero figure image is required"),
  wellbeingHeadline: z.string().min(1, "Wellbeing headline is required"),
  wellbeingSubtitle: z.string().min(1, "Wellbeing subtitle is required"),
  experienceCount: z.number().int().nonnegative(),
  happyClientsCount: z.number().int().nonnegative(),
  sessionsCount: z.number().int().nonnegative(),
  satisfactionRate: z.number().int().min(0).max(100),
  trainingHeadline: z.string().min(1, "Training headline is required"),
  trainingSubtitle: z.string().min(1, "Training description is required"),
  trainingImage: z.string().min(1, "Training display image is required"),
});

export async function updateLandingPageContentAction(
  rawData: z.infer<typeof LandingPageContentInputSchema>
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const validated = LandingPageContentInputSchema.parse(rawData);

    const landingContent = await prisma.landingPageContent.upsert({
      where: { id: "landing-content" },
      update: validated,
      create: {
        id: "landing-content",
        ...validated,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/landing-page");

    return { success: true, data: landingContent };
  } catch (error: any) {
    console.error("Error in updateLandingPageContentAction:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(", ") };
    }
    return { success: false, error: error.message || "An unexpected database error occurred" };
  }
}

// ============================================================================
// Server Actions - Services
// ============================================================================

export async function getActiveServicesListAction(): Promise<{
  success: boolean;
  data: { title: string; slug: string; icon: string }[];
}> {
  try {
    const services = await prisma.service.findMany({
      select: {
        title: true,
        slug: true,
        icon: true,
      },
      orderBy: { title: "asc" },
    });
    return { success: true, data: services };
  } catch (error) {
    console.error("Error in getActiveServicesListAction:", error);
    return { success: false, data: [] };
  }
}

const ServiceInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  icon: z.string().min(1, "Icon is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  longDescription: z.string().min(1, "Long description is required"),
  approach: z.string().min(1, "Approach is required"),
  isFeatured: z.boolean().default(false),
});

export async function upsertServiceAction(
  rawData: z.infer<typeof ServiceInputSchema>
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const validated = ServiceInputSchema.parse(rawData);
    
    // Generate id if new
    const id = validated.id || `srv-${validated.slug}`;

    const dataPayload = {
      title: validated.title,
      slug: validated.slug,
      icon: validated.icon,
      shortDescription: validated.shortDescription,
      longDescription: validated.longDescription,
      approach: validated.approach,
      isFeatured: validated.isFeatured,
    };

    const service = await prisma.service.upsert({
      where: { id },
      update: dataPayload,
      create: {
        id,
        ...dataPayload,
      },
    });

    revalidatePath("/services");
    revalidatePath(`/services/${validated.slug}`);
    revalidatePath("/admin/services");

    return { success: true, data: service };
  } catch (error: any) {
    console.error("Error in upsertServiceAction:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(", ") };
    }
    return { success: false, error: error.message || "An unexpected database error occurred" };
  }
}

export async function deleteServiceAction(
  id: string,
  slug?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.service.delete({
      where: { id },
    });

    revalidatePath("/services");
    if (slug) {
      revalidatePath(`/services/${slug}`);
    }
    revalidatePath("/admin/services");

    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteServiceAction:", error);
    return { success: false, error: error.message || "Failed to delete service record" };
  }
}


