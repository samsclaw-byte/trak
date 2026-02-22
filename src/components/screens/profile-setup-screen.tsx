"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type WeightUnit = "kg" | "lbs";
type HeightUnit = "cm" | "in";
type Gender = "male" | "female" | "other";

export function ProfileSetupScreen() {
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [gender, setGender] = useState<Gender | null>("male");

  return (
    <div className="relative flex min-h-[100dvh] w-full max-w-[375px] flex-col overflow-x-hidden bg-background-light shadow-2xl dark:bg-background-dark sm:mx-auto sm:min-h-screen sm:rounded-2xl md:max-w-[420px]">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background-light/80 px-4 pb-2 pt-6 backdrop-blur-md dark:bg-background-dark/80">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">
                arrow_back
              </span>
            </Link>
          </Button>
          <h2 className="text-lg font-bold">Create your profile</h2>
          <div className="size-10" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Step 1 of 2
            </span>
            <span className="text-xs text-slate-500">50% Complete</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: "50%" }}
            />
          </div>
        </div>
      </div>

      <main className="flex-1 px-5 pb-32 pt-8">
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-extrabold leading-tight">
            Tell us about yourself
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            This information helps us personalize your tracking experience for
            better results.
          </p>
        </header>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input placeholder="e.g. Alex Rivera" type="text" />
          </div>
          <div className="space-y-2">
            <Label>Age</Label>
            <Input
              inputMode="numeric"
              placeholder="How old are you?"
              type="number"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <Label className="ml-0">Weight</Label>
              <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setWeightUnit("kg")}
                  className={`rounded-md px-3 py-1 text-xs font-bold ${weightUnit === "kg" ? "bg-white text-primary shadow-sm dark:bg-slate-700" : "text-slate-500"}`}
                >
                  kg
                </button>
                <button
                  type="button"
                  onClick={() => setWeightUnit("lbs")}
                  className={`rounded-md px-3 py-1 text-xs font-bold ${weightUnit === "lbs" ? "bg-white text-primary shadow-sm dark:bg-slate-700" : "text-slate-500"}`}
                >
                  lbs
                </button>
              </div>
            </div>
            <Input inputMode="decimal" placeholder="0.0" type="number" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <Label className="ml-0">Height</Label>
              <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setHeightUnit("cm")}
                  className={`rounded-md px-3 py-1 text-xs font-bold ${heightUnit === "cm" ? "bg-white text-primary shadow-sm dark:bg-slate-700" : "text-slate-500"}`}
                >
                  cm
                </button>
                <button
                  type="button"
                  onClick={() => setHeightUnit("in")}
                  className={`rounded-md px-3 py-1 text-xs font-bold ${heightUnit === "in" ? "bg-white text-primary shadow-sm dark:bg-slate-700" : "text-slate-500"}`}
                >
                  in
                </button>
              </div>
            </div>
            <Input inputMode="decimal" placeholder="0.0" type="number" />
          </div>
          <div className="space-y-3">
            <Label className="ml-1">Gender</Label>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { id: "male" as const, icon: "male", label: "Male" },
                  { id: "female" as const, icon: "female", label: "Female" },
                  { id: "other" as const, icon: "question_mark", label: "Other" },
                ] as const
              ).map(({ id, icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setGender(id)}
                  className={`flex h-20 flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all ${
                    gender === id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate-200 bg-white text-slate-500 hover:border-primary/50 dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  <span className="material-symbols-outlined">{icon}</span>
                  <span className="text-xs font-bold">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </form>
      </main>

      <footer className="fixed bottom-0 left-1/2 flex w-full max-w-[375px] -translate-x-1/2 flex-col gap-4 border-t border-slate-100 bg-background-light/90 p-6 backdrop-blur-lg dark:border-slate-800 dark:bg-background-dark/90 md:max-w-[420px]">
        <Button className="w-full" asChild>
          <Link href="/dashboard">Continue</Link>
        </Button>
        <Button variant="ghost" className="w-full py-2 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" asChild>
          <Link href="/dashboard">Skip for now</Link>
        </Button>
      </footer>
      <div className="h-8 shrink-0" />
    </div>
  );
}
