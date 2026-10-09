import type { LiveClass } from "@/features/live-classes/live-classes.types";
import type { Course } from "@/features/courses/courses.types";

interface LiveClassSummaryProps {
  course: Course;
  liveClass: LiveClass;
}

export function LiveClassSummary({ course, liveClass }: LiveClassSummaryProps) {
  const startDate = new Date(liveClass.startsAt);
  const endDate = new Date(startDate.getTime() + liveClass.durationMinutes * 60 * 1000);

  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const startTimeStr = startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTimeStr = endDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Extract timezone name or display IST / local abbreviation
  const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isIST = timeZoneName.includes("Calcutta") || timeZoneName.includes("Kolkata");
  const displayTimeZone = isIST ? "IST (UTC+05:30)" : timeZoneName;

  const isScheduled = liveClass.status === "SCHEDULED";

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {course.title}
            </span>

            {isScheduled ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Scheduled Live Class
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                Completed Class
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {liveClass.title}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {course.description || "Interactive live session with your German language tutor."}
          </p>
        </div>

        {/* Duration badge */}
        <div className="px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-700/60 text-left sm:text-right shrink-0">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Session Duration</div>
          <div className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mt-0.5">
            {liveClass.durationMinutes} mins
          </div>
        </div>
      </div>

      {/* Class Schedule Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-xs sm:text-sm">
        <div className="p-3.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
          <div className="text-neutral-500 dark:text-neutral-400 text-xs mb-1 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Date
          </div>
          <div className="font-semibold text-neutral-900 dark:text-white">{formattedDate}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
          <div className="text-neutral-500 dark:text-neutral-400 text-xs mb-1 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Class Interval
          </div>
          <div className="font-semibold text-neutral-900 dark:text-white">
            {startTimeStr} – {endTimeStr}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-50/80 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
          <div className="text-neutral-500 dark:text-neutral-400 text-xs mb-1 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Timezone
          </div>
          <div className="font-semibold text-neutral-900 dark:text-white truncate" title={displayTimeZone}>
            {displayTimeZone}
          </div>
        </div>
      </div>
    </div>
  );
}
