"use client";

import { useState } from "react";
import type { CurrentUser } from "@/features/auth/auth.types";
import { DashboardHeader } from "./dashboard-header";

interface RolePlaceholderDashboardProps {
  user: CurrentUser | null;
  roleTitle: string;
  roleBadge: string;
  description: string;
  featureList: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export function RolePlaceholderDashboard({
  user,
  roleTitle,
  roleBadge,
  description,
  featureList,
}: RolePlaceholderDashboardProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col">
      {/* Top Header */}
      <DashboardHeader
        user={user}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1">
        {/* Role Welcome Hero Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm mb-8 relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {roleBadge}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Workspace Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Welcome, {user?.name || roleTitle}!
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Modules & Workspaces Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            Workspace Modules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featureList.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                  <span>Status</span>
                  <span className="font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-900/60">
                    Coming Soon
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
