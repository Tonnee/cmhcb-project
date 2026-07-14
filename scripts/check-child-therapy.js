const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const service = await prisma.service.findFirst({
    where: {
      slug: {
        contains: "child-therapy",
        mode: "insensitive"
      }
    }
  });
  console.log("Database Child Therapy Service details:", JSON.stringify(service, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
