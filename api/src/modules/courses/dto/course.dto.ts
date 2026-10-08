import { z } from "zod";

export const courseIdParamSchema = z.object({
  courseId: z.coerce.number().int().positive(),
});

export type CourseIdParamInput = z.infer<typeof courseIdParamSchema>;
