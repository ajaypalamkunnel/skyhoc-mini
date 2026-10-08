import { apiClient } from "@/lib/api/api-client";
import type { ApiResponse } from "@/types/api";
import type { LiveClass } from "./live-classes.types";

export const liveClassService = {
  getMyLiveClasses: async (
    status: "upcoming" | "completed",
    headers?: HeadersInit,
  ): Promise<ApiResponse<LiveClass[]>> => {
    return apiClient.get<LiveClass[]>(
      `/api/live-classes/my-live-classes?status=${status}`,
      { headers },
    );
  },

  getCourseLiveClasses: async (
    courseId: number | string,
    status: "upcoming" | "completed",
    headers?: HeadersInit,
  ): Promise<ApiResponse<LiveClass[]>> => {
    return apiClient.get<LiveClass[]>(
      `/api/courses/${courseId}/live-classes?status=${status}`,
      { headers },
    );
  },
};
