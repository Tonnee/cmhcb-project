import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;

  // Handle Vercel Serverless Linux filesystem read-only restrictions
  if (process.env.VERCEL) {
    if (!envUrl || envUrl.startsWith("file:")) {
      try {
        const targetTmpPath = path.join("/tmp", "dev.db");
        if (!fs.existsSync(targetTmpPath)) {
          const sourceDbPath = path.join(process.cwd(), "prisma", "dev.db");
          if (fs.existsSync(sourceDbPath)) {
            fs.copyFileSync(sourceDbPath, targetTmpPath);
          }
        }
        if (fs.existsSync(targetTmpPath)) {
          return `file:${targetTmpPath}`;
        }
      } catch (err) {
        console.error("Failed to prepare /tmp SQLite database on Vercel:", err);
      }
    }
  }

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
