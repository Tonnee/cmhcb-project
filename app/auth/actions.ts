"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getRequiredAdminSession } from "@/app/(admin)/admin/admin-management";

export async function signInAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    const user = data?.user;
    if (!user) {
      return { error: "Invalid email or password." };
    }

    // Verify admin access (auto-provisions whitelisted super admins, checks DB profile & block status)
    await getRequiredAdminSession();
  } catch (err: any) {
    // Clear session if unauthorized or blocked
    await supabase.auth.signOut();
    return { error: err.message || "An unexpected error occurred during sign in." };
  }

  redirect("/admin");
}

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required." };
  }

  try {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.APP_URL || "http://localhost:3000"}/admin/reset-password`,
    });

    if (error) {
      return { error: error.message };
    }

    return { 
      success: true, 
      message: "A password recovery link has been sent if this email is registered in our system." 
    };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred." };
  }
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
