import type {
  AttendanceEvent,
  AttendanceRecord,
} from "../../../generated/prisma/client";
import type {
  AttendanceEventType,
  AttendanceStatus,
} from "../types/attendance.types";

export interface LiveClassWithScheduleAndCourseAccess {
  id: number;
  startsAt: Date;
  durationMinutes: number;
  course: {
    id: number;
    isActive: boolean;
    enrollments: { id: number }[];
  };
}

export interface CreateAttendanceEventData {
  liveClassId: number;
  userId: number;
  eventType: AttendanceEventType;
  eventAt: Date;
}

export interface CreateAttendanceRecordData {
  userId: number;
  liveClassId: number;
  totalMinutes: number;
  attendancePercentage: number;
  status: AttendanceStatus;
  calculatedAt: Date;
}

export interface IAttendanceRepository {
  findLiveClassWithCourseAccess(
    liveClassId: number,
    userId: number,
  ): Promise<LiveClassWithScheduleAndCourseAccess | null>;

  findAttendanceRecordByUserAndLiveClass(
    userId: number,
    liveClassId: number,
  ): Promise<AttendanceRecord | null>;

  findAttendanceEventsByUserAndLiveClass(
    userId: number,
    liveClassId: number,
  ): Promise<AttendanceEvent[]>;

  createAttendanceEvent(
    data: CreateAttendanceEventData,
  ): Promise<AttendanceEvent>;

  createAttendanceRecord(
    data: CreateAttendanceRecordData,
  ): Promise<AttendanceRecord>;

  deleteAttendanceForUserAndLiveClass(
    userId: number,
    liveClassId: number,
  ): Promise<void>;
}
