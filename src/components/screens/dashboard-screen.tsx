"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const MEAL_TYPES = [
  { id: "breakfast" as const, label: "Breakfast" },
  { id: "lunch" as const, label: "Lunch" },
  { id: "dinner" as const, label: "Dinner" },
  { id: "snack" as const, label: "Snack" },
];

type MealItem = {
  id: number;
  mealType: string;
  description: string;
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
  sugars: number;
  fibre: number;
  createdAt: string;
};

type Profile = { fullName: string | null; dailyCalories: number | null; bmr: number | null };

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardScreen() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("dinner");
  const [mealInput, setMealInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const fetchProfile = useCallback(async () => {
    const res = await fetch("/api/profile");
    if (res.ok) {
      const data = await res.json();
      setProfile({ fullName: data.fullName ?? null, dailyCalories: data.dailyCalories ?? null, bmr: data.bmr ?? null });
    }
  }, []);

  const fetchMeals = useCallback(async () => {
    const res = await fetch("/api/meals?date=" + new Date().toISOString().slice(0, 10));
    if (res.ok) {
      const data = await res.json();
      setMeals(data.meals ?? []);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchMeals();
  }, [fetchProfile, fetchMeals]);

  const consumed = meals.reduce((s, m) => s + m.calories, 0);
  const daily = profile?.dailyCalories ?? 2200;
  const pct = daily > 0 ? Math.min(100, (consumed / daily) * 100) : 0;
  const overPct = consumed > daily ? Math.min(100, ((consumed - daily) / daily) * 100) : 0;
  // When over: show green up to (100 - overPct)%, then red for the last overPct% so the ring "overflows" in red
  const ringGreen = consumed > daily ? `${100 - overPct}%` : `${pct}%`;
  const ringRedEnd = consumed > daily ? "100%" : `${pct}%`;

  const handleAddMeal = async () => {
    const desc = mealInput.trim();
    if (!desc || adding) return;
    setAdding(true);
    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealType: selectedMealType, description: desc }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.meal) {
        setMeals((prev) => [...prev, { ...data.meal, fat: data.meal.fat ?? 0, protein: data.meal.protein ?? 0, carbs: data.meal.carbs ?? 0, sugars: data.meal.sugars ?? 0, fibre: data.meal.fibre ?? 0 }]);
        setMealInput("");
      } else {
        alert(data.error || "Failed to add meal");
      }
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch("/api/meals/" + id, { method: "DELETE" });
    if (res.ok) setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const handleEditStart = (m: MealItem) => {
    setEditId(m.id);
    setEditValue(m.description);
  };
  const handleEditSave = async () => {
    if (editId == null) return;
    const res = await fetch("/api/meals/" + editId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: editValue.trim() }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.meal) setMeals((prev) => prev.map((m) => (m.id === editId ? { ...m, ...data.meal } : m)));
      setEditId(null);
    }
  };
  const handleEditCancel = () => {
    setEditId(null);
    setEditValue("");
  };

  const mealsByType = MEAL_TYPES.map(({ id }) => ({
    type: id,
    label: id.charAt(0).toUpperCase() + id.slice(1),
    items: meals.filter((m) => m.mealType === id),
  }));

  return (
    <div className="min-h-[100dvh] w-full max-w-[375px] bg-background-light dark:bg-background-dark sm:mx-auto sm:min-h-screen sm:rounded-2xl sm:shadow-2xl md:max-w-[420px]">
      <header className="flex items-center justify-between p-6 pt-8">
        <div className="flex items-center gap-3">
          <div className="size-12 overflow-hidden rounded-full border-2 border-primary/20 bg-slate-200">
            {session?.user?.image && (
              <img alt="Profile" className="h-full w-full object-cover" src={session.user.image} />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{getGreeting()},</p>
            <h1 className="text-xl font-bold">
              {profile?.fullName || session?.user?.name || "User"}
            </h1>
          </div>
        </div>
        <Button variant="secondary" size="icon">
          <span className="material-symbols-outlined">notifications</span>
        </Button>
      </header>

      <main className="px-6 pb-24">
        {/* Hero Calorie ring */}
        <section className="mb-8 flex flex-col items-center rounded-xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div
            className="calorie-ring relative mb-6 flex size-48 items-center justify-center rounded-full"
            style={
              {
                "--progress-green": ringGreen,
                "--progress-red-end": ringRedEnd,
              } as React.CSSProperties
            }
          >
            <div className="z-10 text-center">
              <span className="block text-3xl font-bold text-slate-900 dark:text-white">
                {consumed.toLocaleString()}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                / {daily.toLocaleString()} kcal
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">
              {consumed <= daily
                ? `${Math.round(pct)}% of daily goal`
                : `${Math.round(overPct)}% over goal`}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {consumed <= daily ? "Keep going, you're doing great!" : "Consider adjusting tomorrow's intake."}
            </p>
          </div>
        </section>

        {/* Add Meal */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">Add meal</h2>
          <div className="mb-3 flex gap-2">
            {MEAL_TYPES.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedMealType(id)}
                className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                  selectedMealType === id
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Avocado toast with a poached egg"
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddMeal()}
              className="flex-1"
            />
            <Button onClick={handleAddMeal} disabled={adding || !mealInput.trim()}>
              {adding ? "Adding…" : "Add Meal"}
            </Button>
          </div>
        </section>

        {/* Today's Meals */}
        <section className="space-y-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold">Today&apos;s Meals</h2>
            <Link href="/meals" className="text-sm font-semibold text-primary">
              View All
            </Link>
          </div>

          {mealsByType.map(({ type, label, items }) => (
            <Card
              key={type}
              className={
                items.length
                  ? "flex flex-col gap-2 p-4"
                  : "flex flex-row items-center gap-4 border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
              }
            >
              {items.length === 0 ? (
                <>
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-400 dark:bg-slate-700">
                    <span className="material-symbols-outlined">restaurant</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-400 dark:text-slate-500">{label}</h3>
                    <p className="text-sm text-slate-400 dark:text-slate-500">Not logged yet</p>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-slate-900 dark:text-white">{label}</h3>
                  <ul className="space-y-2">
                    {items.map((m) => (
                      <li
                        key={m.id}
                        className="flex items-center justify-between gap-2 rounded-lg bg-white py-2 dark:bg-slate-800/50"
                      >
                        {editId === m.id ? (
                          <div className="flex flex-1 items-center gap-2">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1"
                              autoFocus
                            />
                            <Button size="sm" onClick={handleEditSave}>
                              Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleEditCancel}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium text-slate-900 dark:text-white">
                                {m.description}
                              </p>
                              <p className="text-sm text-primary">{m.calories} kcal</p>
                            </div>
                            <div className="flex shrink-0 gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="size-8"
                                onClick={() => handleEditStart(m)}
                                aria-label="Edit"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="size-8 text-red-600 hover:text-red-700"
                                onClick={() => handleDelete(m.id)}
                                aria-label="Delete"
                              >
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </Button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Card>
          ))}
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
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            dashboard
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Dashboard</span>
        </Link>
        <Link href="/meals" className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-primary">
          <span className="material-symbols-outlined">restaurant_menu</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Meals</span>
        </Link>
        <Link href="/progress" className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-primary">
          <span className="material-symbols-outlined">query_stats</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Progress</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-primary">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
