import type {
  AttendanceEventsListResponseDTO,
  AttendanceStatusResponseDTO,
  CalculatedAttendanceResponseDTO,
  CreateAttendanceEventResponseDTO,
} from "../dto/attendance.dto";
import type { AttendanceEventType } from "../types/attendance.types";

export interface RecordAttendanceEventInput {
  userId: number;
  liveClassId: number;
  eventType: AttendanceEventType;
  eventAt: string | Date;
}

export interface IAttendanceService {
  getAttendanceStatusForLiveClass(
    userId: number,
    liveClassId: number,
  ): Promise<AttendanceStatusResponseDTO>;

  recordAttendanceEvent(
    input: RecordAttendanceEventInput,
  ): Promise<CreateAttendanceEventResponseDTO>;

  calculateAttendanceForLiveClass(
    userId: number,
    liveClassId: number,
  ): Promise<CalculatedAttendanceResponseDTO>;

  resetAttendanceForLiveClass(
    userId: number,
    liveClassId: number,
  ): Promise<void>;

  getAttendanceEventsForLiveClass(
    userId: number,
    liveClassId: number,
  ): Promise<AttendanceEventsListResponseDTO>;
}
