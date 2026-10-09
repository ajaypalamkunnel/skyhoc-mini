export type AttendanceEventType = "JOIN" | "LEAVE";

export interface AttendanceEventInput {
  eventType: AttendanceEventType;
  eventAt: Date;
}

export interface AttendanceCalculationInput {
  classStartsAt: Date;
  classDurationMinutes: number;
  events: AttendanceEventInput[];
}

export type AttendanceStatus = "PRESENT" | "ABSENT";

export interface AttendanceCalculationResult {
  totalMinutes: number;
  attendancePercentage: number;
  status: AttendanceStatus;
}
