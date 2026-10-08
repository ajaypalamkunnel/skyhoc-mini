export type UserRole = "STUDENT" | "TUTOR" | "DEPARTMENT_HEAD" | "SUPER_ADMIN";

export const ROLE_HOME_ROUTES: Record<UserRole, string> = {
  STUDENT: "/dashboard/student",
  TUTOR: "/dashboard/tutor",
  DEPARTMENT_HEAD: "/dashboard/dept-head",
  SUPER_ADMIN: "/dashboard/admin",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  STUDENT: "Student",
  TUTOR: "Tutor",
  DEPARTMENT_HEAD: "Department Head",
  SUPER_ADMIN: "Super Admin",
};

export function isUserRole(role: unknown): role is UserRole {
  return typeof role === "string" && role in ROLE_HOME_ROUTES;
}

export function getRoleHomeRoute(role?: string | null): string {
  if (role && isUserRole(role)) {
    return ROLE_HOME_ROUTES[role];
  }
  return "/dashboard/student";
}
