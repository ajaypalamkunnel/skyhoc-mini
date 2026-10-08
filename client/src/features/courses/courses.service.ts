import { apiClient } from "@/lib/api/api-client";
import type { ApiResponse } from "@/types/api";
import type { Course } from "./courses.types";

export const courseService = {
  getMyCourses: async (headers?: HeadersInit): Promise<ApiResponse<Course[]>> => {
    return apiClient.get<Course[]>("/api/courses/my-courses", { headers });
  },

  getCourseById: async (
    courseId: number | string,
    headers?: HeadersInit,
  ): Promise<ApiResponse<Course>> => {
    return apiClient.get<Course>(`/api/courses/${courseId}`, { headers });
  },
};
