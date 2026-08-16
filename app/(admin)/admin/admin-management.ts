"use server";

import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Initialize Supabase admin client using Service Role Key to manage users
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase URL or Service Role Key in environment variables.");
  }

  return createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

const WHITELISTED_SUPER_ADMIN_EMAILS = ["admin@cmhcb.org", "admin@cmhcb.com", "satonnee@gmail.com"];

// Helper to authenticate the current admin session, auto-provision if needed, and check block status
export async function getRequiredAdminSession() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Please sign in.");
  }

  const email = user.email || "";

  // Check if admin profile exists in Prisma
  let adminProfile = await prisma.adminProfile.findUnique({
    where: { id: user.id },
  });

  // Auto-provision if user exists in Supabase Auth but not in our database
  if (!adminProfile) {
    // We only auto-provision whitelisted super-admin accounts on initial login.
    // Regular admin accounts must be created explicitly via the Super Admin management dashboard.
    const isSuperAdmin = WHITELISTED_SUPER_ADMIN_EMAILS.includes(email.toLowerCase());
    if (!isSuperAdmin) {
      throw new Error("Access Denied: Your administrator account has not been registered. Please contact a super administrator.");
    }

    const role = "super_admin";
    const name = user.user_metadata?.name || user.user_metadata?.full_name || email.split("@")[0];

    adminProfile = await prisma.adminProfile.create({
      data: {
        id: user.id,
        email,
        name,
        role,
        isBlocked: false,
      },
    });
  }

  // Reject blocked admins immediately
  if (adminProfile.isBlocked) {
    throw new Error("Access Denied: Your administrator account has been blocked.");
  }

  return adminProfile;
}

// Log an admin activity to the database
export async function logActivity(
  adminId: string,
  adminEmail: string,
  adminName: string,
  action: "CREATE" | "UPDATE" | "DELETE" | "BLOCK" | "UNBLOCK" | "UPDATE_CREDENTIALS" | "CREATE_ADMIN",
  targetType: "BlogPost" | "Service" | "Therapist" | "Workshop" | "LandingPageContent" | "AdminProfile" | "ServiceInfoBlock" | "Training" | "TrainingInfoBlock" | "AboutPageContent" | "ContactPageContent" | "FaqPageContent" | "PolicyPageContent" | "AffiliationPageContent" | "Testimonial" | "SupportPageContent" | "CommunityServicePageContent" | "GalleryItem" | "Appointment" | "TrainingRequest" | "WorkshopRegistration",
  targetId: string,
  targetName: string,
  details?: string
) {
  try {
    await prisma.activityLog.create({
      data: {
        adminId,
        adminEmail,
        adminName,
        action,
        targetType,
        targetId,
        targetName,
        details,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

// List all admin profiles (Visible to all admins, auto-cleans orphaned auth records)
export async function getAdminProfilesAction() {
  try {
    await getRequiredAdminSession(); // Ensure requester is authenticated
    let admins = await prisma.adminProfile.findMany({
      orderBy: { email: "asc" },
    });

    // Auto-clean orphaned profiles if deleted directly from Supabase Auth dashboard
    try {
      const supabaseAdmin = getSupabaseAdmin();
      const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
      if (listData?.users) {
        const supabaseUserIds = new Set(listData.users.map((u) => u.id));
        const orphanIds = admins.filter((a) => !supabaseUserIds.has(a.id)).map((a) => a.id);

        if (orphanIds.length > 0) {
          await prisma.adminProfile.deleteMany({
            where: { id: { in: orphanIds } },
          });
          admins = admins.filter((a) => supabaseUserIds.has(a.id));
        }
      }
    } catch (syncError) {
      console.warn("Could not sync orphaned admin profiles with Supabase Auth:", syncError);
    }

    return { success: true, data: admins };
  } catch (error: any) {
    console.error("Error listing admin profiles:", error);
    return { success: false, error: error.message || "Failed to load admins list." };
  }
}

// Delete an admin account (Super Admin only)
export async function deleteAdminAccountAction(adminId: string) {
  try {
    const currentAdmin = await getRequiredAdminSession();
    if (currentAdmin.role !== "super_admin") {
      throw new Error("Permission Denied: Only Super Administrators can delete admin accounts.");
    }

    if (adminId === currentAdmin.id) {
      throw new Error("Permission Denied: You cannot delete your own account.");
    }

    const adminToDelete = await prisma.adminProfile.findUnique({
      where: { id: adminId },
    });

    if (!adminToDelete) {
      // If profile is already missing, return success so UI removes it
      return { success: true, data: { id: adminId } };
    }

    // 1. Delete user from Supabase Auth
    try {
      const supabaseAdmin = getSupabaseAdmin();
      await supabaseAdmin.auth.admin.deleteUser(adminId);
    } catch (authError: any) {
      console.warn(`Auth user ${adminId} deletion warning:`, authError.message);
    }

    // 2. Delete profile from Prisma database
    await prisma.adminProfile.delete({
      where: { id: adminId },
    });

    // 3. Log action
    await logActivity(
      currentAdmin.id,
      currentAdmin.email,
      currentAdmin.name,
      "DELETE",
      "AdminProfile",
      adminId,
      adminToDelete.email,
      `Deleted administrator account for ${adminToDelete.name} (${adminToDelete.email})`
    );

    revalidatePath("/admin/admins");
    return { success: true, data: { id: adminId } };
  } catch (error: any) {
    console.error(`Error deleting admin account ${adminId}:`, error);
    return { success: false, error: error.message || "Failed to delete administrator account." };
  }
}

// Fetch activity logs for a specific admin (Visible to all admins)
export async function getAdminActivityLogsAction(adminId: string) {
  try {
    await getRequiredAdminSession(); // Ensure requester is authenticated
    const logs = await prisma.activityLog.findMany({
      where: { adminId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: logs };
  } catch (error: any) {
    console.error(`Error fetching activity logs for admin ${adminId}:`, error);
    return { success: false, error: error.message || "Failed to load activity logs." };
  }
}

// Create a new admin account (Super Admin only)
export async function createAdminAccountAction(
  name: string,
  email: string,
  password: string,
  role: "admin" | "super_admin"
) {
  try {
    const currentAdmin = await getRequiredAdminSession();
    if (currentAdmin.role !== "super_admin") {
      throw new Error("Permission Denied: Only Super Administrators can create admin accounts.");
    }

    const supabaseAdmin = getSupabaseAdmin();
    const cleanEmail = email.toLowerCase().trim();

    // Check if admin profile already exists in Prisma DB
    const existingProfile = await prisma.adminProfile.findFirst({
      where: { email: cleanEmail },
    });

    if (existingProfile) {
      throw new Error("An administrator profile for this email address already exists in the directory.");
    }

    let userId: string;

    // 1. Try creating user in Supabase auth system
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password,
      email_confirm: true,
      app_metadata: { role: "admin" },
      user_metadata: { name },
    });

    if (authError) {
      // If user already exists in Supabase Auth, fetch their ID and update credentials
      if (
        authError.message.toLowerCase().includes("already been registered") ||
        authError.message.toLowerCase().includes("already exists")
      ) {
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
        const existingAuthUser = listData?.users?.find(
          (u) => u.email?.toLowerCase() === cleanEmail
        );

        if (!existingAuthUser) {
          throw new Error(authError.message);
        }

        userId = existingAuthUser.id;

        // Update password & metadata in Supabase Auth
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          password,
          app_metadata: { role: "admin" },
          user_metadata: { name },
        });

        if (updateError) {
          throw new Error(`Failed to update Auth credentials: ${updateError.message}`);
        }
      } else {
        throw new Error(authError.message);
      }
    } else {
      if (!authData?.user) {
        throw new Error("Failed to create user in Auth system.");
      }
      userId = authData.user.id;
    }

    // 2. Create profile in database
    const profile = await prisma.adminProfile.create({
      data: {
        id: userId,
        email: cleanEmail,
        name,
        role,
        isBlocked: false,
      },
    });

    // 3. Log action
    await logActivity(
      currentAdmin.id,
      currentAdmin.email,
      currentAdmin.name,
      "CREATE_ADMIN",
      "AdminProfile",
      profile.id,
      profile.email,
      `Created ${role} account for ${name} (${cleanEmail})`
    );

    revalidatePath("/admin/admins");
    return { success: true, data: profile };
  } catch (error: any) {
    console.error("Error creating admin account:", error);
    return { success: false, error: error.message || "An error occurred during account creation." };
  }
}

// Update admin credentials (Super Admin only)
export async function updateAdminCredentialsAction(
  adminId: string,
  name: string,
  role: "admin" | "super_admin",
  password?: string
) {
  try {
    const currentAdmin = await getRequiredAdminSession();
    if (currentAdmin.role !== "super_admin") {
      throw new Error("Permission Denied: Only Super Administrators can modify credentials.");
    }

    // Safety: prevent self-demotion
    if (adminId === currentAdmin.id && role !== "super_admin") {
      throw new Error("Permission Denied: You cannot demote yourself from Super Administrator.");
    }

    // 1. Update password in Supabase Auth if provided
    if (password && password.trim().length > 0) {
      const supabaseAdmin = getSupabaseAdmin();
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(adminId, {
        password: password,
      });
      if (authError) {
        throw new Error(`Auth Error: ${authError.message}`);
      }
    }

    // 2. Update name & role in database
    const updatedProfile = await prisma.adminProfile.update({
      where: { id: adminId },
      data: {
        name,
        role,
      },
    });

    // 3. Log action
    const changeDescription = password 
      ? `Updated name to "${name}", role to "${role}", and reset password.`
      : `Updated name to "${name}" and role to "${role}".`;

    await logActivity(
      currentAdmin.id,
      currentAdmin.email,
      currentAdmin.name,
      "UPDATE_CREDENTIALS",
      "AdminProfile",
      adminId,
      updatedProfile.email,
      changeDescription
    );

    revalidatePath("/admin/admins");
    revalidatePath(`/admin/admins/${adminId}`);
    return { success: true, data: updatedProfile };
  } catch (error: any) {
    console.error(`Error updating credentials for admin ${adminId}:`, error);
    return { success: false, error: error.message || "Failed to update admin credentials." };
  }
}

// Block / Unblock admin (Super Admin only)
export async function toggleBlockAdminAction(adminId: string, isBlocked: boolean) {
  try {
    const currentAdmin = await getRequiredAdminSession();
    if (currentAdmin.role !== "super_admin") {
      throw new Error("Permission Denied: Only Super Administrators can block or unblock users.");
    }

    // Safety: prevent self-blocking
    if (adminId === currentAdmin.id) {
      throw new Error("Permission Denied: You cannot block yourself.");
    }

    // 1. Update blocked state in DB
    const updatedProfile = await prisma.adminProfile.update({
      where: { id: adminId },
      data: { isBlocked },
    });

    // 2. Log action
    await logActivity(
      currentAdmin.id,
      currentAdmin.email,
      currentAdmin.name,
      isBlocked ? "BLOCK" : "UNBLOCK",
      "AdminProfile",
      adminId,
      updatedProfile.email,
      isBlocked ? `Blocked administrator access.` : `Unblocked administrator access.`
    );

    revalidatePath("/admin/admins");
    revalidatePath(`/admin/admins/${adminId}`);
    return { success: true, data: updatedProfile };
  } catch (error: any) {
    console.error(`Error toggling block state for admin ${adminId}:`, error);
    return { success: false, error: error.message || "Failed to update block status." };
  }
}
