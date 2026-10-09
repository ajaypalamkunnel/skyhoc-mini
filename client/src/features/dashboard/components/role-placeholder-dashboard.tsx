"use client";

import { useState } from "react";
import Link from "next/link";
import type { CurrentUser } from "@/features/auth/auth.types";
import { DashboardHeader } from "./dashboard-header";

export interface DashboardFeatureItem {
  title: string;
  description: string;
  icon: string;
  href?: string;
  statusLabel?: string;
  statusVariant?: "ready" | "soon";
}

interface RolePlaceholderDashboardProps {
  user: CurrentUser | null;
  roleTitle: string;
  roleBadge: string;
  description: string;
  featureList: DashboardFeatureItem[];
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
            {featureList.map((feature, idx) => {
              const isClickable = Boolean(feature.href);
              const CardContent = (
                <>
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base mb-4 transition-transform group-hover:scale-105">
                      {feature.icon}
                    </div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="text-base font-semibold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {feature.title}
                      </h3>
                      {isClickable && (
                        <span className="text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all text-sm font-semibold">
                          →
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                    <span>Status</span>
                    {feature.statusVariant === "ready" || isClickable ? (
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {feature.statusLabel || "Live & Ready"}
                      </span>
                    ) : (
                      <span className="font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-900/60">
                        {feature.statusLabel || "Coming Soon"}
                      </span>
                    )}
                  </div>
                </>
              );

              if (isClickable && feature.href) {
                return (
                  <Link
                    key={idx}
                    href={feature.href}
                    className="group p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-800/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    {CardContent}
                  </Link>
                );
              }

              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between"
                >
                  {CardContent}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
