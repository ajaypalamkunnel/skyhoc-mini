"use client";

import React from "react";

export type DashboardTab = "courses" | "live-classes" | "overview";

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  courseCount: number;
  liveClassCount: number;
  isMobileDrawerOpen: boolean;
  onCloseMobileDrawer: () => void;
}

export function DashboardSidebar({
  activeTab,
  onSelectTab,
  courseCount,
  liveClassCount,
  isMobileDrawerOpen,
  onCloseMobileDrawer,
}: DashboardSidebarProps) {
  const menuItems = [
    {
      id: "courses" as DashboardTab,
      label: "Enrolled Courses",
      badge: courseCount,
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      id: "live-classes" as DashboardTab,
      label: "Live Classes",
      badge: liveClassCount,
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "overview" as DashboardTab,
      label: "Student Overview",
      badge: null,
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
  ];

  const handleSelect = (tab: DashboardTab) => {
    onSelectTab(tab);
    onCloseMobileDrawer();
  };

  const navContent = (
    <nav className="space-y-1.5 p-3">
      <div className="px-3 py-2 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
        Main Menu
      </div>
      {menuItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSelect(item.id)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              isActive
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/25"
                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.badge !== null && item.badge > 0 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-2 shadow-sm">
          {navContent}
        </div>
      </aside>

      {/* Mobile Slide-Out Drawer */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            onClick={onCloseMobileDrawer}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-neutral-900 h-full shadow-2xl p-4 flex flex-col justify-between border-r border-neutral-200 dark:border-neutral-800 z-10">
            <div>
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-base font-bold text-neutral-900 dark:text-white">
                  Dashboard Menu
                </span>
                <button
                  type="button"
                  onClick={onCloseMobileDrawer}
                  className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {navContent}
            </div>

            <div className="p-3 text-center text-xs text-neutral-400 dark:text-neutral-500 border-t border-neutral-200 dark:border-neutral-800">
              Skyhoc Platform • v1.0
            </div>
          </div>
        </div>
      )}
    </>
  );
}
