import type { PrismaClient } from "../../src/generated/prisma/client";

export async function seedCourses(prisma: PrismaClient): Promise<void> {
  await prisma.course.createMany({
    data: [
      {
        title: "German A1 – Beginner",
        description:
          "Introduction to German language, vocabulary, grammar, and everyday communication.",
        isActive: true,
      },
      {
        title: "German A2 – Elementary",
        description:
          "Elementary German grammar, conversation, reading, and listening skills.",
        isActive: true,
      },
      {
        title: "German B1 – Intermediate",
        description:
          "Intermediate German communication, grammar, vocabulary, and practical conversation.",
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✓ Courses seeded");
}