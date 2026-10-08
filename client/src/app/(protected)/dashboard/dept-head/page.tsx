import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/role-guard";
import { RolePlaceholderDashboard } from "@/features/dashboard/components/role-placeholder-dashboard";

export const metadata: Metadata = {
  title: "Department Head Dashboard | Skyhoc",
  description: "Curriculum oversight, faculty management, and student performance metrics.",
};

export default async function DepartmentHeadDashboardPage() {
  const user = await requireRole(["DEPARTMENT_HEAD"]);

  return (
    <RolePlaceholderDashboard
      user={user}
      roleTitle="Department Head"
      roleBadge="Department Head Portal"
      description="Oversee faculty assignments, review German language curriculum standards, and track department-wide student completion rates."
      featureList={[
        {
          title: "Faculty & Tutor Oversight",
          description: "Review tutor assignments, teaching hours, and student feedback evaluations.",
          icon: "🎓",
        },
        {
          title: "Curriculum & Course Approvals",
          description: "Approve newly created course modules, review lesson plans, and audit live classes.",
          icon: "📑",
        },
        {
          title: "Department Performance Analytics",
          description: "High-level visual reports on enrollment growth, drop-off rates, and certification metrics.",
          icon: "📊",
        },
      ]}
    />
  );
}
