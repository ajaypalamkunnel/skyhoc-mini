import { prisma } from "../../../config/database";
import type { LiveClass } from "../../../generated/prisma/client";
import { LiveClassStatus } from "../../../generated/prisma/enums";
import type { LiveClassQueryStatus } from "../dto/live-class.dto";
import type {
  ILiveClassRepository,
  LiveClassWithCourse,
} from "./live-class.repository.interface";

export class LiveClassRepository implements ILiveClassRepository {
  async findLiveClassesByCourseForUser(
    courseId: number,
    userId: number,
    status: LiveClassQueryStatus,
  ): Promise<LiveClass[] | null> {
    const courseAccess = await prisma.course.findFirst({
      where: {
        id: courseId,
        isActive: true,
        enrollments: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!courseAccess) {
      return null;
    }

    const now = new Date();

    const whereClause = {
      courseId,
      ...(status === "upcoming"
        ? {
            status: LiveClassStatus.SCHEDULED,
            startsAt: {
              gte: now,
            },
          }
        : {
            status: LiveClassStatus.COMPLETED,
          }),
    };

    return prisma.liveClass.findMany({
      where: whereClause,
      orderBy: {
        startsAt: status === "upcoming" ? "asc" : "desc",
      },
    });
  }

  async findLiveClassesByUserId(
    userId: number,
    status: LiveClassQueryStatus,
  ): Promise<LiveClassWithCourse[]> {
    const now = new Date();

    const whereClause = {
      course: {
        isActive: true,
        enrollments: {
          some: {
            userId,
          },
        },
      },
      ...(status === "upcoming"
        ? {
            status: LiveClassStatus.SCHEDULED,
            startsAt: {
              gte: now,
            },
          }
        : {
            status: LiveClassStatus.COMPLETED,
          }),
    };

    return prisma.liveClass.findMany({
      where: whereClause,
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        startsAt: status === "upcoming" ? "asc" : "desc",
      },
    });
  }
}
