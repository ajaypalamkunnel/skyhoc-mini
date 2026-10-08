import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { requireRole } from "@/lib/auth/role-guard";
import { courseService } from "@/features/courses/courses.service";
import type { Course } from "@/features/courses/courses.types";
import { liveClassService } from "@/features/live-classes/live-classes.service";
import type { LiveClass } from "@/features/live-classes/live-classes.types";
import { CourseDetailsView } from "@/features/courses/components/course-details-view";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";

interface CourseDetailsPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export async function generateMetadata(
  props: CourseDetailsPageProps,
): Promise<Metadata> {
  const { courseId } = await props.params;
  return {
    title: `Course Details | Skyhoc`,
    description: `View live classes and details for course #${courseId}.`,
  };
}

export default async function CourseDetailsPage(props: CourseDetailsPageProps) {
  const { courseId } = await props.params;
  const user = await requireRole(["STUDENT"]);

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  const authHeaders = {
    Cookie: `access_token=${accessToken?.value ?? ""}`,
  };

  let course: Course | null = null;
  let upcomingLiveClasses: LiveClass[] = [];
  let completedLiveClasses: LiveClass[] = [];
  let courseError: string | null = null;
  let liveClassesError: string | null = null;

  try {
    const courseResponse = await courseService.getCourseById(courseId, authHeaders);
    if (courseResponse.success && courseResponse.data) {
      course = courseResponse.data;
    } else {
      courseError = courseResponse.message || "Course not found or access denied.";
    }
  } catch {
    courseError = "Unable to load course details. You may not be enrolled in this course.";
  }

  if (course) {
    try {
      const [upcomingRes, completedRes] = await Promise.all([
        liveClassService.getCourseLiveClasses(courseId, "upcoming", authHeaders),
        liveClassService.getCourseLiveClasses(courseId, "completed", authHeaders),
      ]);

      if (upcomingRes.success && upcomingRes.data) {
        upcomingLiveClasses = upcomingRes.data;
      }

      if (completedRes.success && completedRes.data) {
        completedLiveClasses = completedRes.data;
      }
    } catch {
      liveClassesError = "Unable to load live classes for this course.";
    }
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col">
        <DashboardHeader user={user} />
        <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 flex-1 flex items-center justify-center">
          <div className="text-center p-8 sm:p-12 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm max-w-md w-full">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              Course Not Found
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              {courseError || "The requested course could not be found or you are not enrolled in it."}
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Back to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <CourseDetailsView
      user={user}
      course={course}
      upcomingLiveClasses={upcomingLiveClasses}
      completedLiveClasses={completedLiveClasses}
      liveClassesError={liveClassesError}
    />
  );
}
