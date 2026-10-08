import { prisma } from "../../../config/database";
import type { Course } from "../../../generated/prisma/client";
import type { ICourseRepository } from "./course.repository.interface";

export class CourseRepository implements ICourseRepository {
  async findCoursesByUserId(userId: number): Promise<Course[]> {
    return prisma.course.findMany({
      where: {
        isActive: true,
        enrollments: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async findCourseByIdForUser(
    courseId: number,
    userId: number,
  ): Promise<Course | null> {
    return prisma.course.findFirst({
      where: {
        id: courseId,
        isActive: true,
        enrollments: {
          some: {
            userId,
          },
        },
      },
    });
  }
}
