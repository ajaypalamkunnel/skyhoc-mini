import type { LiveClass, Course } from "../../../generated/prisma/client";
import type { LiveClassQueryStatus } from "../dto/live-class.dto";

export type LiveClassWithCourse = LiveClass & {
  course: Pick<Course, "id" | "title">;
};

export interface ILiveClassRepository {
  findLiveClassesByCourseForUser(
    courseId: number,
    userId: number,
    status: LiveClassQueryStatus,
  ): Promise<LiveClass[] | null>;

  findLiveClassesByUserId(
    userId: number,
    status: LiveClassQueryStatus,
  ): Promise<LiveClassWithCourse[]>;
}
