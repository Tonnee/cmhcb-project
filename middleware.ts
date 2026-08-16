import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const isUrlAdmin = request.nextUrl.pathname.startsWith("/admin");

  if (!isUrlAdmin) {
    return NextResponse.next();
  }

  const { user, response } = await updateSession(request);

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export async function proxy(request: NextRequest) {
  return middleware(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin"
  ],
};
