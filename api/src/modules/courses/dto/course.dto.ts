import { z } from "zod";

export const courseIdParamSchema = z.object({
  courseId: z.coerce.number().int().positive(),
});

export type CourseIdParamInput = z.infer<typeof courseIdParamSchema>;

export const adminCourseQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(["all", "active", "inactive"]).default("all"),
  sortBy: z.enum(["id", "title", "createdAt"]).default("id"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type AdminCourseQueryInput = z.infer<typeof adminCourseQuerySchema>;
