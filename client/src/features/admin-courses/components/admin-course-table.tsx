"use client";

import Link from "next/link";
import type { Course } from "@/features/courses/courses.types";

interface AdminCourseTableProps {
  courses: Course[];
  onResetFilters: () => void;
}

export function AdminCourseTable({
  courses,
  onResetFilters,
}: AdminCourseTableProps) {
  if (courses.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-2xl">
          🔍
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            No courses found
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No courses match the current search or status filters. Try refining your keyword or clearing filters.
          </p>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm cursor-pointer"
        >
          <span>Clear All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
      {/* Desktop / Tablet Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-950/40 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <th className="py-4 px-6 w-20">ID</th>
              <th className="py-4 px-6">Course Information</th>
              <th className="py-4 px-6 w-36">Status</th>
              <th className="py-4 px-6 w-36 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-sm">
            {courses.map((course) => (
              <tr
                key={course.id}
                className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors group"
              >
                {/* ID */}
                <td className="py-4 px-6 font-mono text-xs font-bold text-neutral-500 dark:text-neutral-400">
                  #{course.id}
                </td>

                {/* Course Details */}
                <td className="py-4 px-6">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {course.title}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {course.description || "No description specified for this course."}
                    </p>
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 px-6 whitespace-nowrap">
                  {course.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                      Archived
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right whitespace-nowrap">
                  <Link
                    href={`/dashboard/courses/${course.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-neutral-200/80 dark:border-neutral-700/80 transition-all cursor-pointer"
                  >
                    <span>Inspect</span>
                    <span>→</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
