import type { LiveClass } from "../live-classes.types";
import { LiveClassCard } from "./live-class-card";

interface LiveClassListProps {
  liveClasses: LiveClass[];
  statusFilter: "upcoming" | "completed";
}

export function LiveClassList({
  liveClasses,
  statusFilter,
}: LiveClassListProps) {
  if (liveClasses.length === 0) {
    return (
      <div className="text-center py-12 px-6 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4 text-neutral-500 dark:text-neutral-400">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-base font-medium text-neutral-900 dark:text-white mb-1">
          {statusFilter === "upcoming"
            ? "No upcoming live classes scheduled."
            : "No completed live classes yet."}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
          {statusFilter === "upcoming"
            ? "When your tutors schedule live learning sessions for your courses, they will appear right here."
            : "Your past attended and completed live class sessions will be archived here."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {liveClasses.map((liveClass) => (
        <LiveClassCard key={liveClass.id} liveClass={liveClass} />
      ))}
    </div>
  );
}
