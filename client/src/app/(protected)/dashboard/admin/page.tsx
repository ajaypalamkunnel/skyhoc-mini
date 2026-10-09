import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/role-guard";
import { RolePlaceholderDashboard } from "@/features/dashboard/components/role-placeholder-dashboard";

export const metadata: Metadata = {
  title: "Super Admin Dashboard | Skyhoch",
  description: "Platform settings, user access control, and system administration.",
};

export default async function SuperAdminDashboardPage() {
  const user = await requireRole(["SUPER_ADMIN"]);

  return (
    <RolePlaceholderDashboard
      user={user}
      roleTitle="Super Admin"
      roleBadge="Super Admin Portal"
      description="Full administrative access to manage platform users, role assignments, system logs, and global configuration."
      featureList={[
        {
          title: "Course Management",
          description: "Audit, search, and inspect all active and archived language courses across the platform.",
          icon: "📚",
          href: "/dashboard/admin/courses",
          statusLabel: "Live Module",
          statusVariant: "ready",
        },
        {
          title: "User Management & RBAC",
          description: "Create, invite, promote, or deactivate user accounts across Student, Tutor, and Staff roles.",
          icon: "🛡️",
          statusLabel: "Coming Soon",
          statusVariant: "soon",
        },
        {
          title: "Platform Configuration",
          description: "Manage global platform settings, payment gateways, and notification integrations.",
          icon: "⚙️",
          statusLabel: "Coming Soon",
          statusVariant: "soon",
        },
        {
          title: "System Audit Logs",
          description: "Inspect API traffic, security events, and administrative audit trails in real time.",
          icon: "📈",
          statusLabel: "Coming Soon",
          statusVariant: "soon",
        },
      ]}
    />
  );
}
