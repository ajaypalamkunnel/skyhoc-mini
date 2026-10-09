import { AppError } from "../../../utils/app-error";
import { ERROR_CODES } from "../../../utils/error-codes";
import { HTTP_STATUS } from "../../../utils/http-status";
import type { AdminCourseQueryInput } from "../dto/course.dto";
import type { CourseResponseDTO } from "../dto/course.response.dto";
import type { ICourseRepository } from "../repository/course.repository.interface";
import type { ICourseService } from "./course.service.interface";

export class CourseService implements ICourseService {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async getCoursesByUserId(userId: number): Promise<CourseResponseDTO[]> {
    const courses = await this.courseRepository.findCoursesByUserId(userId);

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      isActive: course.isActive,
    }));
  }

  async getCourseByIdForUser(
    courseId: number,
    userId: number,
  ): Promise<CourseResponseDTO> {
    const course = await this.courseRepository.findCourseByIdForUser(
      courseId,
      userId,
    );

    if (!course) {
      throw new AppError(
        "Course not found",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.COURSE_NOT_FOUND,
      );
    }

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      isActive: course.isActive,
    };
  }

  async getAllCourses(query?: AdminCourseQueryInput): Promise<CourseResponseDTO[]> {
    const courses = await this.courseRepository.findAllCourses(query);

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      isActive: course.isActive,
    }));
  }
}
