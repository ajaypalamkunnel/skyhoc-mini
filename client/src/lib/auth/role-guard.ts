import { redirect } from "next/navigation";
import { getCurrentUser } from "./server-auth";
import {
  type UserRole,
  getRoleHomeRoute,
  isUserRole,
} from "@/features/auth/auth.roles";
import type { CurrentUser } from "@/features/auth/auth.types";

/**
 * Ensures user is authenticated on the server; redirects to /login if not.
 */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Ensures user is authenticated and possesses one of the allowed roles.
 * If user does not possess an allowed role, redirects them to their own role's home dashboard.
 */
export async function requireRole(
  allowedRoles: UserRole[],
): Promise<CurrentUser> {
  const user = await requireUser();

  const userRole = isUserRole(user.role) ? user.role : null;

  if (!userRole || !allowedRoles.includes(userRole)) {
    redirect(getRoleHomeRoute(user.role));
  }

  return user;
}
