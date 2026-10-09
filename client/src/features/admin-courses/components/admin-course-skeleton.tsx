export function AdminCourseSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm animate-pulse flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800 shrink-0" />
            <div className="space-y-2 flex-1 max-w-md">
              <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-3 w-1/2 rounded bg-neutral-100 dark:bg-neutral-800/60" />
            </div>
          </div>
          <div className="w-20 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 shrink-0" />
        </div>
      ))}
    </div>
  );
}
