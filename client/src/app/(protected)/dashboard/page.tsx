import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server-auth";
import { getRoleHomeRoute } from "@/features/auth/auth.roles";

/**
 * Root Dashboard Entry Dispatcher:
 * Inspects authenticated user's role and immediately redirects to their dedicated role workspace:
 * - STUDENT         -> /dashboard/student
 * - TUTOR           -> /dashboard/tutor
 * - DEPARTMENT_HEAD -> /dashboard/dept-head
 * - SUPER_ADMIN     -> /dashboard/admin
 */
export default async function DashboardRootDispatcher() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const roleHome = getRoleHomeRoute(user.role);
  redirect(roleHome);
}