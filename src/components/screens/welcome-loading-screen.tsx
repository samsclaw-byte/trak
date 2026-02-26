"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const REDIRECT_DELAY_MS = 2800;

export function WelcomeLoadingScreen() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }
    if (status !== "authenticated") return;

    const t = setTimeout(() => {
      router.replace("/dashboard");
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(t);
  }, [status, router]);

  return (
    <div className="relative flex min-h-[100dvh] w-full max-w-[375px] flex-col items-center justify-center overflow-hidden bg-background-light px-6 dark:bg-background-dark sm:mx-auto sm:min-h-screen sm:rounded-2xl sm:shadow-2xl md:max-w-[420px]">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated icon */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin-slow" />
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <span className="material-symbols-outlined text-4xl text-primary animate-pulse">
              restaurant
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">
            Setting up your plan
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            We&apos;ve saved your profile and calculated your daily goals.
          </p>
        </div>

        {/* Dots animation */}
        <div className="flex gap-2" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
