import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Ensure this route is never statically cached
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const startTime = Date.now();

    // Executes a lightweight query to verify connectivity and prevent Supabase inactivity pausing
    await prisma.$queryRaw`SELECT 1`;

    const responseTimeMs = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "ok",
        database: "connected",
        responseTimeMs,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[Health Check] Database ping failed:", error);

    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown database error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}
