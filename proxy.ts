import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { user, response } = await updateSession(request);

  const isUrlAdmin = request.nextUrl.pathname.startsWith("/admin");

  if (isUrlAdmin) {
    if (!user || user.app_metadata?.role !== "admin") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin"
  ],
};
