import type { Metadata } from "next";
import { cookies } from "next/headers";

import { requireRole } from "@/lib/auth/role-guard";
import { courseService } from "@/features/courses/courses.service";
import type { Course } from "@/features/courses/courses.types";
import { liveClassService } from "@/features/live-classes/live-classes.service";
import type { LiveClass } from "@/features/live-classes/live-classes.types";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export const metadata: Metadata = {
  title: "Student Dashboard | Skyhoch",
  description: "View your enrolled German language courses and live classes.",
};

export default async function StudentDashboardPage() {
  const user = await requireRole(["STUDENT"]);

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  const authHeaders = {
    Cookie: `access_token=${accessToken?.value ?? ""}`,
  };

  let courses: Course[] = [];
  let upcomingLiveClasses: LiveClass[] = [];
  let completedLiveClasses: LiveClass[] = [];
  let coursesError: string | null = null;
  let liveClassesError: string | null = null;

  try {
    const coursesResponse = await courseService.getMyCourses(authHeaders);
    if (coursesResponse.success && coursesResponse.data) {
      courses = coursesResponse.data;
    }
  } catch {
    coursesError = "Unable to load courses. Please try again later.";
  }

  try {
    const [upcomingRes, completedRes] = await Promise.all([
      liveClassService.getMyLiveClasses("upcoming", authHeaders),
      liveClassService.getMyLiveClasses("completed", authHeaders),
    ]);

    if (upcomingRes.success && upcomingRes.data) {
      upcomingLiveClasses = upcomingRes.data;
    }

    if (completedRes.success && completedRes.data) {
      completedLiveClasses = completedRes.data;
    }
  } catch {
    liveClassesError = "Unable to load live classes. Please try again later.";
  }

  return (
    <DashboardView
      user={user}
      courses={courses}
      upcomingLiveClasses={upcomingLiveClasses}
      completedLiveClasses={completedLiveClasses}
      coursesError={coursesError}
      liveClassesError={liveClassesError}
    />
  );
}
