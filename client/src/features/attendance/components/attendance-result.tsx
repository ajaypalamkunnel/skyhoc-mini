import type { AttendanceDetail } from "../attendance.types";

interface AttendanceResultProps {
  attendance: AttendanceDetail;
  durationMinutes: number;
  onReset: () => void;
  isResetting: boolean;
  resetError: string | null;
}

export function AttendanceResult({
  attendance,
  durationMinutes,
  onReset,
  isResetting,
  resetError,
}: AttendanceResultProps) {
  const isPresent = attendance.status === "PRESENT";
  const formattedCalculatedAt = new Date(attendance.calculatedAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Attendance Result
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Calculated
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Backend AttendanceCalculatorService evaluation results based on recorded timestamps.
          </p>
        </div>

        {/* Status Badge */}
        <div
          className={`self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm sm:text-base font-extrabold tracking-wide uppercase shadow-sm ${
            isPresent
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
              : "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
          }`}
        >
          {isPresent ? (
            <>
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>PRESENT</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>ABSENT</span>
            </>
          )}
        </div>
      </div>

      {resetError && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs sm:text-sm text-red-700 dark:text-red-400 flex items-start gap-2.5"
        >
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="font-semibold">Reset Error</div>
            <div>{resetError}</div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Attended Minutes */}
        <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800">
          <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Total Attended
          </div>
          <div className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-white">
            {attendance.totalMinutes} <span className="text-sm font-semibold text-neutral-500">mins</span>
          </div>
          <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
            You attended {attendance.totalMinutes} of {durationMinutes} scheduled minutes.
          </div>
        </div>

        {/* Percentage */}
        <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800">
          <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Attendance Rate
          </div>
          <div className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-white">
            {attendance.attendancePercentage.toFixed(2)}%
          </div>
          <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
            Threshold: 70.00% required for PRESENT
          </div>
        </div>

        {/* Calculation Time */}
        <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800 sm:col-span-2 lg:col-span-1">
          <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Evaluated At
          </div>
          <div className="mt-2 text-sm font-bold text-neutral-900 dark:text-white truncate">
            {formattedCalculatedAt}
          </div>
          <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
            Server timestamp of evaluation
          </div>
        </div>
      </div>

      {/* Explanation Banner */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
          isPresent
            ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200"
            : "bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200"
        }`}
      >
        {isPresent ? (
          <p>
            🎉 <strong>Attendance Approved:</strong> Your total evaluated attendance rate of{" "}
            <strong>{attendance.attendancePercentage.toFixed(2)}%</strong> meets or exceeds the required{" "}
            <strong>70%</strong> participation criteria.
          </p>
        ) : (
          <p>
            ⚠️ <strong>Attendance Incomplete:</strong> Your attendance rate of{" "}
            <strong>{attendance.attendancePercentage.toFixed(2)}%</strong> is below the required{" "}
            <strong>70%</strong> threshold (minimum required:{" "}
            {Math.ceil(durationMinutes * 0.7)} minutes).
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
          Resetting clears both calculated records and simulated raw events atomically.
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={isResetting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-95 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isResetting ? (
            <>
              <svg className="animate-spin w-4 h-4 text-neutral-700 dark:text-neutral-300" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Resetting Demo...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset Demo</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
