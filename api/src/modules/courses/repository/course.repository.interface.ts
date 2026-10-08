import type { Course } from "../../../generated/prisma/client";

export interface ICourseRepository {
  findCoursesByUserId(userId: number): Promise<Course[]>;

  findCourseByIdForUser(
    courseId: number,
    userId: number,
  ): Promise<Course | null>;
}
