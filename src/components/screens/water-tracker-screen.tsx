"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const totalGlasses = 8;
const filledGlasses = 5;

export function WaterTrackerScreen() {
  return (
    <div className="flex min-h-[100dvh] w-full max-w-[375px] flex-col overflow-hidden bg-white dark:bg-slate-950 sm:mx-auto sm:min-h-screen sm:rounded-2xl sm:shadow-2xl md:max-w-[420px]">
      <header className="flex items-center justify-between p-6 pt-8">
        <div>
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Monday, May 15
          </h2>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Good Morning!
          </h1>
        </div>
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="material-symbols-outlined">notifications</span>
        </div>
      </header>

      <main className="flex-1 space-y-8 px-6">
        <div className="space-y-2 py-4 text-center">
          <div className="text-5xl font-black tracking-tighter text-primary">
            {filledGlasses}/{totalGlasses}
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
            glasses
          </div>
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            {(filledGlasses / totalGlasses) * 100}% of Daily Goal
          </span>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full overflow-hidden rounded-full bg-primary/20">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(filledGlasses / totalGlasses) * 100}%` }}
            />
          </div>
          <p className="text-center text-xs font-medium text-slate-500">
            Daily goal: {totalGlasses} glasses (2000ml)
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4 py-4">
          {Array.from({ length: totalGlasses }).map((_, i) => (
            <div
              key={i}
              className={`flex aspect-square items-center justify-center rounded-xl ${
                i < filledGlasses
                  ? "bg-primary text-white shadow-sm shadow-primary/20"
                  : "border-2 border-dashed border-primary/30 bg-primary/5 text-primary/40"
              }`}
            >
              <span
                className="material-symbols-outlined text-3xl"
                style={
                  i < filledGlasses
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {i < filledGlasses ? "water_full" : "water_drop"}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button className="flex flex-col gap-2 shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-2xl">add_circle</span>
            <span className="text-sm font-bold">+1 Glass</span>
          </Button>
          <Button
            variant="secondary"
            className="flex flex-col gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <span className="material-symbols-outlined text-2xl">
              keyboard_double_arrow_up
            </span>
            <span className="text-sm font-bold">+2 Glasses</span>
          </Button>
        </div>
        <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
          <p className="mb-1 text-center text-xs font-bold uppercase tracking-widest italic text-primary">
            Tip of the day
          </p>
          <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-400">
            Drinking water helps maintain the balance of body fluids.
          </p>
        </div>
      </main>
      <div className="h-24" />
      <nav className="fixed bottom-0 left-1/2 w-full max-w-[375px] -translate-x-1/2 border-t border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 sm:max-w-[420px]">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 text-primary"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              home
            </span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Home
            </span>
          </Link>
          <Link
            href="/progress"
            className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined">leaderboard</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Trends
            </span>
          </Link>
          <Link
            href="/log-meal"
            className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined">history</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Log
            </span>
          </Link>
          <Link
            href="/profile"
            className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Profile
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
