import { PrismaClient } from "../src/generated/prisma/client";
import { seedRoles } from "./seeders/role.seeder";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await seedRoles(prisma);

  console.log("✓ Database seeding completed");
}

main()
  .catch((error) => {
    console.error("✗ Database seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });