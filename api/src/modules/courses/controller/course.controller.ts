import { Request, Response } from "express";
import type { ICourseService } from "../service/course.service.interface";
import { HTTP_STATUS } from "../../../utils/http-status";
import { ERROR_CODES } from "../../../utils/error-codes";
import { AppError } from "../../../utils/app-error";
import { sendSuccess } from "../../../utils/api-response";
import { courseIdParamSchema } from "../dto/course.dto";

export class CourseController {
  constructor(private readonly courseService: ICourseService) {}

  getMyCourses = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth?.userId) {
      throw new AppError(
        "Authentication required",
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.UNAUTHORIZED,
      );
    }

    const courses = await this.courseService.getCoursesByUserId(req.auth.userId);

    sendSuccess(
      res,
      HTTP_STATUS.OK,
      "Courses retrieved successfully",
      courses,
    );
  };

  getCourseById = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth?.userId) {
      throw new AppError(
        "Authentication required",
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.UNAUTHORIZED,
      );
    }

    const { courseId } = courseIdParamSchema.parse(req.params);

    const course = await this.courseService.getCourseByIdForUser(
      courseId,
      req.auth.userId,
    );

    sendSuccess(
      res,
      HTTP_STATUS.OK,
      "Course retrieved successfully",
      course,
    );
  };
}
