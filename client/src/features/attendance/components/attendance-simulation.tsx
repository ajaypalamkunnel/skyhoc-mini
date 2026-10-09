"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import type { CurrentUser } from "@/features/auth/auth.types";
import type { Course } from "@/features/courses/courses.types";
import type { LiveClass } from "@/features/live-classes/live-classes.types";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { attendanceService } from "../attendance.service";
import type {
  AttendanceDetail,
  AttendanceEvent,
  DraftAttendanceEvent,
} from "../attendance.types";
import { AttendanceDisclaimer } from "./attendance-disclaimer";
import { LiveClassSummary } from "./live-class-summary";
import { AttendanceEventForm } from "./attendance-event-form";
import { AttendanceEventList } from "./attendance-event-list";
import { AttendanceResult } from "./attendance-result";

interface AttendanceSimulationProps {
  user: CurrentUser | null;
  course: Course;
  liveClass: LiveClass;
  initialAttendance: AttendanceDetail | null;
  initialEvents: AttendanceEvent[];
}

export function AttendanceSimulation({
  user,
  course,
  liveClass,
  initialAttendance,
  initialEvents,
}: AttendanceSimulationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core state derived from backend data
  const [attendance, setAttendance] = useState<AttendanceDetail | null>(initialAttendance);
  const [submittedEvents, setSubmittedEvents] = useState<AttendanceEvent[]>(initialEvents);

  // Parse start and end dates
  const classStartDate = useMemo(() => new Date(liveClass.startsAt), [liveClass.startsAt]);
  const classEndDate = useMemo(
    () => new Date(classStartDate.getTime() + liveClass.durationMinutes * 60 * 1000),
    [classStartDate, liveClass.durationMinutes],
  );

  // Helper to format Date into "HH:mm"
  const formatTimeHHMM = (d: Date): string => {
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Helper to create sensible default draft events
  const createDefaultDraftEvents = (): DraftAttendanceEvent[] => {
    const joinDate = new Date(classStartDate.getTime() + 10 * 60 * 1000); // 10 mins after start
    const leaveDate = new Date(classStartDate.getTime() + 40 * 60 * 1000); // 40 mins after start

    return [
      {
        id: "draft-1",
        eventType: "JOIN",
        time: formatTimeHHMM(joinDate),
      },
      {
        id: "draft-2",
        eventType: "LEAVE",
        time: formatTimeHHMM(leaveDate),
      },
    ];
  };

  // Local interaction state
  const [draftEvents, setDraftEvents] = useState<DraftAttendanceEvent[]>(createDefaultDraftEvents);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const [calculateError, setCalculateError] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  // UI STATE MACHINE
  // STATE 1 — EDITING: attendance === null && submittedEvents.length === 0
  // STATE 2 — EVENTS SUBMITTED: attendance === null && submittedEvents.length > 0
  // STATE 3 — CALCULATED: attendance !== null
  const isEditingState = attendance === null && submittedEvents.length === 0;
  const isEventsSubmittedState = attendance === null && submittedEvents.length > 0;
  const isCalculatedState = attendance !== null;

  // Convert "HH:mm" on classStartDate into ISO string
  const convertTimeToISO = (timeStr: string): string => {
    const [h, m] = timeStr.split(":").map((v) => parseInt(v, 10));
    const d = new Date(classStartDate);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };

  // Handle Event Submission
  const handleSubmitEvents = async () => {
    try {
      setIsSubmitting(true);
      setFormError(null);

      // Submit all events sequentially to preserve order
      for (const ev of draftEvents) {
        const isoTimestamp = convertTimeToISO(ev.time);
        const res = await attendanceService.createAttendanceEvent({
          liveClassId: liveClass.id,
          eventType: ev.eventType,
          eventAt: isoTimestamp,
        });

        if (!res.success) {
          throw new Error(res.message || "Failed to record attendance event");
        }
      }

      // Refresh persisted events directly from database
      const eventsRes = await attendanceService.getAttendanceEvents(liveClass.id);
      if (eventsRes.success && eventsRes.data) {
        setSubmittedEvents(eventsRes.data.events);
      } else {
        throw new Error(eventsRes.message || "Failed to load submitted events");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while submitting events.";
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Calculate Attendance
  const handleCalculateAttendance = async () => {
    try {
      setIsCalculating(true);
      setCalculateError(null);

      const res = await attendanceService.calculateAttendance(liveClass.id);
      if (res.success && res.data) {
        setAttendance(res.data.attendance);
      } else {
        throw new Error(res.message || "Failed to calculate attendance");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while calculating attendance.";
      setCalculateError(errorMessage);
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle Reset Demo
  const handleResetDemo = async () => {
    try {
      setIsResetting(true);
      setResetError(null);

      const res = await attendanceService.resetAttendance(liveClass.id);
      if (res.success) {
        setAttendance(null);
        setSubmittedEvents([]);
        setDraftEvents(createDefaultDraftEvents());
        setFormError(null);
        setCalculateError(null);
      } else {
        throw new Error(res.message || "Failed to reset attendance demo");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while resetting attendance.";
      setResetError(errorMessage);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col">
      {/* Top Header */}
      <DashboardHeader
        user={user}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 space-y-6">
        {/* Navigation Breadcrumb / Back to Course */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/dashboard/courses/${course.id}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 cursor-pointer"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to {course.title}</span>
          </Link>

          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            Live Class #{liveClass.id}
          </div>
        </div>

        {/* 1. Simulation Disclaimer Card */}
        <AttendanceDisclaimer />

        {/* 2. Live Class Summary Card */}
        <LiveClassSummary course={course} liveClass={liveClass} />

        {/* 3. Primary State Dynamic Section */}

        {/* STATE 1: EDITING (No attendance calculated and no events submitted yet) */}
        {isEditingState && (
          <AttendanceEventForm
            classStartDate={classStartDate}
            classEndDate={classEndDate}
            events={draftEvents}
            onEventsChange={setDraftEvents}
            onSubmit={handleSubmitEvents}
            isSubmitting={isSubmitting}
            formError={formError}
          />
        )}

        {/* STATE 2: EVENTS SUBMITTED (Events persisted in DB, ready for Calculate Attendance) */}
        {isEventsSubmittedState && (
          <AttendanceEventList
            events={submittedEvents}
            onCalculate={handleCalculateAttendance}
            isCalculating={isCalculating}
            onReset={handleResetDemo}
            isResetting={isResetting}
            calculateError={calculateError}
          />
        )}

        {/* STATE 3: CALCULATED (Attendance record evaluated, shows result and Reset Demo) */}
        {isCalculatedState && attendance && (
          <AttendanceResult
            attendance={attendance}
            durationMinutes={liveClass.durationMinutes}
            onReset={handleResetDemo}
            isResetting={isResetting}
            resetError={resetError}
          />
        )}
      </main>
    </div>
  );
}
