import { apiClient } from "@/lib/api/api-client";
import type { ApiResponse } from "@/types/api";
import type { AdminCourseQuery, AdminCoursesData, Course } from "./courses.types";

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

  getAdminCourses: async (
    query?: AdminCourseQuery,
    headers?: HeadersInit,
  ): Promise<ApiResponse<AdminCoursesData>> => {
    const searchParams = new URLSearchParams();

    if (query?.status && query.status !== "all") {
      searchParams.set("status", query.status);
    }
    if (query?.search && query.search.trim()) {
      searchParams.set("search", query.search.trim());
    }
    if (query?.sortBy) {
      searchParams.set("sortBy", query.sortBy);
    }
    if (query?.sortOrder) {
      searchParams.set("sortOrder", query.sortOrder);
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/api/admin/courses?${queryString}`
      : "/api/admin/courses";

    return apiClient.get<AdminCoursesData>(endpoint, { headers });
  },
};

