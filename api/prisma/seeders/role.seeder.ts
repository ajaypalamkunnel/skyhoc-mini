import { PrismaClient } from "../../src/generated/prisma/client";

export async function seedRoles(prisma: PrismaClient) {
  await prisma.role.createMany({
    data: [
      {
        title: "Student",
        type: "STUDENT",
        status: "ACTIVE",
      },
      {
        title: "Tutor",
        type: "TUTOR",
        status: "ACTIVE",
      },
      {
        title: "Department Head",
        type: "DEPARTMENT_HEAD",
        status: "ACTIVE",
      },
      {
        title: "Super Admin",
        type: "SUPER_ADMIN",
        status: "ACTIVE",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✓ Roles seeded");
}