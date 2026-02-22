"use client";

import Link from "next/link";

const barHeights = [80, 65, 95, 70, 85, 40, 55];
const days = ["M", "T", "W", "T", "F", "S", "S"];

export function ProgressScreen() {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-[375px] flex-col overflow-x-hidden bg-background-light shadow-2xl dark:bg-background-dark sm:min-h-screen sm:rounded-2xl md:max-w-[420px]">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background-light px-6 py-4 dark:bg-background-dark">
        <div className="flex items-center gap-3">
          <div className="size-10 overflow-hidden rounded-full border-2 border-primary/10 bg-primary/20">
            <img
              alt="User Profile"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY9iNJKFFUoWVfsir4xqNoiY30H9oFMtRpR6uBjiJ2c7dCFiHgf2UL66WU9CHhxBE9uQqERgKZ1xwy3k95Os3f44lDUYl8RrkbrYK6oDbKSqlTWUR2ZMs5zJQac9FALiREJ2incZbnD-Nozjp1QLW23QrjnKaxh0-GpJ2a-ANBw856U-ysB7FyU8PzwlABpDXMbo40OQpQGmgMLYFiF6N2CcSuLz_tw4r48zbAOWZU2llM70paLr36a3xjrir-GVPwuTPd1uSUzQ"
            />
          </div>
          <div>
            <h1 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Welcome back,
            </h1>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              Alex Johnson
            </p>
          </div>
        </div>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
            calendar_today
          </span>
        </button>
      </header>

      <main className="hide-scrollbar flex-1 space-y-6 overflow-y-auto px-6 pb-24">
        <section className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <span className="material-symbols-outlined fill-1 text-3xl text-primary">
                local_fire_department
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">14 Days</h2>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Current Streak
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-primary">+2 Days</p>
            <p className="text-[10px] text-slate-400">Personal Best: 21</p>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Daily Calories</h3>
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
              Target: 2,100
            </span>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex h-32 items-end justify-between gap-2">
              {barHeights.map((h, i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="relative w-full rounded-t-sm bg-primary/10"
                    style={{ height: `${h}%` }}
                  >
                    <div
                      className={`absolute inset-x-0 bottom-0 h-full rounded-t-sm ${
                        i === 2
                          ? "bg-primary shadow-[0_0_10px_rgba(16,183,127,0.3)]"
                          : "bg-primary/30"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      i === 2 ? "text-primary" : "text-slate-400"
                    }`}
                  >
                    {days[i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-slate-50 pt-4 dark:border-slate-700">
              <div>
                <p className="text-xs text-slate-500">Weekly Avg</p>
                <p className="text-lg font-bold">
                  1,850 <span className="text-xs font-normal">kcal</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Status</p>
                <p className="text-sm font-bold text-primary">On Track</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold">Macro Distribution</h3>
          <div className="flex items-center gap-6 rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="relative size-28 shrink-0">
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  className="stroke-slate-100 dark:stroke-slate-700"
                  cx="18"
                  cy="18"
                  fill="none"
                  r="16"
                  strokeWidth="4"
                />
                <circle
                  className="stroke-primary"
                  cx="18"
                  cy="18"
                  fill="none"
                  r="16"
                  strokeDasharray="40 100"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
                <circle
                  className="stroke-blue-400"
                  cx="18"
                  cy="18"
                  fill="none"
                  r="16"
                  strokeDasharray="30 100"
                  strokeDashoffset="-40"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
                <circle
                  className="stroke-amber-400"
                  cx="18"
                  cy="18"
                  fill="none"
                  r="16"
                  strokeDasharray="30 100"
                  strokeDashoffset="-70"
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold">100%</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {[
                { color: "bg-primary", label: "Protein", value: "40%" },
                { color: "bg-blue-400", label: "Carbs", value: "30%" },
                { color: "bg-amber-400", label: "Fats", value: "30%" },
              ].map(({ color, label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className={`size-2 rounded-full ${color}`} />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {label}
                    </span>
                  </div>
                  <span className="text-xs font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Weight Trend</h3>
            <span className="text-xs font-bold text-primary">
              Current: 72.5kg
            </span>
          </div>
          <div className="relative h-48 overflow-hidden rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="absolute inset-x-5 bottom-10 h-24">
              <svg
                className="h-full w-full"
                preserveAspectRatio="none"
                viewBox="0 0 100 40"
              >
                <defs>
                  <linearGradient
                    id="weightGrad"
                    x1="0%"
                    x2="0%"
                    y1="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#10b77f", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#10b77f", stopOpacity: 0 }}
                    />
                  </linearGradient>
                </defs>
                <path
                  className="text-primary"
                  d="M0,35 Q10,32 20,34 T40,25 T60,20 T80,15 T100,10"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                <path
                  d="M0,35 Q10,32 20,34 T40,25 T60,20 T80,15 T100,10 V40 H0 Z"
                  fill="url(#weightGrad)"
                  opacity="0.1"
                />
                <circle
                  className="text-primary"
                  cx="100"
                  cy="10"
                  fill="currentColor"
                  r="1.5"
                />
              </svg>
            </div>
            <div className="absolute inset-x-5 bottom-5 flex justify-between text-[10px] font-bold uppercase text-slate-400">
              <span>Oct 1</span>
              <span>Oct 8</span>
              <span>Oct 15</span>
              <span>Today</span>
            </div>
            <div className="flex gap-2">
              <span className="text-xs font-bold text-primary">-1.2kg</span>
              <span className="text-xs text-slate-400">this month</span>
            </div>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[375px] -translate-x-1/2 items-center justify-between border-t border-slate-200 bg-white/80 px-6 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 md:max-w-[420px]">
        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold uppercase">Home</span>
        </Link>
        <Link
          href="/log-meal"
          className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500"
        >
          <span className="material-symbols-outlined">edit_note</span>
          <span className="text-[10px] font-bold uppercase">Log</span>
        </Link>
        <Link
          href="/progress"
          className="flex flex-col items-center gap-1 text-primary"
        >
          <span className="material-symbols-outlined fill-1">bar_chart</span>
          <span className="text-[10px] font-bold uppercase">Trends</span>
        </Link>
        <Link
          href="/profile"
          className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500"
        >
          <span className="material-symbols-outlined">groups</span>
          <span className="text-[10px] font-bold uppercase">Social</span>
        </Link>
        <Link
          href="/profile"
          className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-bold uppercase">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
