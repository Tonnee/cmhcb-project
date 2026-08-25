/**
 * admin-auth.ts
 *
 * A plain (no "use server") server-side helper for authenticating admin sessions
 * inside Route Handlers (app/api/.../route.ts).
 *
 * Do NOT add "use server" here — Route Handlers must import plain modules, not
 * Server Action modules. The "use server" version lives in admin-management.ts
 * and is used by Server Actions / Server Components only.
 */

import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

const WHITELISTED_SUPER_ADMIN_EMAILS = ["admin@cmhcb.com", "satonnee@gmail.com"];

/**
 * Authenticates the current admin session inside a Route Handler.
 * Throws an Error if the user is not authenticated or is blocked.
 */
export async function requireAdminSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Please sign in.");
  }

  const email = user.email || "";
  const cleanEmail = email.toLowerCase().trim();
  const isWhitelistedSuperAdmin = WHITELISTED_SUPER_ADMIN_EMAILS.includes(cleanEmail);

  // 1. Check if admin profile exists by Supabase User ID
  let adminProfile = await prisma.adminProfile.findUnique({
    where: { id: user.id },
  });

  // Fallback lookup by email if ID mismatch exists
  if (!adminProfile && cleanEmail) {
    adminProfile = await prisma.adminProfile.findFirst({
      where: { email: cleanEmail },
    });

    if (adminProfile) {
      adminProfile = await prisma.adminProfile.update({
        where: { id: adminProfile.id },
        data: { id: user.id },
      });
    }
  }

  // 2. Auto-provision if user exists in Supabase Auth but not in our database
  if (!adminProfile) {
    const role = isWhitelistedSuperAdmin
      ? "super_admin"
      : user.app_metadata?.role || "admin";
    const name =
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      cleanEmail.split("@")[0];

    adminProfile = await prisma.adminProfile.create({
      data: {
        id: user.id,
        email: cleanEmail,
        name,
        role,
        isBlocked: false,
      },
    });
  } else if (isWhitelistedSuperAdmin && adminProfile.role !== "super_admin") {
    adminProfile = await prisma.adminProfile.update({
      where: { id: adminProfile.id },
      data: { role: "super_admin" },
    });
  }

  // 3. Reject blocked admins
  if (adminProfile.isBlocked) {
    throw new Error("Access Denied: Your administrator account has been blocked.");
  }

  return adminProfile;
}
