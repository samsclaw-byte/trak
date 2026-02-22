"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const meals = [
  {
    id: "breakfast",
    title: "Breakfast",
    time: "08:30 AM",
    desc: "Oatmeal with Blueberries",
    kcal: "350 kcal",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9qBpQDMlM1zDj3OE8kpOr91zwkFKTCEazuVPvDEL5mPUaaTCZecGLOYZHa1uZop0gnDVcU-4GWjcY61z7KX0NP_NIEbSd4VYQ2cqXGX7h_6GlMaHfXaJRDBBIPA5zfhS8UZ-6fJHi8FHpI6bRAf-2yeCIBphoTXCmVqlupvCzuuJDlbJGazYsR5CIgGr_3-i-1tpszFiFumiVgjsTncS-9MO7Cyeb-mw3kLM5JQitVRMMons8x6xnJq4sIEhnq0GIiTIpoHldeA",
  },
  {
    id: "lunch",
    title: "Lunch",
    time: "12:45 PM",
    desc: "Grilled Chicken Salad",
    kcal: "520 kcal",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjcRwlISVrmq7DvPOXP9koZHOObpI68jSFMC-1jCnVXF5URY04_n8bgnX1OXB6Qg45CYmIeXb4xzgKrCWRoEQ1NnIRMQq5ANRgUsSSWCNW0WE_qBhtW2U2KbXFRvqiMyOLGAots_QgJUp_JPYr-kM2Bhkp3kF7I-mrz8Rnq0jNZLS86eGy-6FRc1tjBb0wgJ1rW5WINv0Wtl3t-mBOPsT_ciWAAXyD4G3rO6susA_4Z2FDUv-rhXVzVqm5VK9RaPtpeLuUNvi8SQ",
  },
  {
    id: "snacks",
    title: "Snacks",
    time: "03:15 PM",
    desc: "Apple",
    kcal: "95 kcal",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDVuCqMY1blPOwGWZfsvPTh-tygaZ0KRUoNm8yfqH-VaWRptOrCM5txInPV_Zkypv9gghLSTQS3chnQIydCWvkr6jK9JXqZWLF3oX35XuBnYjQZIFpV0RYt0X0ZjnyACsDNoUH4WVk6zacffVsqsCKBYWMdzIFSE52QS2qkAWy9EW5G398aEcTFzixCkeWReu89oujqDkmj0cedCcj2on1C-PifSn9WBt_JmaC0b2Hn_mkHxI0NJ4qm4kwcMxhxVpGcuDV-3pJwoA",
  },
];

export function DashboardScreen() {
  return (
    <div className="min-h-[100dvh] w-full max-w-[375px] bg-background-light dark:bg-background-dark sm:mx-auto sm:min-h-screen sm:rounded-2xl sm:shadow-2xl md:max-w-[420px]">
      <header className="flex items-center justify-between p-6 pt-8">
        <div className="flex items-center gap-3">
          <div className="size-12 overflow-hidden rounded-full border-2 border-primary/20">
            <img
              alt="Profile"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUtjGM8_b8uXgMEOvQnW3EqtF265dg_rekFATnvC3zax073U8lBAiCUdOq5PQxAS2n1PgjI9OdxuPdfREr9FV1ch5r4uhsehD-1l5CORLG3iIs45XT_DOEWgh2npq5nCvGk_-Ln6MjHueFBf2v1tgNmNSNh-UA68PXH2p_I7533KT_8rAel978iY_78V0xyu-NGBwh92K6qeyEP9dC6X7uyNTQwcgU6Ldz8Lj1jQanclQAkuVdXMMrqAl8fGZfgFpDkQUsg5MmCA"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Good morning,
            </p>
            <h1 className="text-xl font-bold">Alex Johnson</h1>
          </div>
        </div>
        <Button variant="secondary" size="icon">
          <span className="material-symbols-outlined">notifications</span>
        </Button>
      </header>

      <main className="px-6 pb-24">
        <section className="mb-8 flex flex-col items-center rounded-xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div
            className="calorie-ring relative mb-6 flex size-48 items-center justify-center rounded-full"
            style={{ "--progress": "65%" } as React.CSSProperties}
          >
            <div className="z-10 text-center">
              <span className="block text-3xl font-bold text-slate-900 dark:text-white">
                1,450
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                / 2,200 kcal
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">
              65% of daily goal
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Keep going, you&apos;re doing great!
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold">Today&apos;s Meals</h2>
            <Link
              href="/meals"
              className="text-sm font-semibold text-primary"
            >
              View All
            </Link>
          </div>
          {meals.map((meal) => (
            <Card
              key={meal.id}
              className="flex items-center gap-4 p-4"
            >
              <div className="size-14 overflow-hidden rounded-lg bg-slate-100">
                <img
                  alt={meal.title}
                  className="h-full w-full object-cover"
                  src={meal.image}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {meal.title}
                  </h3>
                  <span className="text-xs text-slate-400">{meal.time}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {meal.desc}
                </p>
                <p className="mt-1 text-sm font-semibold text-primary">
                  {meal.kcal}
                </p>
              </div>
            </Card>
          ))}
          {/* Dinner empty */}
          <Card className="flex items-center gap-4 border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex size-14 items-center justify-center rounded-lg bg-slate-200 text-slate-400 dark:bg-slate-700">
              <span className="material-symbols-outlined">restaurant</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-400 dark:text-slate-500">
                Dinner
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Not logged yet
              </p>
            </div>
            <Button size="icon-sm" className="rounded-full bg-primary/10 text-primary" asChild>
              <Link href="/log-meal">
                <span className="material-symbols-outlined text-lg">add</span>
              </Link>
            </Button>
          </Card>
        </section>
      </main>

      <Button
        size="icon-lg"
        className="fixed bottom-24 right-6 z-50 rounded-full shadow-lg shadow-primary/40 transition-transform active:scale-90 sm:right-8"
        asChild
      >
        <Link href="/log-meal">
          <span className="material-symbols-outlined text-3xl">add</span>
        </Link>
      </Button>

      <nav className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-[375px] -translate-x-1/2 items-center justify-between border-t border-slate-100 bg-white/80 px-6 py-3 pb-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 md:max-w-[420px]">
        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-1 text-primary"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            dashboard
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Dashboard
          </span>
        </Link>
        <Link
          href="/meals"
          className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-primary"
        >
          <span className="material-symbols-outlined">restaurant_menu</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Meals
          </span>
        </Link>
        <Link
          href="/progress"
          className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-primary"
        >
          <span className="material-symbols-outlined">query_stats</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Progress
          </span>
        </Link>
        <Link
          href="/profile"
          className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-primary"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Profile
          </span>
        </Link>
      </nav>
    </div>
  );
}
