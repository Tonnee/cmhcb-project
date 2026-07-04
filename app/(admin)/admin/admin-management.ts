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
    // Check if email should default to super admin
    const isSuperAdmin = email === "admin@cmhcb.org" || email === "satonnee@gmail.com";
    const role = isSuperAdmin ? "super_admin" : "admin";
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
  targetType: "BlogPost" | "Service" | "Therapist" | "Workshop" | "LandingPageContent" | "AdminProfile" | "ServiceInfoBlock" | "Training" | "TrainingInfoBlock",
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

// List all admin profiles (Visible to all admins)
export async function getAdminProfilesAction() {
  try {
    await getRequiredAdminSession(); // Ensure requester is authenticated
    const admins = await prisma.adminProfile.findMany({
      orderBy: { email: "asc" },
    });
    return { success: true, data: admins };
  } catch (error: any) {
    console.error("Error listing admin profiles:", error);
    return { success: false, error: error.message || "Failed to load admins list." };
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

    // 1. Create user in Supabase auth system
    // Set metadata role to 'admin' so they pass middleware checks
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role: "admin" },
      user_metadata: { name },
    });

    if (authError) {
      throw new Error(authError.message);
    }

    const user = authData?.user;
    if (!user) {
      throw new Error("Failed to create user in Auth system.");
    }

    // 2. Create profile in database
    const profile = await prisma.adminProfile.create({
      data: {
        id: user.id,
        email: email.toLowerCase(),
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
      `Created ${role} account for ${name} (${email})`
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
