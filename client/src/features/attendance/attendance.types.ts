export type AttendanceEventType = "JOIN" | "LEAVE";

export type AttendanceStatus = "PRESENT" | "ABSENT";

export interface AttendanceEvent {
  id: number;
  eventType: AttendanceEventType;
  eventAt: string;
}

export interface CreateAttendanceEventInput {
  liveClassId: number;
  eventType: AttendanceEventType;
  eventAt: string;
}

export interface AttendanceDetail {
  totalMinutes: number;
  attendancePercentage: number;
  status: AttendanceStatus;
  calculatedAt: string;
}

export interface AttendanceStatusResponse {
  hasAttendance: boolean;
  attendance: AttendanceDetail | null;
}

export interface AttendanceEventsResponse {
  events: AttendanceEvent[];
}

export interface CalculatedAttendanceResponse {
  attendance: AttendanceDetail;
}

export interface DraftAttendanceEvent {
  id: string; // client-side temporary ID for react key
  eventType: AttendanceEventType;
  time: string; // HH:mm format from <input type="time">
}
