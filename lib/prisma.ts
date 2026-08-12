import { PrismaClient } from "@prisma/client";
import path from "path";

function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && envUrl.startsWith("file:")) {
    const cleanPath = envUrl.replace(/^file:/, "").replace(/^\.\//, "");
    if (cleanPath.startsWith("/") || cleanPath.match(/^[a-zA-Z]:/)) {
      return envUrl;
    }
    const relativeTarget = cleanPath.includes("prisma") ? cleanPath : `prisma/${cleanPath}`;
    return `file:${path.join(/*turbopackIgnore: true*/ process.cwd(), relativeTarget)}`;
  }
  return `file:${path.join(/*turbopackIgnore: true*/ process.cwd(), "prisma", "dev.db")}`;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const dbUrl = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
