import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/role-guard";
import { AdminCoursesView } from "@/features/admin-courses/components/admin-courses-view";

export const metadata: Metadata = {
  title: "Course Management | Super Admin Portal",
  description: "Inspect, search, and audit all active and archived language courses across the platform.",
};

export default async function AdminCoursesPage() {
  const user = await requireRole(["SUPER_ADMIN"]);

  return <AdminCoursesView user={user} />;
}
