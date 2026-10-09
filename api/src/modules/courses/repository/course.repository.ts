import { prisma } from "../../../config/database";
import type { Course } from "../../../generated/prisma/client";
import type { CourseWhereInput } from "../../../generated/prisma/models";
import type { AdminCourseQueryInput } from "../dto/course.dto";
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

  async findAllCourses(options?: AdminCourseQueryInput): Promise<Course[]> {
    const where: CourseWhereInput = {};

    if (options?.status === "active") {
      where.isActive = true;
    } else if (options?.status === "inactive") {
      where.isActive = false;
    }

    if (options?.search && options.search.trim() !== "") {
      const searchKeyword = options.search.trim();
      where.OR = [
        {
          title: {
            contains: searchKeyword,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchKeyword,
            mode: "insensitive",
          },
        },
      ];
    }

    const sortBy = options?.sortBy || "id";
    const sortOrder = options?.sortOrder || "asc";

    return prisma.course.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }
}
