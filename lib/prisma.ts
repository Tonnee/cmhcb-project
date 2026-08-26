import { PrismaClient } from "@prisma/client";

// Fallback to Supabase PostgreSQL if DATABASE_URL is missing or is a SQLite path
function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith("file:")) {
    return envUrl;
  }
  // Fallback: use Supabase PostgreSQL directly if env var is missing/invalid
  return "postgresql://postgres.qeaszomzltstfhikrais:CmhcbProjectDb2026@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";
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
