import type { Course } from "../../../generated/prisma/client";
import type { AdminCourseQueryInput } from "../dto/course.dto";

export interface ICourseRepository {
  findCoursesByUserId(userId: number): Promise<Course[]>;

  findCourseByIdForUser(
    courseId: number,
    userId: number,
  ): Promise<Course | null>;

  findAllCourses(options?: AdminCourseQueryInput): Promise<Course[]>;
}
