const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkAdmins() {
  const admins = await prisma.adminProfile.findMany();
  console.log("Current AdminProfile records in Prisma DB (" + admins.length + "):");
  console.log(JSON.stringify(admins, null, 2));
}

checkAdmins()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
