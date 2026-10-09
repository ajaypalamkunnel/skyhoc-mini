import { apiClient } from "@/lib/api/api-client";
import type { ApiResponse } from "@/types/api";
import type {
  AttendanceStatusResponse,
  AttendanceEventsResponse,
  CalculatedAttendanceResponse,
  CreateAttendanceEventInput,
  AttendanceEvent,
} from "./attendance.types";

export const attendanceService = {
  getAttendance: async (
    liveClassId: number | string,
    headers?: HeadersInit,
  ): Promise<ApiResponse<AttendanceStatusResponse>> => {
    return apiClient.get<AttendanceStatusResponse>(
      `/api/attendance/live-classes/${liveClassId}`,
      { headers },
    );
  },

  getAttendanceEvents: async (
    liveClassId: number | string,
    headers?: HeadersInit,
  ): Promise<ApiResponse<AttendanceEventsResponse>> => {
    return apiClient.get<AttendanceEventsResponse>(
      `/api/attendance/live-classes/${liveClassId}/events`,
      { headers },
    );
  },

  createAttendanceEvent: async (
    input: CreateAttendanceEventInput,
    headers?: HeadersInit,
  ): Promise<ApiResponse<{ event: AttendanceEvent }>> => {
    return apiClient.post<{ event: AttendanceEvent }>(
      "/api/attendance/events",
      input,
      { headers },
    );
  },

  calculateAttendance: async (
    liveClassId: number | string,
    headers?: HeadersInit,
  ): Promise<ApiResponse<CalculatedAttendanceResponse>> => {
    return apiClient.post<CalculatedAttendanceResponse>(
      `/api/attendance/live-classes/${liveClassId}/calculate`,
      undefined,
      { headers },
    );
  },

  resetAttendance: async (
    liveClassId: number | string,
    headers?: HeadersInit,
  ): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(
      `/api/attendance/live-classes/${liveClassId}`,
      { headers },
    );
  },
};
