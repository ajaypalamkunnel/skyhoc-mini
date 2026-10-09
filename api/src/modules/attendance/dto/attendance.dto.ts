import { z } from "zod";
import type {
  AttendanceEventType,
  AttendanceStatus,
} from "../types/attendance.types";

export const liveClassIdParamSchema = z.object({
  liveClassId: z.coerce
    .number({
      error: "Live class ID must be a valid number",
    })
    .int("Live class ID must be an integer")
    .positive("Live class ID must be a positive integer"),
});

export type LiveClassIdParamInput = z.infer<typeof liveClassIdParamSchema>;

export const createAttendanceEventSchema = z.object({
  liveClassId: z
    .number({
      error: "liveClassId is required and must be a number",
    })
    .int("liveClassId must be an integer")
    .positive("liveClassId must be a positive integer"),
  eventType: z.enum(["JOIN", "LEAVE"], {
    error: "eventType must be either 'JOIN' or 'LEAVE'",
  }),
  eventAt: z
    .string({
      error: "eventAt is required",
    })
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "eventAt must be a valid date/time string",
    }),
});

export type CreateAttendanceEventInput = z.infer<
  typeof createAttendanceEventSchema
>;

export interface AttendanceDetailDTO {
  totalMinutes: number;
  attendancePercentage: number;
  status: AttendanceStatus;
  calculatedAt: string;
}

export interface AttendanceStatusResponseDTO {
  hasAttendance: boolean;
  attendance: AttendanceDetailDTO | null;
}

export interface AttendanceEventItemDTO {
  id: number;
  liveClassId: number;
  eventType: AttendanceEventType;
  eventAt: string;
  createdAt: string;
}

export interface CreateAttendanceEventResponseDTO {
  event: AttendanceEventItemDTO;
}

export interface CalculatedAttendanceResponseDTO {
  attendance: AttendanceDetailDTO;
}

export interface AttendanceEventListItemDTO {
  id: number;
  eventType: AttendanceEventType;
  eventAt: string;
}

export interface AttendanceEventsListResponseDTO {
  events: AttendanceEventListItemDTO[];
}
