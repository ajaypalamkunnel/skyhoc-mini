import type { LiveClass } from "../live-classes.types";

interface LiveClassCardProps {
  liveClass: LiveClass;
  fallbackCourseTitle?: string;
}

export function LiveClassCard({
  liveClass,
  fallbackCourseTitle,
}: LiveClassCardProps) {
  const startDate = new Date(liveClass.startsAt);
  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isUpcoming = liveClass.status === "SCHEDULED";
  const courseTitle = liveClass.course?.title || fallbackCourseTitle;

  return (
    <div className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          {courseTitle && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
              {courseTitle}
            </span>
          )}

          {isUpcoming ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Scheduled
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
              Completed
            </span>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white leading-snug mb-3">
          {liveClass.title}
        </h3>

        <div className="space-y-1.5 mb-5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-neutral-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formattedDate} • {formattedTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-neutral-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Duration: {liveClass.durationMinutes} mins</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-end">
        {isUpcoming ? (
          <button
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
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
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>Class Details</span>
          </button>
        ) : (
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 italic">
            Session finished
          </span>
        )}
      </div>
    </div>
  );
}
