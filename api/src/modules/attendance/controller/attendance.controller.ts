import { Request, Response } from "express";
import { AppError } from "../../../utils/app-error";
import { ERROR_CODES } from "../../../utils/error-codes";
import { HTTP_STATUS } from "../../../utils/http-status";
import { sendSuccess } from "../../../utils/api-response";
import {
  createAttendanceEventSchema,
  liveClassIdParamSchema,
} from "../dto/attendance.dto";
import type { IAttendanceService } from "../services/attendance.service.interface";

export class AttendanceController {
  constructor(private readonly attendanceService: IAttendanceService) {}

  getAttendanceByLiveClassId = async (
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

    const { liveClassId } = liveClassIdParamSchema.parse(req.params);

    const attendanceData =
      await this.attendanceService.getAttendanceStatusForLiveClass(
        req.auth.userId,
        liveClassId,
      );

    sendSuccess(
      res,
      HTTP_STATUS.OK,
      "Attendance status retrieved successfully",
      attendanceData,
    );
  };

  recordAttendanceEvent = async (
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

    const input = createAttendanceEventSchema.parse(req.body);

    const result = await this.attendanceService.recordAttendanceEvent({
      userId: req.auth.userId,
      liveClassId: input.liveClassId,
      eventType: input.eventType,
      eventAt: input.eventAt,
    });

    sendSuccess(
      res,
      HTTP_STATUS.CREATED,
      "Attendance event recorded successfully",
      result,
    );
  };

  calculateAttendance = async (
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

    const { liveClassId } = liveClassIdParamSchema.parse(req.params);

    const result =
      await this.attendanceService.calculateAttendanceForLiveClass(
        req.auth.userId,
        liveClassId,
      );

    sendSuccess(
      res,
      HTTP_STATUS.CREATED,
      "Attendance calculated successfully",
      result,
    );
  };

  deleteAttendance = async (
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

    const { liveClassId } = liveClassIdParamSchema.parse(req.params);

    await this.attendanceService.resetAttendanceForLiveClass(
      req.auth.userId,
      liveClassId,
    );

    sendSuccess(
      res,
      HTTP_STATUS.OK,
      "Attendance demo reset successfully",
    );
  };

  getAttendanceEvents = async (
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

    const { liveClassId } = liveClassIdParamSchema.parse(req.params);

    const result =
      await this.attendanceService.getAttendanceEventsForLiveClass(
        req.auth.userId,
        liveClassId,
      );

    sendSuccess(
      res,
      HTTP_STATUS.OK,
      "Attendance events retrieved successfully",
      result,
    );
  };
}
