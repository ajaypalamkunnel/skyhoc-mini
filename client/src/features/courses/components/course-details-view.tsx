"use client";

import Link from "next/link";
import { useState } from "react";
import type { CurrentUser } from "@/features/auth/auth.types";
import type { Course } from "../courses.types";
import type { LiveClass } from "@/features/live-classes/live-classes.types";
import { LiveClassList } from "@/features/live-classes/components/live-class-list";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";

interface CourseDetailsViewProps {
  user: CurrentUser | null;
  course: Course;
  upcomingLiveClasses: LiveClass[];
  completedLiveClasses: LiveClass[];
  liveClassesError: string | null;
}

export function CourseDetailsView({
  user,
  course,
  upcomingLiveClasses,
  completedLiveClasses,
  liveClassesError,
}: CourseDetailsViewProps) {
  const [liveClassFilter, setLiveClassFilter] = useState<"upcoming" | "completed">("upcoming");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const displayedLiveClasses =
    liveClassFilter === "upcoming" ? upcomingLiveClasses : completedLiveClasses;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col">
      {/* Top Header */}
      <DashboardHeader
        user={user}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        {/* Navigation Breadcrumb / Back Button */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Course Details Hero Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm mb-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  Course #{course.id}
                </span>

                {course.isActive && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Enrolled & Active
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {course.description || "No course description available."}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex sm:flex-col gap-3 shrink-0 pt-2 sm:pt-0">
              <div className="px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 text-center sm:text-right">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Upcoming Classes</div>
                <div className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5">
                  {upcomingLiveClasses.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Classes Section */}
        <section aria-labelledby="course-live-classes-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2
                id="course-live-classes-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white"
              >
                Live Classes for {course.title}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                Join scheduled tutor sessions and view completed classroom recordings.
              </p>
            </div>

            {/* Sub-Tabs: Upcoming vs Completed */}
            <div className="inline-flex p-1 bg-neutral-200/70 dark:bg-neutral-900 rounded-xl">
              <button
                type="button"
                onClick={() => setLiveClassFilter("upcoming")}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  liveClassFilter === "upcoming"
                    ? "bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Upcoming ({upcomingLiveClasses.length})
              </button>
              <button
                type="button"
                onClick={() => setLiveClassFilter("completed")}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  liveClassFilter === "completed"
                    ? "bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Completed ({completedLiveClasses.length})
              </button>
            </div>
          </div>

          {liveClassesError ? (
            <div
              role="alert"
              className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-400 flex items-center gap-3"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{liveClassesError}</span>
            </div>
          ) : (
            <LiveClassList
              liveClasses={displayedLiveClasses}
              statusFilter={liveClassFilter}
              courseId={course.id}
            />

          )}
        </section>
      </main>
    </div>
  );
}
