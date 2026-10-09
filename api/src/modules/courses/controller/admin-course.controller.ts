import { Request, Response } from "express";
import type { ICourseService } from "../service/course.service.interface";
import { HTTP_STATUS } from "../../../utils/http-status";
import { sendSuccess } from "../../../utils/api-response";
import { adminCourseQuerySchema } from "../dto/course.dto";

export class AdminCourseController {
  constructor(private readonly courseService: ICourseService) {}

  getAllCourses = async (req: Request, res: Response): Promise<void> => {
    const query = adminCourseQuerySchema.parse(req.query);
    const courses = await this.courseService.getAllCourses(query);

    sendSuccess(
      res,
      HTTP_STATUS.OK,
      "Courses retrieved successfully",
      { courses },
    );
  };
}
