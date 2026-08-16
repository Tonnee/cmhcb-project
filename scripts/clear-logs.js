const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function clearLogs() {
  const res = await prisma.activityLog.deleteMany();
  console.log("Successfully cleared activity log records: " + res.count + " records deleted.");
}

clearLogs()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
