import type { PrismaClient } from "../../src/generated/prisma/client";

export async function seedEnrollments(
  prisma: PrismaClient,
): Promise<void> {
  const students = await prisma.user.findMany({
    where: {
      email: {
        in: [
          "student1@skyhoc.com",
          "student2@skyhoc.com",
        ],
      },
      isActive: true,
      role: {
        type: "STUDENT",
        status: "ACTIVE",
      },
    },
    select: {
      id: true,
      email: true,
    },
  });

  const courses = await prisma.course.findMany({
    where: {
      title: {
        in: [
          "German A1 – Beginner",
          "German A2 – Elementary",
          "German B1 – Intermediate",
        ],
      },
      isActive: true,
    },
    select: {
      id: true,
      title: true,
    },
  });

  const studentMap = new Map(
    students.map((student) => [student.email, student.id]),
  );

  const courseMap = new Map(
    courses.map((course) => [course.title, course.id]),
  );

  const requiredStudents = [
    "student1@skyhoc.com",
    "student2@skyhoc.com",
  ];

  const requiredCourses = [
    "German A1 – Beginner",
    "German A2 – Elementary",
    "German B1 – Intermediate",
  ];

  for (const email of requiredStudents) {
    if (!studentMap.has(email)) {
      throw new Error(
        `Active student ${email} is not configured. Run user seeder first.`,
      );
    }
  }

  for (const title of requiredCourses) {
    if (!courseMap.has(title)) {
      throw new Error(
        `Active course "${title}" is not configured. Run course seeder first.`,
      );
    }
  }

  await prisma.enrollment.createMany({
    data: [
      {
        userId: studentMap.get("student1@skyhoc.com")!,
        courseId: courseMap.get("German A1 – Beginner")!,
      },
      {
        userId: studentMap.get("student1@skyhoc.com")!,
        courseId: courseMap.get("German A2 – Elementary")!,
      },
      {
        userId: studentMap.get("student2@skyhoc.com")!,
        courseId: courseMap.get("German A2 – Elementary")!,
      },
      {
        userId: studentMap.get("student2@skyhoc.com")!,
        courseId: courseMap.get("German B1 – Intermediate")!,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✓ Enrollments seeded");
}