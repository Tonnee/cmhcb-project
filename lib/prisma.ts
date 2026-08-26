import { PrismaClient } from "@prisma/client";

// Use transaction mode pooler (port 6543) for serverless/Vercel compatibility.
// Session mode (port 5432) hits max connection limits under parallel Next.js build queries.
function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith("file:")) {
    return envUrl;
  }
  // Fallback: Supabase transaction mode pooler (port 6543 + pgbouncer=true)
  return "postgresql://postgres.qeaszomzltstfhikrais:CmhcbProjectDb2026@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1";
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
