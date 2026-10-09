export function AttendanceDisclaimer() {
  return (
    <div
      role="region"
      aria-label="Simulation Disclaimer"
      className="p-5 sm:p-6 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/60 shadow-sm"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-amber-900 dark:text-amber-200">
              Attendance Calculation Simulation
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-200/70 dark:bg-amber-900 text-amber-800 dark:text-amber-300">
              Testing & Demo Mode
            </span>
          </div>

          <p className="text-xs sm:text-sm text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
            This is a testing/demo simulation of the attendance calculation logic. It does not represent actual production attendance tracking.
          </p>

          <p className="text-xs text-amber-700 dark:text-amber-400/90 pt-1 font-medium">
            💡 In production, attendance events would be captured automatically from LiveKit during live classes.
          </p>
        </div>
      </div>
    </div>
  );
}
