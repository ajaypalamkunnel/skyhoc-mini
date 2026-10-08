import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/role-guard";
import { RolePlaceholderDashboard } from "@/features/dashboard/components/role-placeholder-dashboard";

export const metadata: Metadata = {
  title: "Tutor Dashboard | Skyhoch",
  description: "Manage your live tutoring sessions, student cohorts, and course schedules.",
};

export default async function TutorDashboardPage() {
  const user = await requireRole(["TUTOR"]);

  return (
    <RolePlaceholderDashboard
      user={user}
      roleTitle="Tutor"
      roleBadge="Tutor Portal"
      description="Manage your assigned German language teaching sessions, review live class attendance, and interact with your student cohorts."
      featureList={[
        {
          title: "My Teaching Schedule",
          description: "View and manage upcoming live webinars, 1-on-1 tutoring sessions, and batch lectures.",
          icon: "📅",
        },
        {
          title: "Student Roster & Attendance",
          description: "Mark attendance, track participation, and review student progress per course cohort.",
          icon: "👥",
        },
        {
          title: "Course Materials & Recordings",
          description: "Upload study materials, homework solutions, and publish session recordings.",
          icon: "📚",
        },
      ]}
    />
  );
}
