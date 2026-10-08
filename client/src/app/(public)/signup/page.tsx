import type { Metadata } from "next";

import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = {
  title: "Create Account | Skyhoch",
  description: "Create your Skyhoch account to enroll in courses and attend live classes.",
};

export default function SignupPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignupForm />
    </main>
  );
}
