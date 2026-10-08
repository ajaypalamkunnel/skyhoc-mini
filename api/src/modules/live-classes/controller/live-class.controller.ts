import { Request, Response } from "express";
import type { ILiveClassService } from "../service/live-class.service.interface";
import { HTTP_STATUS } from "../../../utils/http-status";
import { ERROR_CODES } from "../../../utils/error-codes";
import { AppError } from "../../../utils/app-error";
import { sendSuccess } from "../../../utils/api-response";
import {
  courseLiveClassesParamsSchema,
  courseLiveClassesQuerySchema,
  myLiveClassesQuerySchema,
} from "../dto/live-class.dto";

export class LiveClassController {
  constructor(private readonly liveClassService: ILiveClassService) {}

  getCourseLiveClasses = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    if (!req.auth?.userId) {
      throw new AppError(
        "Authentication required",
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.UNAUTHORIZED,
      );
    }

    const { courseId } = courseLiveClassesParamsSchema.parse(req.params);
    const { status } = courseLiveClassesQuerySchema.parse(req.query);

    const liveClasses = await this.liveClassService.getCourseLiveClasses(
      courseId,
      req.auth.userId,
      status,
    );

    sendSuccess(
      res,
      HTTP_STATUS.OK,
      "Live classes retrieved successfully",
      liveClasses,
    );
  };

  getMyLiveClasses = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    if (!req.auth?.userId) {
      throw new AppError(
        "Authentication required",
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.UNAUTHORIZED,
      );
    }

    const { status } = myLiveClassesQuerySchema.parse(req.query);

    const liveClasses = await this.liveClassService.getMyLiveClasses(
      req.auth.userId,
      status,
    );

    sendSuccess(
      res,
      HTTP_STATUS.OK,
      "Live classes retrieved successfully",
      liveClasses,
    );
  };
}
