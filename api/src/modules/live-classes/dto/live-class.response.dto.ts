import type { LiveClassStatus } from "../../../generated/prisma/enums";

export interface LiveClassCourseDTO {
  id: number;
  title: string;
}

export interface LiveClassResponseDTO {
  id: number;
  title: string;
  startsAt: Date;
  durationMinutes: number;
  status: LiveClassStatus;
}

export interface MyLiveClassResponseDTO extends LiveClassResponseDTO {
  course: LiveClassCourseDTO;
}
