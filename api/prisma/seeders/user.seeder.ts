import argon2 from "argon2";
import type { PrismaClient } from "../../src/generated/prisma/client";

const DEFAULT_PASSWORD = "Skyhoc@123";

export async function seedUsers(prisma: PrismaClient): Promise<void> {
  const passwordHash = await argon2.hash(DEFAULT_PASSWORD);

  const roles = await prisma.role.findMany({
    select: {
      id: true,
      type: true,
    },
  });

  const roleMap = new Map(
    roles.map((role) => [role.type, role.id]),
  );

  const requiredRoles = [
    "STUDENT",
    "TUTOR",
    "DEPARTMENT_HEAD",
    "SUPER_ADMIN",
  ] as const;

  for (const roleType of requiredRoles) {
    if (!roleMap.has(roleType)) {
      throw new Error(
        `Required role ${roleType} is not configured. Run role seeder first.`,
      );
    }
  }

  await prisma.user.createMany({
    data: [
      {
        name: "Student One",
        email: "student1@skyhoc.com",
        passwordHash,
        roleId: roleMap.get("STUDENT")!,
        isActive: true,
      },
      {
        name: "Student Two",
        email: "student2@skyhoc.com",
        passwordHash,
        roleId: roleMap.get("STUDENT")!,
        isActive: true,
      },
      {
        name: "Tutor One",
        email: "tutor1@skyhoc.com",
        passwordHash,
        roleId: roleMap.get("TUTOR")!,
        isActive: true,
      },
      {
        name: "Tutor Two",
        email: "tutor2@skyhoc.com",
        passwordHash,
        roleId: roleMap.get("TUTOR")!,
        isActive: true,
      },
      {
        name: "Department Head",
        email: "department.head@skyhoc.com",
        passwordHash,
        roleId: roleMap.get("DEPARTMENT_HEAD")!,
        isActive: true,
      },
      {
        name: "Super Admin",
        email: "admin@skyhoc.com",
        passwordHash,
        roleId: roleMap.get("SUPER_ADMIN")!,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✓ Users seeded");
}