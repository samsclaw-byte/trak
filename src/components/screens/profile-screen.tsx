"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function ProfileScreen() {
  return (
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[375px] flex-col overflow-x-hidden bg-background-light pb-20 dark:bg-background-dark sm:min-h-screen sm:rounded-2xl sm:shadow-2xl md:max-w-[420px]">
      <div className="flex items-center justify-between bg-white p-4 pt-6 dark:bg-slate-900/50">
        <Button
          variant="ghost"
          size="icon"
          className="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
          asChild
        >
          <Link href="/dashboard">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
        </Button>
        <h2 className="flex-1 text-center text-lg font-bold leading-tight">
          Profile
        </h2>
        <div className="flex size-10 items-center justify-end">
          <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">
            settings
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 p-6">
        <div className="relative">
          <div
            className="h-24 w-24 rounded-full border-4 border-white bg-cover bg-center bg-no-repeat shadow-sm dark:border-slate-800"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAyekimiaX5IRdUzEbpgrVSplBLoYXwP1imcJGxcLajetUOH6YiDT-v2qW5spTwJSZhbSYj35D5bE235R5-ylqApj6ydanpBWX8GgpLlwRUyH7ea8Tsv0WQPkYNWg5kGgLXfWarnQHJBxnoMIFaAyYf42jtnBrAMGWGXhiN0K6WGZpfFRZFTZnh_JfyAh6OE0nAOxr7Pz8rhYF4Nu-3C8cusVp43AqtOg1OozWZMo6K2I5V6pmALZFEY5Q6YmKOsOSGhCgugP1_Yw")`,
            }}
          />
          <div className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-primary p-1 text-white dark:border-slate-800">
            <span className="material-symbols-outlined block text-sm">edit</span>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight">Alex Traker</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Member since Jan 2024
          </p>
        </div>
      </div>

      <div className="px-4 py-2">
        <h3 className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Daily Target
        </h3>
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
          <button
            type="button"
            className="flex w-full items-center gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">
                local_fire_department
              </span>
            </div>
            <div className="flex flex-1 flex-col items-start">
              <p className="text-sm font-medium">Calorie Goal</p>
              <p className="text-xs font-bold text-primary">2,500 kcal</p>
            </div>
            <span className="material-symbols-outlined text-slate-400">
              edit
            </span>
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        <h3 className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Preferences
        </h3>
        <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex w-full items-center gap-4 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <span className="material-symbols-outlined">notifications</span>
            </div>
            <div className="flex flex-1 flex-col items-start">
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stay on track with alerts
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <button
            type="button"
            className="flex w-full items-center gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
              <span className="material-symbols-outlined">file_export</span>
            </div>
            <div className="flex flex-1 flex-col items-start">
              <p className="text-sm font-medium">Export Health Data</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Download CSV or JSON
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-400">
              chevron_right
            </span>
          </button>
        </div>
      </div>

      <div className="px-4 py-2">
        <h3 className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Support
        </h3>
        <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/40">
          <button
            type="button"
            className="flex w-full items-center gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-500/10 text-slate-500">
              <span className="material-symbols-outlined">help</span>
            </div>
            <p className="flex-1 text-left text-sm font-medium">Help Center</p>
            <span className="material-symbols-outlined text-slate-400">
              open_in_new
            </span>
          </button>
        </div>
      </div>

      <div className="px-4 py-8">
        <Button
          variant="outline"
          className="w-full gap-2 font-bold hover:border-red-100 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-900 dark:hover:bg-red-950"
        >
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </Button>
        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.2em] text-slate-400">
          Trak v2.4.0
        </p>
      </div>

      <div className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-[375px] -translate-x-1/2 items-center justify-between border-t border-slate-200 bg-white/80 px-4 pb-6 pt-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 md:max-w-[420px]">
        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-1 text-slate-400 transition-colors"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link
          href="/progress"
          className="flex flex-col items-center gap-1 text-slate-400 transition-colors"
        >
          <span className="material-symbols-outlined">bar_chart</span>
          <span className="text-[10px] font-medium">Stats</span>
        </Link>
        <Link
          href="/profile"
          className="flex flex-col items-center gap-1 text-primary transition-colors"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            person
          </span>
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </div>
    </div>
  );
}
