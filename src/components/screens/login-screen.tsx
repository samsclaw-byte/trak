"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RiveCtaButton } from "@/components/rive-cta-button";

const GOOGLE_CALLBACK_URL = "/dashboard";

export function LoginScreen() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.replace(GOOGLE_CALLBACK_URL);
    }
  }, [status, session, router]);

  async function handleGoogleSignIn() {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: GOOGLE_CALLBACK_URL });
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[375px] flex-col justify-between overflow-hidden bg-background-light px-6 py-12 dark:bg-background-dark sm:min-h-screen sm:rounded-2xl sm:shadow-2xl md:max-w-[420px]">
      {/* Top: Branding */}
      <div className="flex flex-col items-center justify-center pt-12 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-4xl">
          🥗
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Trak
        </h1>
        <p className="mt-3 max-w-[280px] font-display text-base font-medium leading-relaxed text-slate-600 dark:text-slate-400">
          Simple nutrition tracking for busy people
        </p>
      </div>

      {/* Middle: Visual */}
      <div className="relative flex flex-1 items-center justify-center py-8">
        <div className="absolute h-64 w-64 rounded-full bg-primary opacity-20 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-800">
            <span className="material-symbols-outlined text-2xl text-primary">
              restaurant
            </span>
          </div>
          <div className="ml-12 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-800">
            <span className="material-symbols-outlined text-2xl text-primary">
              bolt
            </span>
          </div>
          <div className="-ml-16 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-800">
            <span className="material-symbols-outlined text-2xl text-primary">
              schedule
            </span>
          </div>
        </div>
      </div>

      {/* Bottom: Actions */}
      <div className="space-y-6 pb-4">
        <RiveCtaButton
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? "Signing in…" : "Continue with Google"}
        </RiveCtaButton>
        {error && (
          <p className="text-center text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
        <div className="px-2">
          <p className="text-center text-[12px] leading-relaxed text-slate-500 dark:text-slate-500">
            By continuing, you agree to our{" "}
            <Link
              className="font-semibold text-primary/80 underline-offset-2 transition-colors hover:text-primary"
              href="#"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              className="font-semibold text-primary/80 underline-offset-2 transition-colors hover:text-primary"
              href="#"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="h-1.5 w-32 rounded-full bg-slate-300 dark:bg-slate-700" />
      </div>
    </div>
  );
}
