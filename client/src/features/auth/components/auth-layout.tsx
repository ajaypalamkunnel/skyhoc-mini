import Link from "next/link";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  mode: "login" | "signup";
}

export function AuthLayout({ children, mode }: AuthLayoutProps) {
  const isLogin = mode === "login";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-neutral-950 text-neutral-100 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-500/15 blur-[130px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      {/* LEFT SIDE: Branding & Value Proposition (Desktop & Tablet Landscape) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 flex-col justify-between p-10 xl:p-14 relative z-10 border-r border-neutral-800/60 bg-neutral-950/60 backdrop-blur-md">
        {/* Top Header / Logo & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl tracking-wider">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Skyhoch<span className="text-indigo-400">.</span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors px-3 py-1.5 rounded-lg border border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-800/60"
          >
            <svg
              className="w-3.5 h-3.5"
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
            <span>Back to home</span>
          </Link>
        </div>

        {/* Center Content: Headline & Highlights */}
        <div className="my-auto py-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            {isLogin ? "Welcome Back to Skyhoch" : "Join Skyhoch Learning Platform"}
          </div>

          <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {isLogin ? (
              <>
                Elevate your education with{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
                  real-time classrooms
                </span>
              </>
            ) : (
              <>
                Start your journey to{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
                  interactive mastery
                </span>
              </>
            )}
          </h2>

          <p className="mt-4 text-sm xl:text-base text-neutral-400 leading-relaxed">
            Experience structured course curricula, attend live interactive video lectures, and keep track of your attendance and academic milestones with precision.
          </p>

          {/* Features Highlights */}
          <div className="mt-8 grid grid-cols-1 gap-4">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-neutral-900/50 border border-neutral-800/70 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.7}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Live Interactive Classes
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                  Join scheduled virtual classrooms, engage with tutors, and ask real-time questions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-neutral-900/50 border border-neutral-800/70 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.7}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Automated Attendance Tracking
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                  Transparent duration logs and participation metrics for comprehensive academic records.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-neutral-900/50 border border-neutral-800/70 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.7}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Course Modules & Resources
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                  Easily access enrolled subjects, syllabus materials, and past recording references.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Skyhoch Platform. All rights reserved.</p>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Live Classroom Network Active
          </span>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form Container (Responsive across all screens) */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 xl:p-14 relative z-10 overflow-y-auto">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="flex lg:hidden items-center justify-between mb-6 sm:mb-8 pt-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <span className="text-white font-bold text-base">S</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Skyhoch<span className="text-indigo-400">.</span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60"
          >
            <svg
              className="w-3.5 h-3.5"
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
            <span>Home</span>
          </Link>
        </div>

        {/* Centered Form Body */}
        <div className="my-auto flex justify-center w-full">
          {children}
        </div>

        {/* Mobile / Screen Footer */}
        <div className="lg:hidden mt-8 text-center text-xs text-neutral-500 pb-2">
          <p>© {new Date().getFullYear()} Skyhoch. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
