"use client";

import type { AdminCourseQuery } from "@/features/courses/courses.types";

interface AdminCourseFiltersProps {
  filters: AdminCourseQuery;
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  onFilterChange: (updates: Partial<AdminCourseQuery>) => void;
  onReset: () => void;
}

export function AdminCourseFilters({
  filters,
  totalCount,
  activeCount,
  inactiveCount,
  onFilterChange,
  onReset,
}: AdminCourseFiltersProps) {
  const currentStatus = filters.status || "all";
  const currentSortBy = filters.sortBy || "id";
  const currentSortOrder = filters.sortOrder || "asc";
  const currentSearch = filters.search || "";

  const isFiltered =
    currentSearch !== "" ||
    currentStatus !== "all" ||
    currentSortBy !== "id" ||
    currentSortOrder !== "asc";

  return (
    <div className="space-y-4 p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
      {/* Top Row: Search Input + Status Tabs */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={currentSearch}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search by course title or keywords..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
          />
          {currentSearch && (
            <button
              onClick={() => onFilterChange({ search: "" })}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Status Segmented Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-950/70 border border-neutral-200/80 dark:border-neutral-800/80 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => onFilterChange({ status: "all" })}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentStatus === "all"
                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-bold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <span>All Courses</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                currentStatus === "all"
                  ? "bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                  : "bg-neutral-200/60 dark:bg-neutral-800/60 text-neutral-500"
              }`}
            >
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ status: "active" })}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentStatus === "active"
                ? "bg-white dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Active</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                currentStatus === "active"
                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                  : "bg-neutral-200/60 dark:bg-neutral-800/60 text-neutral-500"
              }`}
            >
              {activeCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ status: "inactive" })}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentStatus === "inactive"
                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-bold"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            <span>Archived</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                currentStatus === "inactive"
                  ? "bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                  : "bg-neutral-200/60 dark:bg-neutral-800/60 text-neutral-500"
              }`}
            >
              {inactiveCount}
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Sorting Controls + Reset Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/70 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 dark:text-neutral-400 font-medium">
            Sort by:
          </span>

          <select
            value={currentSortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as AdminCourseQuery["sortBy"],
              })
            }
            className="px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="id">Course ID (#)</option>
            <option value="title">Course Title (Alphabetical)</option>
            <option value="createdAt">Date Created</option>
          </select>

          <button
            type="button"
            onClick={() =>
              onFilterChange({
                sortOrder: currentSortOrder === "asc" ? "desc" : "asc",
              })
            }
            title={
              currentSortOrder === "asc"
                ? "Switch to Descending"
                : "Switch to Ascending"
            }
            className="px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{currentSortOrder === "asc" ? "Ascending" : "Descending"}</span>
            <span className="font-bold text-sm">
              {currentSortOrder === "asc" ? "↑" : "↓"}
            </span>
          </button>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Reset Filters</span>
            <span>✕</span>
          </button>
        )}
      </div>
    </div>
  );
}
