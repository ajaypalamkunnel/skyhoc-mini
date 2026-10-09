export interface LiveClassCourse {
  id: number;
  title: string;
}

export interface LiveClass {
  id: number;
  courseId?: number;
  title: string;
  startsAt: string;
  durationMinutes: number;
  status: "SCHEDULED" | "CANCELLED" | "COMPLETED";
  course?: LiveClassCourse;
}

