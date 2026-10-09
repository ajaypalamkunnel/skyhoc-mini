"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/auth.store";

export function SignupForm() {
  const router = useRouter();
  const { signup, isLoading, error: storeError, clearError } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setLocalError("Full Name is required");
      return;
    }

    if (trimmedName.length < 2) {
      setLocalError("Full Name must be at least 2 characters");
      return;
    }

    if (!trimmedEmail) {
      setLocalError("Email address is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setLocalError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setLocalError("Password is required");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    try {
      await signup({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });

      router.replace("/login");
    } catch {
      // Store already sets user-friendly error message in state
    }
  };

  const errorMessage = localError || storeError;

  return (
    <div className="w-full max-w-md mx-auto bg-neutral-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-9 shadow-2xl shadow-black/80 border border-neutral-800/90 text-neutral-100">
      <div className="mb-7 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Create Account
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Get started with your student learning dashboard
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 p-3.5 rounded-2xl bg-red-950/40 border border-red-800/60 text-sm text-red-300 flex items-start gap-2.5 animate-in fade-in duration-200"
        >
          <svg
            className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="leading-snug">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-4.5">
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errorMessage) {
                setLocalError(null);
                clearError();
              }
            }}
            placeholder="John Doe"
            disabled={isLoading}
            className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-neutral-800 bg-neutral-950/70 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMessage) {
                setLocalError(null);
                clearError();
              }
            }}
            placeholder="you@domain.com"
            disabled={isLoading}
            className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-neutral-800 bg-neutral-950/70 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) {
                  setLocalError(null);
                  clearError();
                }
              }}
              placeholder="Min. 8 characters"
              disabled={isLoading}
              className="w-full pl-4 pr-11 py-2.5 sm:py-3 rounded-xl border border-neutral-800 bg-neutral-950/70 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errorMessage) {
                  setLocalError(null);
                  clearError();
                }
              }}
              placeholder="Re-enter your password"
              disabled={isLoading}
              className="w-full pl-4 pr-11 py-2.5 sm:py-3 rounded-xl border border-neutral-800 bg-neutral-950/70 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Student Account</span>
          )}
        </button>
      </form>

      <div className="mt-7 pt-6 border-t border-neutral-800/80 text-center text-sm text-neutral-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
