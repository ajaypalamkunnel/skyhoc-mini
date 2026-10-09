import { AppError } from "../../../utils/app-error";
import { ERROR_CODES } from "../../../utils/error-codes";
import { HTTP_STATUS } from "../../../utils/http-status";
import type {
  AttendanceCalculationInput,
  AttendanceCalculationResult,
  AttendanceEventInput,
  AttendanceStatus,
} from "../types/attendance.types";

interface TimeInterval {
  startMs: number;
  endMs: number;
}

export interface IAttendanceCalculatorService {
  calculateAttendance(
    input: AttendanceCalculationInput,
  ): AttendanceCalculationResult;
}

export class AttendanceCalculatorService
  implements IAttendanceCalculatorService {
  private static readonly ATTENDANCE_THRESHOLD_PERCENT = 70;

  /**
   * Pure service method to calculate student attendance metrics from raw JOIN/LEAVE events.
   *
   * Handles:
   * - Out-of-order events
   * - Duplicate events
   * - Overlapping intervals & multi-device/multi-tab connections
   * - Missing LEAVE events (closed at class end)
   * - Unmatched LEAVE events (ignored)
   * - Events outside or partially outside live class boundaries (clamped)
   */
  public calculateAttendance(
    input: AttendanceCalculationInput,
  ): AttendanceCalculationResult {
    this.validateInput(input);

    const classStartMs = input.classStartsAt.getTime();
    const classEndMs =
      classStartMs + input.classDurationMinutes * 60 * 1000;

    if (input.events.length === 0) {
      return {
        totalMinutes: 0,
        attendancePercentage: 0,
        status: "ABSENT",
      };
    }

    // 1. Sort events chronologically by timestamp
    const sortedEvents = [...input.events].sort(
      (a, b) => a.eventAt.getTime() - b.eventAt.getTime(),
    );

    // 2. Deduplicate consecutive identical events at the exact same timestamp
    const deduplicatedEvents = this.deduplicateEvents(sortedEvents);

    // 3. Resolve JOIN/LEAVE events into raw intervals using active join depth tracking
    const rawIntervals = this.resolveIntervals(
      deduplicatedEvents,
      classEndMs,
    );

    // 4. Clamp intervals to class boundaries and filter out non-overlapping ones
    const clampedIntervals = this.clampIntervals(
      rawIntervals,
      classStartMs,
      classEndMs,
    );

    // 5. Merge any overlapping or contiguous intervals
    const mergedIntervals = this.mergeIntervals(clampedIntervals);

    // 6. Calculate total attended duration in milliseconds and minutes
    const totalAttendedMs = mergedIntervals.reduce(
      (total, interval) => total + (interval.endMs - interval.startMs),
      0,
    );

    const totalMinutes = Math.min(
      input.classDurationMinutes,
      Math.max(0, Math.floor(totalAttendedMs / (60 * 1000))),
    );

    // 7. Calculate attendance percentage rounded to 2 decimal places
    const rawPercentage = (totalMinutes / input.classDurationMinutes) * 100;
    const attendancePercentage = Math.min(
      100,
      Math.max(0, Number(rawPercentage.toFixed(2))),
    );

    // 8. Determine attendance status based on >= 70% threshold
    const status: AttendanceStatus =
      attendancePercentage >=
        AttendanceCalculatorService.ATTENDANCE_THRESHOLD_PERCENT
        ? "PRESENT"
        : "ABSENT";

    return {
      totalMinutes,
      attendancePercentage,
      status,
    };
  }

  private validateInput(input: AttendanceCalculationInput): void {
    if (!input || typeof input !== "object") {
      throw new AppError(
        "Invalid attendance calculation input",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR,
      );
    }

    if (
      !(input.classStartsAt instanceof Date) ||
      isNaN(input.classStartsAt.getTime())
    ) {
      throw new AppError(
        "classStartsAt must be a valid Date",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR,
      );
    }

    if (
      typeof input.classDurationMinutes !== "number" ||
      isNaN(input.classDurationMinutes) ||
      !Number.isFinite(input.classDurationMinutes) ||
      input.classDurationMinutes <= 0
    ) {
      throw new AppError(
        "classDurationMinutes must be a positive number greater than 0",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR,
      );
    }

    if (!Array.isArray(input.events)) {
      throw new AppError(
        "events must be an array",
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR,
      );
    }

    for (const event of input.events) {
      if (
        !event ||
        (event.eventType !== "JOIN" && event.eventType !== "LEAVE")
      ) {
        throw new AppError(
          "Each event must have eventType as 'JOIN' or 'LEAVE'",
          HTTP_STATUS.BAD_REQUEST,
          ERROR_CODES.VALIDATION_ERROR,
        );
      }

      if (!(event.eventAt instanceof Date) || isNaN(event.eventAt.getTime())) {
        throw new AppError(
          "Each event must have a valid eventAt Date",
          HTTP_STATUS.BAD_REQUEST,
          ERROR_CODES.VALIDATION_ERROR,
        );
      }
    }
  }

  private deduplicateEvents(
    sortedEvents: AttendanceEventInput[],
  ): AttendanceEventInput[] {
    const deduplicated: AttendanceEventInput[] = [];

    for (const event of sortedEvents) {
      const prev = deduplicated[deduplicated.length - 1];
      if (
        prev &&
        prev.eventType === event.eventType &&
        prev.eventAt.getTime() === event.eventAt.getTime()
      ) {
        // Skip duplicate event with identical type and timestamp
        continue;
      }
      deduplicated.push(event);
    }

    return deduplicated;
  }

  private resolveIntervals(
    events: AttendanceEventInput[],
    classEndMs: number,
  ): TimeInterval[] {
    const intervals: TimeInterval[] = [];
    let activeJoins = 0;
    let currentIntervalStart: number | null = null;

    for (const event of events) {
      const eventTimeMs = event.eventAt.getTime();

      if (event.eventType === "JOIN") {
        if (activeJoins === 0) {
          currentIntervalStart = eventTimeMs;
        }
        activeJoins++;
      } else if (event.eventType === "LEAVE") {
        if (activeJoins > 0) {
          activeJoins--;
          if (activeJoins === 0 && currentIntervalStart !== null) {
            intervals.push({
              startMs: currentIntervalStart,
              endMs: eventTimeMs,
            });
            currentIntervalStart = null;
          }
        }
        // If activeJoins === 0, this is an unmatched LEAVE and is safely ignored
      }
    }

    // Missing LEAVE: If class ends while active session is open, close interval at class end
    if (activeJoins > 0 && currentIntervalStart !== null) {
      intervals.push({
        startMs: currentIntervalStart,
        endMs: classEndMs,
      });
    }

    return intervals;
  }

  private clampIntervals(
    intervals: TimeInterval[],
    classStartMs: number,
    classEndMs: number,
  ): TimeInterval[] {
    const clamped: TimeInterval[] = [];

    for (const interval of intervals) {
      const startMs = Math.max(interval.startMs, classStartMs);
      const endMs = Math.min(interval.endMs, classEndMs);

      if (endMs > startMs) {
        clamped.push({ startMs, endMs });
      }
    }

    return clamped;
  }

  private mergeIntervals(intervals: TimeInterval[]): TimeInterval[] {
    if (intervals.length === 0) {
      return [];
    }

    // Sort intervals by start timestamp ascending
    const sorted = [...intervals].sort(
      (a, b) => a.startMs - b.startMs || a.endMs - b.endMs,
    );

    const merged: TimeInterval[] = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const lastMerged = merged[merged.length - 1];

      if (current.startMs <= lastMerged.endMs) {
        // Overlapping or contiguous interval: extend the end timestamp
        lastMerged.endMs = Math.max(lastMerged.endMs, current.endMs);
      } else {
        merged.push({ ...current });
      }
    }

    return merged;
  }
}
