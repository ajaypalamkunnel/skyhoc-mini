"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import type { CurrentUser } from "@/features/auth/auth.types";
import type { AdminCourseQuery, Course } from "@/features/courses/courses.types";
import { courseService } from "@/features/courses/courses.service";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { AdminCourseFilters } from "./admin-course-filters";
import { AdminCourseTable } from "./admin-course-table";
import { AdminCourseSkeleton } from "./admin-course-skeleton";

interface AdminCoursesViewProps {
  user: CurrentUser | null;
}

const DEFAULT_FILTERS: AdminCourseQuery = {
  status: "all",
  search: "",
  sortBy: "id",
  sortOrder: "asc",
};

export function AdminCoursesView({ user }: AdminCoursesViewProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState<AdminCourseQuery>(DEFAULT_FILTERS);
  const [courses, setCourses] = useState<Course[]>([]);
  const [allCoursesCache, setAllCoursesCache] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounced search timer
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCourses = useCallback(async (activeQuery: AdminCourseQuery) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await courseService.getAdminCourses(activeQuery);

      if (response.success && response.data) {
        const list = response.data.courses || [];
        setCourses(list);

        // Keep a snapshot when fetching all to compute accurate tab badge counters
        if (!activeQuery.search && activeQuery.status === "all") {
          setAllCoursesCache(list);
        }
      } else {
        setError(response.message || "Failed to load courses");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred while fetching courses.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchCourses(DEFAULT_FILTERS);
  }, [fetchCourses]);

  // Handle filter changes with debounce for search
  const handleFilterChange = (updates: Partial<AdminCourseQuery>) => {
    const updated = { ...filters, ...updates };
    setFilters(updated);

    if (updates.search !== undefined) {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
      searchTimerRef.current = setTimeout(() => {
        fetchCourses(updated);
      }, 300);
    } else {
      fetchCourses(updated);
    }
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    fetchCourses(DEFAULT_FILTERS);
  };

  // Compute status counts
  const totalCount = allCoursesCache.length || courses.length;
  const activeCount =
    allCoursesCache.filter((c) => c.isActive).length ||
    courses.filter((c) => c.isActive).length;
  const inactiveCount =
    allCoursesCache.filter((c) => !c.isActive).length ||
    courses.filter((c) => !c.isActive).length;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col">
      {/* Navigation Header */}
      <DashboardHeader
        user={user}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 space-y-6">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <Link
                href="/dashboard/admin"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-neutral-900 dark:text-white font-semibold">
                Course Management
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Course Catalog & Management
            </h1>
          </div>

          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-xs transition-all w-fit cursor-pointer"
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Metrics Summary Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Total Courses
              </p>
              <p className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
                {totalCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
              📚
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Active Courses
              </p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {activeCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
              ✅
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Archived / Inactive
              </p>
              <p className="text-2xl font-black text-neutral-700 dark:text-neutral-300 mt-1">
                {inactiveCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center font-bold text-lg">
              📦
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <AdminCourseFilters
          filters={filters}
          totalCount={totalCount}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => fetchCourses(filters)}
              className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-500 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Table Content or Skeleton */}
        {isLoading ? (
          <AdminCourseSkeleton />
        ) : (
          <AdminCourseTable
            courses={courses}
            onResetFilters={handleResetFilters}
          />
        )}
      </main>
    </div>
  );
}
