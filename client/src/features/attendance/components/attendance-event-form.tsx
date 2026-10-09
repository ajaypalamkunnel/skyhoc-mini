import { useState, useId } from "react";
import type { DraftAttendanceEvent, AttendanceEventType } from "../attendance.types";

interface AttendanceEventFormProps {
  classStartDate: Date;
  classEndDate: Date;
  events: DraftAttendanceEvent[];
  onEventsChange: (events: DraftAttendanceEvent[]) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  formError: string | null;
}

export function AttendanceEventForm({
  classStartDate,
  classEndDate,
  events,
  onEventsChange,
  onSubmit,
  isSubmitting,
  formError,
}: AttendanceEventFormProps) {
  const formId = useId();
  const [touchedIndices, setTouchedIndices] = useState<Record<number, boolean>>({});

  // Helper to convert "HH:mm" on classStartDate to a comparable timestamp
  const getEventDate = (timeStr: string): Date | null => {
    if (!timeStr) return null;
    const parts = timeStr.split(":");
    if (parts.length < 2) return null;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (isNaN(hours) || isNaN(minutes)) return null;

    const d = new Date(classStartDate);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  // Row-level validation
  const validateEvent = (
    index: number,
    timeStr: string,
    allEvents: DraftAttendanceEvent[],
  ): string | null => {
    if (!timeStr) {
      return "Event time is required.";
    }

    const eventDate = getEventDate(timeStr);
    if (!eventDate) {
      return "Invalid time format.";
    }

    if (
      eventDate.getTime() < classStartDate.getTime() ||
      eventDate.getTime() > classEndDate.getTime()
    ) {
      return "Event time must be within the live class interval.";
    }

    if (index > 0) {
      const prevDate = getEventDate(allEvents[index - 1].time);
      if (prevDate && eventDate.getTime() <= prevDate.getTime()) {
        return `Must be later than Event ${index} (${allEvents[index - 1].eventType}).`;
      }
    }

    return null;
  };

  const handleTimeChange = (index: number, newTime: string) => {
    setTouchedIndices((prev) => ({ ...prev, [index]: true }));
    const updated = events.map((ev, i) => {
      if (i === index) {
        return { ...ev, time: newTime };
      }
      return ev;
    });
    onEventsChange(updated);
  };

  const handleAddEvent = () => {
    const nextIndex = events.length;
    const nextType: AttendanceEventType = nextIndex % 2 === 0 ? "JOIN" : "LEAVE";
    const newId = `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    onEventsChange([
      ...events,
      {
        id: newId,
        eventType: nextType,
        time: "",
      },
    ]);
  };

  const handleRemoveEvent = (index: number) => {
    if (events.length <= 2) return;
    const filtered = events.filter((_, i) => i !== index);
    // Recalculate alternating eventTypes based on new indices
    const reindexed = filtered.map((ev, i) => ({
      ...ev,
      eventType: (i % 2 === 0 ? "JOIN" : "LEAVE") as AttendanceEventType,
    }));
    onEventsChange(reindexed);
  };

  // Check form validity
  const errors = events.map((ev, i) => validateEvent(i, ev.time, events));
  const hasErrors = errors.some((err) => err !== null);
  const hasIncompletePair = events.length < 2 || events.length % 2 !== 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all as touched
    const allTouched: Record<number, boolean> = {};
    events.forEach((_, i) => {
      allTouched[i] = true;
    });
    setTouchedIndices(allTouched);

    if (hasErrors || hasIncompletePair) {
      return;
    }

    onSubmit();
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      noValidate
      className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Event Simulator</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              Draft
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configure alternating JOIN and LEAVE timestamps to test backend calculation logic.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddEvent}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 rounded-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Event</span>
        </button>
      </div>

      {formError && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs sm:text-sm text-red-700 dark:text-red-400 flex items-start gap-2.5"
        >
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="font-semibold">Submission Failed</div>
            <div>{formError}</div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event, index) => {
          const rowError = touchedIndices[index] ? errors[index] : null;
          const isJoin = event.eventType === "JOIN";

          return (
            <div
              key={event.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                rowError
                  ? "bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/80"
                  : "bg-neutral-50/60 dark:bg-neutral-800/30 border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Event Label & Badge */}
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                      isJoin
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isJoin ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {event.eventType}
                  </span>
                </div>

                {/* Time Input & Remove Action */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex-1 sm:w-44">
                    <label
                      htmlFor={`event-time-${index}`}
                      className="sr-only"
                    >
                      Event {index + 1} {event.eventType} Time
                    </label>
                    <input
                      id={`event-time-${index}`}
                      type="time"
                      value={event.time}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                      onBlur={() =>
                        setTouchedIndices((prev) => ({ ...prev, [index]: true }))
                      }
                      disabled={isSubmitting}
                      className={`w-full px-3.5 py-2 text-sm font-medium rounded-xl bg-white dark:bg-neutral-900 border transition-all focus:outline-none focus:ring-2 disabled:opacity-50 ${
                        rowError
                          ? "border-red-400 focus:ring-red-500/20 text-red-900 dark:text-red-200"
                          : "border-neutral-200 dark:border-neutral-700 focus:ring-indigo-500/20 focus:border-indigo-500 text-neutral-900 dark:text-white"
                      }`}
                    />
                  </div>

                  {events.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEvent(index)}
                      disabled={isSubmitting}
                      aria-label={`Remove Event ${index + 1} (${event.eventType})`}
                      className="p-2 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Row error message */}
              {rowError && (
                <div className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1.5 pl-8 sm:pl-0">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{rowError}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sequence warning if odd number of events */}
      {events.length % 2 !== 0 && (
        <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            Attendance sessions should end with a <strong>LEAVE</strong> event. Please add a LEAVE time to complete the interval.
          </span>
        </div>
      )}

      {/* Form Actions */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
          Events will be validated and submitted to PostgreSQL before calculation.
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-xl transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Submitting Events...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Submit Events</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
