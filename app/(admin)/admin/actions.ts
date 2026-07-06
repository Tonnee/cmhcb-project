"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getRequiredAdminSession, logActivity } from "./admin-management";

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

const AboutPageInputSchema = z.object({
  heroTitle: z.string().min(1, "Hero Title is required"),
  heroDescription: z.string().min(1, "Hero Description is required"),
  heroImage: z.string().min(1, "Hero Image is required"),
  missionTitle: z.string().min(1, "Mission Title is required"),
  missionText: z.string().min(1, "Mission Text is required"),
  visionTitle: z.string().min(1, "Vision Title is required"),
  visionText: z.string().min(1, "Vision Text is required"),
  coreValues: z.array(
    z.object({
      title: z.string().min(1, "Value Title is required"),
      description: z.string().min(1, "Value Description is required"),
      icon: z.string().min(1, "Value Icon is required"),
    })
  ).default([]),
});

const ContactPageInputSchema = z.object({
  phone: z.string().min(1, "Phone is required"),
  email: z.string().min(1, "Email is required"),
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().min(1, "Address Line 2 is required"),
  addressLine3: z.string().min(1, "Address Line 3 is required"),
  facebookUrl: z.string().default("#"),
  instagramUrl: z.string().default("#"),
  twitterUrl: z.string().default("#"),
  linkedinUrl: z.string().default("#"),
  mapEmbedUrl: z.string().min(1, "Map Embed URL is required"),
});

const FaqPageInputSchema = z.object({
  heroTitle: z.string().min(1, "Hero Title is required"),
  heroDescription: z.string().min(1, "Hero Description is required"),
  heroImage: z.string().min(1, "Hero Image is required"),
  items: z.array(
    z.object({
      category: z.string().min(1, "Category is required"),
      question: z.string().min(1, "Question is required"),
      answer: z.string().min(1, "Answer is required"),
    })
  ).default([]),
});

const PolicyPageInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  content: z.string().min(1, "Content is required"),
});

const AffiliationPageInputSchema = z.object({
  heroTitle: z.string().min(1, "Hero Title is required"),
  heroDescription: z.string().min(1, "Hero Description is required"),
  heroImage: z.string().min(1, "Hero Image is required"),
  partners: z.array(
    z.object({
      name: z.string().min(1, "Partner Name is required"),
      type: z.string().min(1, "Partner Type is required"),
      abbr: z.string().min(1, "Partner Abbreviation is required"),
    })
  ).default([]),
  benefits: z.array(
    z.object({
      title: z.string().min(1, "Benefit Title is required"),
      description: z.string().min(1, "Benefit Description is required"),
      icon: z.string().min(1, "Benefit Icon is required"),
    })
  ).default([]),
  ctaTitle: z.string().min(1, "CTA Title is required"),
  ctaDescription: z.string().min(1, "CTA Description is required"),
  promises: z.array(z.string()).default([]),
});

// ============================================================================
// Server Actions - Therapists
// ============================================================================

export async function upsertTherapistAction(
  rawData: z.infer<typeof TherapistInputSchema>
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const admin = await getRequiredAdminSession();
    const validated = TherapistInputSchema.parse(rawData);
    
    // Generate id/slug if new
    const id = validated.id || slugify(validated.name);
    const existing = await prisma.therapist.findUnique({ where: { id } });

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
      lastUpdatedBy: admin.email,
    };

    const therapist = await prisma.therapist.upsert({
      where: { id },
      update: dataPayload,
      create: {
        id,
        ...dataPayload,
      },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      existing ? "UPDATE" : "CREATE",
      "Therapist",
      id,
      validated.name,
      existing ? `Updated therapist details for "${validated.name}"` : `Created therapist profile for "${validated.name}"`
    );

    // Revalidate paths
    revalidatePath("/");
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
    const admin = await getRequiredAdminSession();
    const existing = await prisma.therapist.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Therapist record not found");
    }

    await prisma.therapist.delete({
      where: { id },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      "DELETE",
      "Therapist",
      id,
      existing.name,
      `Deleted therapist profile for "${existing.name}"`
    );

    revalidatePath("/");
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
    const admin = await getRequiredAdminSession();
    const validated = WorkshopInputSchema.parse(rawData);
    
    // Generate id/slug if new
    const titleSlug = validated.slug || slugify(validated.title);
    const id = validated.id || `ws-${titleSlug}`;
    const existing = await prisma.workshop.findUnique({ where: { id } });

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
      lastUpdatedBy: admin.email,
    };

    const workshop = await prisma.workshop.upsert({
      where: { id },
      update: dataPayload,
      create: {
        id,
        ...dataPayload,
      },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      existing ? "UPDATE" : "CREATE",
      "Workshop",
      id,
      validated.title,
      existing ? `Updated workshop details for "${validated.title}"` : `Created workshop "${validated.title}"`
    );

    revalidatePath("/");
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
    const admin = await getRequiredAdminSession();
    const existing = await prisma.workshop.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Workshop record not found");
    }

    await prisma.workshop.delete({
      where: { id },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      "DELETE",
      "Workshop",
      id,
      existing.title,
      `Deleted workshop "${existing.title}"`
    );

    revalidatePath("/");
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
    const admin = await getRequiredAdminSession();
    const validated = BlogPostInputSchema.parse(rawData);
    
    // Generate id/slug if new
    const postSlug = validated.slug || slugify(validated.title);
    const id = validated.id || `post-${postSlug}`;
    const publishedAt = validated.publishedAt || new Date().toISOString();
    const existing = await prisma.blogPost.findUnique({ where: { id } });

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
      lastUpdatedBy: admin.email,
    };

    const blogPost = await prisma.blogPost.upsert({
      where: { id },
      update: dataPayload,
      create: {
        id,
        ...dataPayload,
      },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      existing ? "UPDATE" : "CREATE",
      "BlogPost",
      id,
      validated.title,
      existing ? `Updated blog post "${validated.title}"` : `Created blog post "${validated.title}"`
    );

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
    const admin = await getRequiredAdminSession();
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Blog post not found");
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      "DELETE",
      "BlogPost",
      id,
      existing.title,
      `Deleted blog post "${existing.title}"`
    );

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
    const admin = await getRequiredAdminSession();
    const validated = LandingPageContentInputSchema.parse(rawData);

    const landingContent = await prisma.landingPageContent.upsert({
      where: { id: "landing-content" },
      update: {
        ...validated,
        lastUpdatedBy: admin.email,
      },
      create: {
        id: "landing-content",
        ...validated,
        lastUpdatedBy: admin.email,
      },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      "UPDATE",
      "LandingPageContent",
      "landing-content",
      "Landing Page Content",
      "Updated landing page display settings and statistics."
    );

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
  data: { title: string; slug: string; icon: string; duration: string | null; fees: string | null }[];
}> {
  try {
    const services = await prisma.service.findMany({
      where: {
        showInNavbar: true,
      },
      select: {
        title: true,
        slug: true,
        icon: true,
        duration: true,
        fees: true,
      },
      orderBy: { title: "asc" },
    });
    return { success: true, data: services };
  } catch (error) {
    console.error("Error in getActiveServicesListAction:", error);
    return { success: false, data: [] };
  }
}

export async function getAllServicesForFormAction(): Promise<{
  success: boolean;
  data: { title: string; slug: string }[];
}> {
  try {
    const services = await prisma.service.findMany({
      select: {
        title: true,
        slug: true,
      },
      orderBy: { title: "asc" },
    });
    return { success: true, data: services };
  } catch (error) {
    console.error("Error in getAllServicesForFormAction:", error);
    return { success: false, data: [] };
  }
}

export async function getAllTherapistsForFormAction(): Promise<{
  success: boolean;
  data: { id: string; name: string; role: string }[];
}> {
  try {
    const therapists = await prisma.therapist.findMany({
      select: {
        id: true,
        name: true,
        role: true,
      },
      orderBy: { name: "asc" },
    });
    return { success: true, data: therapists };
  } catch (error) {
    console.error("Error in getAllTherapistsForFormAction:", error);
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
  showInNavbar: z.boolean().default(true),
  image: z.string().optional().nullable(),
  bgImage: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  fees: z.string().optional().nullable(),
  whoIsItFor: z.string().optional().nullable(),
  format: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  faqs: z.string().optional().nullable(),
});

export async function upsertServiceAction(
  rawData: z.infer<typeof ServiceInputSchema>
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const admin = await getRequiredAdminSession();
    const validated = ServiceInputSchema.parse(rawData);
    
    // Generate id if new
    const id = validated.id || `srv-${validated.slug}`;
    const existing = await prisma.service.findUnique({ where: { id } });

    const dataPayload = {
      title: validated.title,
      slug: validated.slug,
      icon: validated.icon,
      shortDescription: validated.shortDescription,
      longDescription: validated.longDescription,
      approach: validated.approach,
      isFeatured: validated.isFeatured,
      showInNavbar: validated.showInNavbar,
      image: validated.image,
      bgImage: validated.bgImage,
      duration: validated.duration,
      fees: validated.fees,
      whoIsItFor: validated.whoIsItFor,
      format: validated.format,
      language: validated.language,
      faqs: validated.faqs,
      lastUpdatedBy: admin.email,
    };

    const service = await prisma.service.upsert({
      where: { id },
      update: dataPayload,
      create: {
        id,
        ...dataPayload,
      },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      existing ? "UPDATE" : "CREATE",
      "Service",
      id,
      validated.title,
      existing ? `Updated service "${validated.title}"` : `Created service "${validated.title}"`
    );

    revalidatePath("/");
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
    const admin = await getRequiredAdminSession();
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Service not found");
    }

    await prisma.service.delete({
      where: { id },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      "DELETE",
      "Service",
      id,
      existing.title,
      `Deleted service "${existing.title}"`
    );

    revalidatePath("/");
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

// ============================================================================
// Server Actions - Service Info Blocks
// ============================================================================

const ServiceInfoBlockInputSchema = z.object({
  id: z.string().optional(),
  heading: z.string().min(1, "Heading is required"),
  items: z.array(z.string()).default([]),
  ctaLabel: z.string().min(1, "CTA Label is required"),
  ctaHref: z.string().min(1, "CTA Link is required"),
  image: z.string().min(1, "Image URL is required"),
  imageAlt: z.string().min(1, "Image Alt text is required"),
  order: z.number().int().default(0),
});

export async function upsertServiceInfoBlockAction(
  rawData: z.infer<typeof ServiceInfoBlockInputSchema>
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const admin = await getRequiredAdminSession();
    const validated = ServiceInfoBlockInputSchema.parse(rawData);
    
    // Generate id if new
    const id = validated.id || `sib-${slugify(validated.heading)}`;
    const existing = await prisma.serviceInfoBlock.findUnique({ where: { id } });

    const dataPayload = {
      heading: validated.heading,
      items: JSON.stringify(validated.items),
      ctaLabel: validated.ctaLabel,
      ctaHref: validated.ctaHref,
      image: validated.image,
      imageAlt: validated.imageAlt,
      order: validated.order,
      lastUpdatedBy: admin.email,
    };

    const block = await prisma.serviceInfoBlock.upsert({
      where: { id },
      update: dataPayload,
      create: {
        id,
        ...dataPayload,
      },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      existing ? "UPDATE" : "CREATE",
      "ServiceInfoBlock",
      id,
      validated.heading,
      existing ? `Updated service info block "${validated.heading}"` : `Created service info block "${validated.heading}"`
    );

    revalidatePath("/services");
    revalidatePath("/admin/services");

    return { success: true, data: block };
  } catch (error: any) {
    console.error("Error in upsertServiceInfoBlockAction:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(", ") };
    }
    return { success: false, error: error.message || "An unexpected database error occurred" };
  }
}

export async function deleteServiceInfoBlockAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await getRequiredAdminSession();
    const existing = await prisma.serviceInfoBlock.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Service info block not found");
    }

    await prisma.serviceInfoBlock.delete({
      where: { id },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      "DELETE",
      "ServiceInfoBlock",
      id,
      existing.heading,
      `Deleted service info block "${existing.heading}"`
    );

    revalidatePath("/services");
    revalidatePath("/admin/services");

    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteServiceInfoBlockAction:", error);
    return { success: false, error: error.message || "Failed to delete info block" };
  }
}

// ============================================================================
// Server Actions - Trainings
// ============================================================================

const TrainingInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  heroTitle: z.string().min(1, "Hero Title is required"),
  heroDescription: z.string().min(1, "Hero Description is required"),
  introTitle: z.string().min(1, "Introduction Title is required"),
  introDescription: z.string().min(1, "Introduction Description is required"),
  sections: z.array(
    z.object({
      title: z.string(),
      items: z.array(z.string()),
    })
  ).default([]),
  faq: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ).default([]),
  features: z.array(z.string()).default([]),
  duration: z.string().min(1, "Duration is required"),
  fees: z.string().min(1, "Fees are required"),
  variant: z.string().default("primary"),
  image: z.string().optional().nullable(),
  bgImage: z.string().optional().nullable(),
});

export async function upsertTrainingAction(
  rawData: z.infer<typeof TrainingInputSchema>
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const admin = await getRequiredAdminSession();
    const validated = TrainingInputSchema.parse(rawData);
    
    // Generate id if new
    const id = validated.id || `trn-${validated.slug}`;
    const existing = await prisma.training.findUnique({ where: { id } });

    const dataPayload = {
      title: validated.title,
      slug: validated.slug,
      heroTitle: validated.heroTitle,
      heroDescription: validated.heroDescription,
      introTitle: validated.introTitle,
      introDescription: validated.introDescription,
      sections: JSON.stringify(validated.sections),
      faq: JSON.stringify(validated.faq),
      features: JSON.stringify(validated.features),
      duration: validated.duration,
      fees: validated.fees,
      variant: validated.variant,
      image: validated.image,
      bgImage: validated.bgImage,
      lastUpdatedBy: admin.email,
    };

    const training = await prisma.training.upsert({
      where: { id },
      update: dataPayload,
      create: {
        id,
        ...dataPayload,
      },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      existing ? "UPDATE" : "CREATE",
      "Training",
      id,
      validated.title,
      existing ? `Updated training details for "${validated.title}"` : `Created training program "${validated.title}"`
    );

    revalidatePath("/training");
    revalidatePath(`/training/${validated.slug}`);
    revalidatePath("/admin/trainings");

    return { success: true, data: training };
  } catch (error: any) {
    console.error("Error in upsertTrainingAction:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(", ") };
    }
    return { success: false, error: error.message || "An unexpected database error occurred" };
  }
}

export async function deleteTrainingAction(
  id: string,
  slug?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await getRequiredAdminSession();
    const existing = await prisma.training.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Training program not found");
    }

    await prisma.training.delete({
      where: { id },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      "DELETE",
      "Training",
      id,
      existing.title,
      `Deleted training program "${existing.title}"`
    );

    revalidatePath("/training");
    if (slug) {
      revalidatePath(`/training/${slug}`);
    }
    revalidatePath("/admin/trainings");

    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteTrainingAction:", error);
    return { success: false, error: error.message || "Failed to delete training program record" };
  }
}

// ============================================================================
// Server Actions - Training Info Blocks
// ============================================================================

const TrainingInfoBlockInputSchema = z.object({
  id: z.string().optional(),
  heading: z.string().min(1, "Heading is required"),
  items: z.array(z.string()).default([]),
  ctaLabel: z.string().min(1, "CTA Label is required"),
  ctaHref: z.string().min(1, "CTA Link is required"),
  image: z.string().min(1, "Image URL is required"),
  imageAlt: z.string().min(1, "Image Alt text is required"),
  order: z.number().int().default(0),
});

export async function upsertTrainingInfoBlockAction(
  rawData: z.infer<typeof TrainingInfoBlockInputSchema>
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const admin = await getRequiredAdminSession();
    const validated = TrainingInfoBlockInputSchema.parse(rawData);
    
    // Generate id if new
    const id = validated.id || `tib-${slugify(validated.heading)}`;
    const existing = await prisma.trainingInfoBlock.findUnique({ where: { id } });

    const dataPayload = {
      heading: validated.heading,
      items: JSON.stringify(validated.items),
      ctaLabel: validated.ctaLabel,
      ctaHref: validated.ctaHref,
      image: validated.image,
      imageAlt: validated.imageAlt,
      order: validated.order,
      lastUpdatedBy: admin.email,
    };

    const block = await prisma.trainingInfoBlock.upsert({
      where: { id },
      update: dataPayload,
      create: {
        id,
        ...dataPayload,
      },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      existing ? "UPDATE" : "CREATE",
      "TrainingInfoBlock",
      id,
      validated.heading,
      existing ? `Updated training info block "${validated.heading}"` : `Created training info block "${validated.heading}"`
    );

    revalidatePath("/training");
    revalidatePath("/admin/trainings");

    return { success: true, data: block };
  } catch (error: any) {
    console.error("Error in upsertTrainingInfoBlockAction:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(", ") };
    }
    return { success: false, error: error.message || "An unexpected database error occurred" };
  }
}

export async function deleteTrainingInfoBlockAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await getRequiredAdminSession();
    const existing = await prisma.trainingInfoBlock.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Training info block not found");
    }

    await prisma.trainingInfoBlock.delete({
      where: { id },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      "DELETE",
      "TrainingInfoBlock",
      id,
      existing.heading,
      `Deleted training info block "${existing.heading}"`
    );

    revalidatePath("/training");
    revalidatePath("/admin/trainings");

    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteTrainingInfoBlockAction:", error);
    return { success: false, error: error.message || "Failed to delete info block" };
  }
}

// ============================================================================
// Server Actions - Custom Pages Content Management
// ============================================================================

export async function getAboutPageContentAction(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const content = await prisma.aboutPageContent.findFirst();
    return { success: true, data: content };
  } catch (error: any) {
    console.error("Error in getAboutPageContentAction:", error);
    return { success: false, error: error.message || "Failed to fetch about page content" };
  }
}

export async function upsertAboutPageContentAction(
  data: any
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const admin = await getRequiredAdminSession();
    const validated = AboutPageInputSchema.parse(data);

    const existing = await prisma.aboutPageContent.findFirst();

    const record = await prisma.aboutPageContent.upsert({
      where: { id: existing?.id || "about-content" },
      create: {
        id: "about-content",
        heroTitle: validated.heroTitle,
        heroDescription: validated.heroDescription,
        heroImage: validated.heroImage,
        missionTitle: validated.missionTitle,
        missionText: validated.missionText,
        visionTitle: validated.visionTitle,
        visionText: validated.visionText,
        coreValues: JSON.stringify(validated.coreValues),
        lastUpdatedBy: admin.email,
      },
      update: {
        heroTitle: validated.heroTitle,
        heroDescription: validated.heroDescription,
        heroImage: validated.heroImage,
        missionTitle: validated.missionTitle,
        missionText: validated.missionText,
        visionTitle: validated.visionTitle,
        visionText: validated.visionText,
        coreValues: JSON.stringify(validated.coreValues),
        lastUpdatedBy: admin.email,
      },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      "UPDATE",
      "AboutPageContent",
      record.id,
      "About Us Page",
      `Updated About Us page content`
    );

    revalidatePath("/about");
    return { success: true, data: record };
  } catch (error: any) {
    console.error("Error in upsertAboutPageContentAction:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(", ") };
    }
    return { success: false, error: error.message || "Failed to save about page content" };
  }
}

export async function getContactPageContentAction(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const content = await prisma.contactPageContent.findFirst();
    return { success: true, data: content };
  } catch (error: any) {
    console.error("Error in getContactPageContentAction:", error);
    return { success: false, error: error.message || "Failed to fetch contact page content" };
  }
}

export async function upsertContactPageContentAction(
  data: any
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const admin = await getRequiredAdminSession();
    const validated = ContactPageInputSchema.parse(data);

    const existing = await prisma.contactPageContent.findFirst();

    const record = await prisma.contactPageContent.upsert({
      where: { id: existing?.id || "contact-content" },
      create: {
        id: "contact-content",
        phone: validated.phone,
        email: validated.email,
        addressLine1: validated.addressLine1,
        addressLine2: validated.addressLine2,
        addressLine3: validated.addressLine3,
        facebookUrl: validated.facebookUrl,
        instagramUrl: validated.instagramUrl,
        twitterUrl: validated.twitterUrl,
        linkedinUrl: validated.linkedinUrl,
        mapEmbedUrl: validated.mapEmbedUrl,
        lastUpdatedBy: admin.email,
      },
      update: {
        phone: validated.phone,
        email: validated.email,
        addressLine1: validated.addressLine1,
        addressLine2: validated.addressLine2,
        addressLine3: validated.addressLine3,
        facebookUrl: validated.facebookUrl,
        instagramUrl: validated.instagramUrl,
        twitterUrl: validated.twitterUrl,
        linkedinUrl: validated.linkedinUrl,
        mapEmbedUrl: validated.mapEmbedUrl,
        lastUpdatedBy: admin.email,
      },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      "UPDATE",
      "ContactPageContent",
      record.id,
      "Contact Page",
      `Updated Contact page content`
    );

    revalidatePath("/contact");
    return { success: true, data: record };
  } catch (error: any) {
    console.error("Error in upsertContactPageContentAction:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(", ") };
    }
    return { success: false, error: error.message || "Failed to save contact page content" };
  }
}

export async function getFaqPageContentAction(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const content = await prisma.faqPageContent.findFirst();
    return { success: true, data: content };
  } catch (error: any) {
    console.error("Error in getFaqPageContentAction:", error);
    return { success: false, error: error.message || "Failed to fetch faq page content" };
  }
}

export async function upsertFaqPageContentAction(
  data: any
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const admin = await getRequiredAdminSession();
    const validated = FaqPageInputSchema.parse(data);

    const existing = await prisma.faqPageContent.findFirst();

    const record = await prisma.faqPageContent.upsert({
      where: { id: existing?.id || "faq-content" },
      create: {
        id: "faq-content",
        heroTitle: validated.heroTitle,
        heroDescription: validated.heroDescription,
        heroImage: validated.heroImage,
        items: JSON.stringify(validated.items),
        lastUpdatedBy: admin.email,
      },
      update: {
        heroTitle: validated.heroTitle,
        heroDescription: validated.heroDescription,
        heroImage: validated.heroImage,
        items: JSON.stringify(validated.items),
        lastUpdatedBy: admin.email,
      },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      "UPDATE",
      "FaqPageContent",
      record.id,
      "FAQ Page",
      `Updated FAQ page content`
    );

    revalidatePath("/faqs");
    return { success: true, data: record };
  } catch (error: any) {
    console.error("Error in upsertFaqPageContentAction:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(", ") };
    }
    return { success: false, error: error.message || "Failed to save faq page content" };
  }
}

export async function getPolicyPageContentAction(
  id: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const content = await prisma.policyPageContent.findUnique({
      where: { id },
    });
    return { success: true, data: content };
  } catch (error: any) {
    console.error("Error in getPolicyPageContentAction:", error);
    return { success: false, error: error.message || `Failed to fetch ${id} policy content` };
  }
}

export async function upsertPolicyPageContentAction(
  id: string,
  data: any
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const admin = await getRequiredAdminSession();
    const validated = PolicyPageInputSchema.parse(data);

    const record = await prisma.policyPageContent.upsert({
      where: { id },
      create: {
        id,
        title: validated.title,
        subtitle: validated.subtitle,
        content: validated.content,
        lastUpdatedBy: admin.email,
      },
      update: {
        title: validated.title,
        subtitle: validated.subtitle,
        content: validated.content,
        lastUpdatedBy: admin.email,
      },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      "UPDATE",
      "PolicyPageContent",
      record.id,
      `${id === "privacy-policy" ? "Privacy Policy" : "Terms"} Page`,
      `Updated ${id === "privacy-policy" ? "Privacy Policy" : "Terms & Conditions"} page content`
    );

    revalidatePath(`/${id}`);
    return { success: true, data: record };
  } catch (error: any) {
    console.error("Error in upsertPolicyPageContentAction:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(", ") };
    }
    return { success: false, error: error.message || "Failed to save policy page content" };
  }
}

export async function getAffiliationPageContentAction(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const content = await prisma.affiliationPageContent.findFirst();
    return { success: true, data: content };
  } catch (error: any) {
    console.error("Error in getAffiliationPageContentAction:", error);
    return { success: false, error: error.message || "Failed to fetch affiliation page content" };
  }
}

export async function upsertAffiliationPageContentAction(
  data: any
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const admin = await getRequiredAdminSession();
    const validated = AffiliationPageInputSchema.parse(data);

    const existing = await prisma.affiliationPageContent.findFirst();

    const record = await prisma.affiliationPageContent.upsert({
      where: { id: existing?.id || "affiliation-content" },
      create: {
        id: "affiliation-content",
        heroTitle: validated.heroTitle,
        heroDescription: validated.heroDescription,
        heroImage: validated.heroImage,
        partners: JSON.stringify(validated.partners),
        benefits: JSON.stringify(validated.benefits),
        ctaTitle: validated.ctaTitle,
        ctaDescription: validated.ctaDescription,
        promises: JSON.stringify(validated.promises),
        lastUpdatedBy: admin.email,
      },
      update: {
        heroTitle: validated.heroTitle,
        heroDescription: validated.heroDescription,
        heroImage: validated.heroImage,
        partners: JSON.stringify(validated.partners),
        benefits: JSON.stringify(validated.benefits),
        ctaTitle: validated.ctaTitle,
        ctaDescription: validated.ctaDescription,
        promises: JSON.stringify(validated.promises),
        lastUpdatedBy: admin.email,
      },
    });

    await logActivity(
      admin.id,
      admin.email,
      admin.name,
      "UPDATE",
      "AffiliationPageContent",
      record.id,
      "Affiliation Program Page",
      `Updated Affiliation Program page content`
    );

    revalidatePath("/affiliation");
    return { success: true, data: record };
  } catch (error: any) {
    console.error("Error in upsertAffiliationPageContentAction:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(", ") };
    }
    return { success: false, error: error.message || "Failed to save affiliation page content" };
  }
}



