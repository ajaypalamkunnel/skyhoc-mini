import type { PrismaClient } from "../../src/generated/prisma/client";

export async function seedLiveClasses(
  prisma: PrismaClient,
): Promise<void> {
  const tutors = await prisma.user.findMany({
    where: {
      email: {
        in: [
          "tutor1@skyhoc.com",
          "tutor2@skyhoc.com",
        ],
      },
      isActive: true,
      role: {
        type: "TUTOR",
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

  const tutorMap = new Map(
    tutors.map((tutor) => [tutor.email, tutor.id]),
  );

  const courseMap = new Map(
    courses.map((course) => [course.title, course.id]),
  );

  const requiredTutors = [
    "tutor1@skyhoc.com",
    "tutor2@skyhoc.com",
  ];

  const requiredCourses = [
    "German A1 – Beginner",
    "German A2 – Elementary",
    "German B1 – Intermediate",
  ];

  for (const email of requiredTutors) {
    if (!tutorMap.has(email)) {
      throw new Error(
        `Active tutor ${email} is not configured. Run user seeder first.`,
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

  const liveClasses = [
    {
      courseTitle: "German A1 – Beginner",
      tutorEmail: "tutor1@skyhoc.com",
      title: "German A1 – Introduction & Basic Greetings",
      startsAt: new Date("2026-10-12T10:00:00+05:30"),
      durationMinutes: 60,
    },
    {
      courseTitle: "German A2 – Elementary",
      tutorEmail: "tutor2@skyhoc.com",
      title: "German A2 – Everyday Conversations",
      startsAt: new Date("2026-10-13T14:00:00+05:30"),
      durationMinutes: 60,
    },
    {
      courseTitle: "German B1 – Intermediate",
      tutorEmail: "tutor1@skyhoc.com",
      title: "German B1 – Advanced Grammar",
      startsAt: new Date("2026-10-14T10:00:00+05:30"),
      durationMinutes: 60,
    },
    {
      courseTitle: "German A1 – Beginner",
      tutorEmail: "tutor2@skyhoc.com",
      title: "German A1 – Numbers, Dates & Time",
      startsAt: new Date("2026-10-15T14:00:00+05:30"),
      durationMinutes: 60,
    },
    {
      courseTitle: "German A2 – Elementary",
      tutorEmail: "tutor1@skyhoc.com",
      title: "German A2 – Reading & Listening Practice",
      startsAt: new Date("2026-10-16T10:00:00+05:30"),
      durationMinutes: 60,
    },
    {
      courseTitle: "German B1 – Intermediate",
      tutorEmail: "tutor2@skyhoc.com",
      title: "German B1 – Practical Conversation",
      startsAt: new Date("2026-10-17T14:00:00+05:30"),
      durationMinutes: 60,
    },
  ];

  await prisma.liveClass.createMany({
    data: liveClasses.map((liveClass) => ({
      courseId: courseMap.get(liveClass.courseTitle)!,
      tutorId: tutorMap.get(liveClass.tutorEmail)!,
      title: liveClass.title,
      startsAt: liveClass.startsAt,
      durationMinutes: liveClass.durationMinutes,
      status: "SCHEDULED",
    })),
    skipDuplicates: true,
  });

  console.log("✓ Live classes seeded");
}