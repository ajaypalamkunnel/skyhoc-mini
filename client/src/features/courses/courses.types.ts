export interface Course {
  id: number;
  title: string;
  description: string | null;
  isActive: boolean;
}

export interface AdminCourseQuery {
  status?: "all" | "active" | "inactive";
  search?: string;
  sortBy?: "id" | "title" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface AdminCoursesData {
  courses: Course[];
}
