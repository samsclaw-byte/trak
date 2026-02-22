"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

// Rive editor: https://editor.rive.app/file/trak-logo-2/2080458
// Set NEXT_PUBLIC_RIVE_CTA_URL to your .riv path (e.g. /trak-logo.riv) after adding the file to public/
// When unset, the Google icon is shown so the app works without a .riv file.
const RIVE_SRC =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_RIVE_CTA_URL
    ? process.env.NEXT_PUBLIC_RIVE_CTA_URL
    : null;

const Rive = dynamic(
  () => import("@rive-app/react-webgl2").then((m) => m.default),
  { ssr: false }
);

const baseClass =
  "group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-white px-5 py-4 text-base font-bold text-slate-900 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700";

/** Catches Rive load errors (missing/corrupt file) so we can show the Google icon fallback */
class RiveErrorBoundary extends React.Component<
  { fallback: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("Rive animation failed to load, using fallback:", error);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function RiveIcon({ src, onError }: { src: string; onError: () => void }) {
  const fallback = (
    <span className="flex h-6 w-6 items-center justify-center">
      <GoogleIcon />
    </span>
  );
  return (
    <RiveErrorBoundary fallback={fallback} onError={onError}>
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center [&_canvas]:max-h-8 [&_canvas]:max-w-8">
        <Rive src={src} className="h-8 w-8" />
      </span>
    </RiveErrorBoundary>
  );
}

export function RiveCtaButton({
  children = "Continue with Google",
  className,
  href,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: string }) {
  const [riveError, setRiveError] = useState(false);
  const handleRiveError = useCallback(() => setRiveError(true), []);

  const showRive = !riveError && RIVE_SRC;
  const content = (
    <>
      {showRive ? (
        <RiveIcon src={RIVE_SRC} onError={handleRiveError} />
      ) : (
        <span className="flex h-6 w-6 items-center justify-center">
          <GoogleIcon />
        </span>
      )}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(baseClass, className)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(baseClass, className)}
      {...props}
    >
      {content}
    </button>
  );
}
