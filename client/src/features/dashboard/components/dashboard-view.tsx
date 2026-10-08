"use client";

import { useState } from "react";
import type { CurrentUser } from "@/features/auth/auth.types";
import type { Course } from "@/features/courses/courses.types";
import { CourseList } from "@/features/courses/components/course-list";
import type { LiveClass } from "@/features/live-classes/live-classes.types";
import { LiveClassList } from "@/features/live-classes/components/live-class-list";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar, type DashboardTab } from "./dashboard-sidebar";

interface DashboardViewProps {
  user: CurrentUser | null;
  courses: Course[];
  upcomingLiveClasses: LiveClass[];
  completedLiveClasses: LiveClass[];
  coursesError: string | null;
  liveClassesError: string | null;
}

export function DashboardView({
  user,
  courses,
  upcomingLiveClasses,
  completedLiveClasses,
  coursesError,
  liveClassesError,
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("courses");
  const [liveClassFilter, setLiveClassFilter] = useState<"upcoming" | "completed">("upcoming");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const displayedLiveClasses =
    liveClassFilter === "upcoming" ? upcomingLiveClasses : completedLiveClasses;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col pb-20 lg:pb-12">
      {/* 1. Header Panel */}
      <DashboardHeader
        user={user}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* 2. Menu Panel / Sidebar */}
        <DashboardSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          courseCount={courses.length}
          liveClassCount={upcomingLiveClasses.length}
          isMobileDrawerOpen={isMobileMenuOpen}
          onCloseMobileDrawer={() => setIsMobileMenuOpen(false)}
        />

        {/* 3. Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Mobile Tab Pills */}
          <div className="flex lg:hidden items-center gap-2 p-1 mb-6 bg-neutral-200/70 dark:bg-neutral-900 rounded-xl overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab("courses")}
              className={`flex-1 min-w-[110px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg text-center transition-all cursor-pointer ${
                activeTab === "courses"
                  ? "bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              Courses ({courses.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("live-classes")}
              className={`flex-1 min-w-[110px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg text-center transition-all cursor-pointer ${
                activeTab === "live-classes"
                  ? "bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              Live Classes ({upcomingLiveClasses.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`flex-1 min-w-[90px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg text-center transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              Overview
            </button>
          </div>

          {/* TAB 1: Enrolled Courses */}
          {activeTab === "courses" && (
            <section aria-labelledby="courses-tab-heading" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <h1
                    id="courses-tab-heading"
                    className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white"
                  >
                    Enrolled Courses
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Your active German language curriculum and syllabus modules.
                  </p>
                </div>
                <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {courses.length} {courses.length === 1 ? "Course" : "Courses"} Enrolled
                </span>
              </div>

              {coursesError ? (
                <div
                  role="alert"
                  className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-400 flex items-center gap-3"
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{coursesError}</span>
                </div>
              ) : (
                <CourseList courses={courses} />
              )}
            </section>
          )}

          {/* TAB 2: Live Classes */}
          {activeTab === "live-classes" && (
            <section aria-labelledby="live-classes-tab-heading" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <h1
                    id="live-classes-tab-heading"
                    className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white"
                  >
                    Live Class Sessions
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Interactive classroom sessions across all your enrolled courses.
                  </p>
                </div>

                {/* Sub-Tabs: Upcoming vs Completed */}
                <div className="inline-flex p-1 bg-neutral-200/70 dark:bg-neutral-900 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setLiveClassFilter("upcoming")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
                />
              )}
            </section>
          )}

          {/* TAB 3: Student Overview */}
          {activeTab === "overview" && (
            <section aria-labelledby="overview-tab-heading" className="space-y-6">
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <h1
                  id="overview-tab-heading"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white"
                >
                  Student Overview
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Summary of your Skyhoc learning journey and profile credentials.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                    {courses.length}
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Enrolled Courses
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                    {upcomingLiveClasses.length}
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Upcoming Live Classes
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm sm:col-span-2 lg:col-span-1">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                    Active
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    Account Status
                  </div>
                </div>
              </div>

              {/* Profile Information Box */}
              {user && (
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
                    Student Profile
                  </h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-xs text-neutral-500 dark:text-neutral-400">Full Name</dt>
                      <dd className="mt-0.5 font-medium text-neutral-900 dark:text-white">{user.name}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-neutral-500 dark:text-neutral-400">Email Address</dt>
                      <dd className="mt-0.5 font-medium text-neutral-900 dark:text-white">{user.email}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-neutral-500 dark:text-neutral-400">Platform Role</dt>
                      <dd className="mt-0.5 font-medium text-neutral-900 dark:text-white capitalize">{user.role.toLowerCase()}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-neutral-500 dark:text-neutral-400">Account ID</dt>
                      <dd className="mt-0.5 font-medium text-neutral-900 dark:text-white">#{user.id}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {/* 4. Mobile Bottom Quick Navigation Bar (1-Thumb Reachable) */}
      <nav aria-label="Mobile bottom navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab("courses")}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors cursor-pointer ${
            activeTab === "courses"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-[10px] font-medium">Courses</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("live-classes")}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors cursor-pointer ${
            activeTab === "live-classes"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-medium">Live Classes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors cursor-pointer ${
            activeTab === "overview"
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[10px] font-medium">Overview</span>
        </button>
      </nav>
    </div>
  );
}
