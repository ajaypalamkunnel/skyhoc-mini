import Link from "next/link";
import type { Course } from "../courses.types";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white leading-snug">
            {course.title}
          </h3>
          {course.isActive && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shrink-0">
              Active
            </span>
          )}
        </div>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-6">
          {course.description || "No description provided."}
        </p>
      </div>

      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-end">
        <Link
          href={`/dashboard/courses/${course.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <span>Details</span>
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
