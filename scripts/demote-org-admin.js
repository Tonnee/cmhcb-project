const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function demoteAdmin() {
  const res = await prisma.adminProfile.updateMany({
    where: { email: "admin@cmhcb.org" },
    data: { role: "admin" },
  });
  console.log("Updated admin@cmhcb.org role to 'admin' in database. Records updated: " + res.count);
}

demoteAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
