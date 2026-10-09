import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/server-auth";
import { getRoleHomeRoute } from "@/features/auth/auth.roles";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect(getRoleHomeRoute(user.role));
  }

  return <>{children}</>;
}
