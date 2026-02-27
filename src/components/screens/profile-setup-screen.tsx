"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ACTIVITY_LEVELS, type ActivityLevel } from "@/lib/bmr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type WeightUnit = "kg" | "lbs";
type HeightUnit = "cm" | "in";
type Gender = "male" | "female" | "other";

const ACTIVITY_ICONS: Record<ActivityLevel, string> = {
  1: "chair",
  2: "directions_walk",
  3: "jogging",
  4: "directions_run",
  5: "fitness_center",
};

export function ProfileSetupScreen() {
  const router = useRouter();
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [gender, setGender] = useState<Gender | null>("male");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(3);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If user already has a profile (returning user), send them to dashboard
  useEffect(() => {
    let cancelled = false;
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const hasProfile = data.dailyCalories != null || data.fullName != null;
        if (hasProfile) router.replace("/dashboard");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSubmit(e: React.FormEvent, skip: boolean) {
    if (e) e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (!skip) {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: fullName || undefined,
            age: age ? parseInt(age, 10) : undefined,
            weight: weight ? parseFloat(weight) : undefined,
            weightUnit,
            height: height ? parseFloat(height) : undefined,
            heightUnit,
            gender: gender ?? undefined,
            activityLevel,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok && res.status !== 200) {
          setError(data.error ?? "Failed to save profile");
          setSaving(false);
          return;
        }
      }
      router.push("/welcome");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

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
        <form id="profile-form" className="space-y-6" onSubmit={(e) => handleSubmit(e, false)}>
          {error && (
            <p className="text-center text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              placeholder="e.g. Alex Rivera"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Age</Label>
            <Input
              inputMode="numeric"
              placeholder="How old are you?"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
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
            <Input
              inputMode="decimal"
              placeholder="0.0"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
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
            <Input
              inputMode="decimal"
              placeholder="0.0"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
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
          {/* Activity Level */}
          <div className="space-y-4 pt-2">
            <Label className="ml-1">Activity Level</Label>
            <div className="space-y-6 px-2">
              <div className="relative">
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(Number(e.target.value) as ActivityLevel)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primary dark:bg-slate-800"
                />
                <div className="mt-2 flex w-full justify-between px-1 text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                  <span>Min</span>
                  <span>Max</span>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {ACTIVITY_LEVELS.map(({ level, label }) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setActivityLevel(level)}
                    className={`flex flex-col items-center gap-1 transition-opacity ${
                      activityLevel === level ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {ACTIVITY_ICONS[level]}
                    </span>
                    <span className="text-[9px] font-bold leading-tight text-center">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>
      </main>

      <footer className="fixed bottom-0 left-1/2 flex w-full max-w-[375px] -translate-x-1/2 flex-col gap-4 border-t border-slate-100 bg-background-light/90 p-6 backdrop-blur-lg dark:border-slate-800 dark:bg-background-dark/90 md:max-w-[420px]">
        <Button
          type="submit"
          form="profile-form"
          className="w-full"
          disabled={saving}
        >
          {saving ? "Saving…" : "Continue"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full py-2 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          disabled={saving}
          onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)}
        >
          Skip for now
        </Button>
      </footer>
      <div className="h-8 shrink-0" />
    </div>
  );
}
