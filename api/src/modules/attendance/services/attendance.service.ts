import { AppError } from "../../../utils/app-error";
import { ERROR_CODES } from "../../../utils/error-codes";
import { HTTP_STATUS } from "../../../utils/http-status";
import type {
  AttendanceEventsListResponseDTO,
  AttendanceStatusResponseDTO,
  CalculatedAttendanceResponseDTO,
  CreateAttendanceEventResponseDTO,
} from "../dto/attendance.dto";
import type { IAttendanceRepository } from "../repository/attendance.repository.interface";
import {
  AttendanceCalculatorService,
  type IAttendanceCalculatorService,
} from "./attendance-calculator.service";
import type {
  AttendanceEventInput,
  AttendanceStatus,
} from "../types/attendance.types";
import type {
  IAttendanceService,
  RecordAttendanceEventInput,
} from "./attendance.service.interface";

export class AttendanceService implements IAttendanceService {
  constructor(
    private readonly attendanceRepository: IAttendanceRepository,
    private readonly attendanceCalculatorService: IAttendanceCalculatorService = new AttendanceCalculatorService(),
  ) { }

  async getAttendanceStatusForLiveClass(
    userId: number,
    liveClassId: number,
  ): Promise<AttendanceStatusResponseDTO> {
    const liveClass =
      await this.attendanceRepository.findLiveClassWithCourseAccess(
        liveClassId,
        userId,
      );

    if (!liveClass) {
      throw new AppError(
        "Live class not found",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
      );
    }

    if (
      !liveClass.course.isActive ||
      liveClass.course.enrollments.length === 0
    ) {
      throw new AppError(
        "You do not have access to this live class",
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
      );
    }

    const record =
      await this.attendanceRepository.findAttendanceRecordByUserAndLiveClass(
        userId,
        liveClassId,
      );

    if (!record) {
      return {
        hasAttendance: false,
        attendance: null,
      };
    }

    return {
      hasAttendance: true,
      attendance: {
        totalMinutes: record.totalMinutes,
        attendancePercentage: Number(record.attendancePercentage),
        status: record.status as AttendanceStatus,
        calculatedAt: record.calculatedAt.toISOString(),
      },
    };
  }

  async recordAttendanceEvent(
    input: RecordAttendanceEventInput,
  ): Promise<CreateAttendanceEventResponseDTO> {
    const liveClass =
      await this.attendanceRepository.findLiveClassWithCourseAccess(
        input.liveClassId,
        input.userId,
      );

    if (!liveClass) {
      throw new AppError(
        "Live class not found",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
      );
    }

    if (
      !liveClass.course.isActive ||
      liveClass.course.enrollments.length === 0
    ) {
      throw new AppError(
        "You do not have access to this live class",
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
      );
    }

    const eventDate =
      input.eventAt instanceof Date ? input.eventAt : new Date(input.eventAt);

    if (isNaN(eventDate.getTime())) {
      throw new AppError(
        "Invalid event date/time",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR,
      );
    }

    const classStartMs = liveClass.startsAt.getTime();
    const classEndMs =
      classStartMs + liveClass.durationMinutes * 60 * 1000;
    const eventMs = eventDate.getTime();

    if (eventMs < classStartMs || eventMs > classEndMs) {
      throw new AppError(
        "Event time must be within the live class schedule",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR,
      );
    }

    const createdEvent =
      await this.attendanceRepository.createAttendanceEvent({
        liveClassId: input.liveClassId,
        userId: input.userId,
        eventType: input.eventType,
        eventAt: eventDate,
      });

    return {
      event: {
        id: createdEvent.id,
        liveClassId: createdEvent.liveClassId,
        eventType: createdEvent.eventType,
        eventAt: createdEvent.eventAt.toISOString(),
        createdAt: createdEvent.createdAt.toISOString(),
      },
    };
  }

  async calculateAttendanceForLiveClass(
    userId: number,
    liveClassId: number,
  ): Promise<CalculatedAttendanceResponseDTO> {
    const liveClass =
      await this.attendanceRepository.findLiveClassWithCourseAccess(
        liveClassId,
        userId,
      );

    if (!liveClass) {
      throw new AppError(
        "Live class not found",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
      );
    }

    if (
      !liveClass.course.isActive ||
      liveClass.course.enrollments.length === 0
    ) {
      throw new AppError(
        "You do not have access to this live class",
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
      );
    }

    const existingRecord =
      await this.attendanceRepository.findAttendanceRecordByUserAndLiveClass(
        userId,
        liveClassId,
      );

    if (existingRecord) {
      throw new AppError(
        "Attendance has already been calculated for this live class",
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.RESOURCE_CONFLICT,
      );
    }

    const rawEvents =
      await this.attendanceRepository.findAttendanceEventsByUserAndLiveClass(
        userId,
        liveClassId,
      );

    const eventInputs: AttendanceEventInput[] = rawEvents.map((event) => ({
      eventType: event.eventType,
      eventAt: event.eventAt,
    }));

    const calculationResult =
      this.attendanceCalculatorService.calculateAttendance({
        classStartsAt: liveClass.startsAt,
        classDurationMinutes: liveClass.durationMinutes,
        events: eventInputs,
      });

    const calculatedAt = new Date();
    const record = await this.attendanceRepository.createAttendanceRecord({
      userId,
      liveClassId,
      totalMinutes: calculationResult.totalMinutes,
      attendancePercentage: calculationResult.attendancePercentage,
      status: calculationResult.status,
      calculatedAt,
    });

    return {
      attendance: {
        totalMinutes: record.totalMinutes,
        attendancePercentage: Number(record.attendancePercentage),
        status: record.status as AttendanceStatus,
        calculatedAt: record.calculatedAt.toISOString(),
      },
    };
  }

  async resetAttendanceForLiveClass(
    userId: number,
    liveClassId: number,
  ): Promise<void> {
    const liveClass =
      await this.attendanceRepository.findLiveClassWithCourseAccess(
        liveClassId,
        userId,
      );

    if (!liveClass) {
      throw new AppError(
        "Live class not found",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
      );
    }

    if (
      !liveClass.course.isActive ||
      liveClass.course.enrollments.length === 0
    ) {
      throw new AppError(
        "You do not have access to this live class",
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
      );
    }

    await this.attendanceRepository.deleteAttendanceForUserAndLiveClass(
      userId,
      liveClassId,
    );
  }

  async getAttendanceEventsForLiveClass(
    userId: number,
    liveClassId: number,
  ): Promise<AttendanceEventsListResponseDTO> {
    const liveClass =
      await this.attendanceRepository.findLiveClassWithCourseAccess(
        liveClassId,
        userId,
      );

    if (!liveClass) {
      throw new AppError(
        "Live class not found",
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
      );
    }

    if (
      !liveClass.course.isActive ||
      liveClass.course.enrollments.length === 0
    ) {
      throw new AppError(
        "You do not have access to this live class",
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
      );
    }

    const rawEvents =
      await this.attendanceRepository.findAttendanceEventsByUserAndLiveClass(
        userId,
        liveClassId,
      );

    return {
      events: rawEvents.map((event) => ({
        id: event.id,
        eventType: event.eventType,
        eventAt: event.eventAt.toISOString(),
      })),
    };
  }
}
