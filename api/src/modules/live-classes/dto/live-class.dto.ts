import { z } from "zod";

export const courseLiveClassesQuerySchema = z.object({
  status: z.enum(["upcoming", "completed"]),
});

export type CourseLiveClassesQueryInput = z.infer<
  typeof courseLiveClassesQuerySchema
>;

export type LiveClassQueryStatus = "upcoming" | "completed";

export const courseLiveClassesParamsSchema = z.object({
  courseId: z.coerce.number().int().positive(),
});

export type CourseLiveClassesParamsInput = z.infer<
  typeof courseLiveClassesParamsSchema
>;

export const myLiveClassesQuerySchema = z.object({
  status: z.enum(["upcoming", "completed"]),
});

export type MyLiveClassesQueryInput = z.infer<
  typeof myLiveClassesQuerySchema
>;
