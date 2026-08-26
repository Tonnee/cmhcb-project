import { PrismaClient } from "@prisma/client";

// Ensure we always use Supabase transaction mode pooler (port 6543 + pgbouncer=true).
// Session mode (port 5432) hits the 15-connection limit under parallel Next.js serverless requests.
function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;

  // If missing or is a SQLite path → use hardcoded Supabase transaction pooler
  if (!envUrl || envUrl.startsWith("file:")) {
    return "postgresql://postgres.qeaszomzltstfhikrais:CmhcbProjectDb2026@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1";
  }

  // If it's already a PostgreSQL URL but using session mode port 5432 → force transaction mode port 6543
  if (envUrl.includes(":5432/") && !envUrl.includes("pgbouncer=true")) {
    const fixed = envUrl
      .replace(":5432/", ":6543/")
      .replace(/\?.*$/, "") + "?pgbouncer=true&connection_limit=1";
    return fixed;
  }

  return envUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
