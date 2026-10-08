import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign In | Skyhoch",
  description: "Sign in to your Skyhoch account to access your courses and dashboard.",
};

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </main>
  );
}
