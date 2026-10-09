import type { Metadata } from "next";

import { AuthLayout } from "@/features/auth/components/auth-layout";
import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = {
  title: "Create Account | Skyhoch",
  description: "Create your Skyhoch student account to enroll in courses and attend interactive live classes.",
};

export default function SignupPage() {
  return (
    <AuthLayout mode="signup">
      <SignupForm />
    </AuthLayout>
  );
}
