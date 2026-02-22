"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const recent = [
  "Greek Yogurt",
  "Protein Shake",
  "Oatmeal",
  "Black Coffee",
  "Chicken Salad",
];

export function QuickAddMealScreen() {
  return (
    <div className="relative flex min-h-[100dvh] w-full max-w-[375px] flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-950 sm:mx-auto sm:min-h-screen sm:rounded-2xl md:max-w-[420px]">
      <header className="flex items-center justify-between px-6 pb-4 pt-8">
        <Button variant="ghost" size="icon" className="justify-start" asChild>
          <Link href="/dashboard">
            <span className="material-symbols-outlined text-2xl text-slate-900 dark:text-slate-100">
              arrow_back
            </span>
          </Link>
        </Button>
        <h1 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Log Meal
        </h1>
        <div className="w-10" />
      </header>

      <main className="flex flex-1 flex-col px-6 pt-4">
        <div className="flex-1">
          <Label
            htmlFor="meal-input"
            className="mb-4 block text-3xl font-bold leading-tight text-slate-900 dark:text-slate-100"
          >
            What did you eat?
          </Label>
          <div className="relative">
            <textarea
              id="meal-input"
              className="mb-8 min-h-[120px] w-full resize-none border-none bg-transparent p-0 text-xl font-medium placeholder-slate-300 focus:ring-0 dark:placeholder-slate-700"
              placeholder="e.g. Avocado toast with a poached egg..."
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-2 right-0 rounded-full p-2 text-primary hover:bg-primary/10"
            >
              <span className="material-symbols-outlined">mic</span>
            </Button>
          </div>
          <div className="mb-10">
            <Button
              variant="secondary"
              className="gap-3 rounded-xl bg-primary/10 font-bold text-primary hover:bg-primary/20 dark:bg-primary/20"
            >
              <span className="material-symbols-outlined">photo_camera</span>
              Add Photo
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Recently Added
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {recent.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rounded-full border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary dark:bg-slate-900 dark:text-slate-300"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white py-8 dark:bg-slate-950">
          <Button className="w-full gap-2 py-5 text-lg shadow-lg shadow-primary/30" asChild>
            <Link href="/dashboard">
              <span className="material-symbols-outlined">check_circle</span>
              Save Meal
            </Link>
          </Button>
          <div className="mt-6 flex justify-center gap-1.5">
            <div className="h-1 w-8 rounded-full bg-primary" />
            <div className="h-1 w-2 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-1 w-2 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </main>
      <div className="pointer-events-none absolute right-6 top-24 opacity-20">
        <span className="material-symbols-outlined text-6xl text-slate-200 dark:text-slate-800">
          restaurant
        </span>
      </div>
    </div>
  );
}
