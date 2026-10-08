import type { CourseResponseDTO } from "../dto/course.response.dto";

export interface ICourseService {
  getCoursesByUserId(userId: number): Promise<CourseResponseDTO[]>;

  getCourseByIdForUser(
    courseId: number,
    userId: number,
  ): Promise<CourseResponseDTO>;
}
