import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-neutral-950/70 border-b border-neutral-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-lg tracking-wider">S</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Skyhoc<span className="text-indigo-400">.</span>
            </span>
          </div>

          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center relative overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Next-Generation Student Learning Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Elevate Your Learning <br />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
              With Live Interaction
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Experience structured courses, interactive live classrooms, real-time attendance,
            and an intuitive student dashboard designed for mastery.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Create Student Account</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 hover:bg-neutral-900 text-neutral-200 font-semibold text-sm transition-all backdrop-blur-md active:scale-95"
            >
              Go to Dashboard
            </Link>
          </div>

          {/* Features Grid */}
          <div className="mt-20 sm:mt-28 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm hover:border-neutral-700/80 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">Enrolled Courses</h2>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Seamlessly browse your active subjects, syllabus materials, and structured module curricula.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm hover:border-neutral-700/80 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">Live Classes</h2>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Join scheduled live video rooms with instructors, participate in discussions, and ask questions.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm hover:border-neutral-700/80 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">Attendance Tracking</h2>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Automated attendance metrics and session logs keep your academic records transparent and accurate.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-neutral-800/60 py-8 text-center text-xs text-neutral-500">
        <p>&copy; {new Date().getFullYear()} Skyhoc Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
