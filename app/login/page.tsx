"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useActionState } from "react";
import { signInAction } from "@/app/auth/actions";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const resolvedParams = React.use(searchParams);
  const errorParam = resolvedParams.error;
  const [state, formAction, isPending] = useActionState(signInAction, null);
  const [showPassword, setShowPassword] = React.useState(false);

  const displayedError =
    state?.error ||
    (errorParam === "blocked"
      ? "Your administrator account has been blocked. Please contact a super admin."
      : null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-page-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-muted/30">
        
        {/* Brand/Logo Header */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative mb-4">
            <Image
              src="/cmhcb-mental-health-care.png"
              alt="CMHC,B Logo"
              fill
              sizes="64px"
              className="object-contain"
              priority
            />
          </div>
          <h2 className="font-marcellus text-2xl md:text-3xl text-dark-green text-center font-bold">
            Admin Portal Login
          </h2>
          <p className="mt-2 text-sm text-light-ash text-center font-sans">
            Center for Mental Health and Care, Bangladesh
          </p>
        </div>

        {/* Action Error Alert */}
        {displayedError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-sans flex items-start gap-2 shadow-sm animate-pulse">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <span>{displayedError}</span>
          </div>
        )}

        {/* Login Form */}
        <form action={formAction} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-light-ash font-sans">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isPending}
                className="mt-1 block w-full px-4 py-3 border border-muted rounded-xl text-sm font-sans shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-light/30 transition-all duration-200"
                placeholder="admin@cmhcb.org"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-light-ash font-sans">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary-dark font-sans transition-colors duration-200"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={isPending}
                  className="block w-full pl-4 pr-12 py-3 border border-muted rounded-xl text-sm font-sans shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-light/30 transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-light-ash/70 hover:text-dark focus:outline-none flex items-center justify-center cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <HiEyeSlash className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-primary/50 transition-all duration-200 cursor-pointer shadow-md font-sans"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Verifying credentials...</span>
                </div>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </div>
        </form>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-light-ash hover:text-dark transition-colors duration-200 font-sans"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
