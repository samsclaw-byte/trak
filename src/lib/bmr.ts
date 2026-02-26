/**
 * Harris–Benedict (revised) BMR and activity-based daily calories.
 * BMR = basal metabolic rate (kcal/day at rest).
 * Daily calories = BMR × activity multiplier (TDEE).
 */

export const ACTIVITY_LEVELS = [
  { level: 1, label: "Sedentary", multiplier: 1.2 },
  { level: 2, label: "Lightly", multiplier: 1.375 },
  { level: 3, label: "Moderate", multiplier: 1.55 },
  { level: 4, label: "Very", multiplier: 1.725 },
  { level: 5, label: "Super", multiplier: 1.9 },
] as const;

export type ActivityLevel = 1 | 2 | 3 | 4 | 5;

export function getActivityMultiplier(level: ActivityLevel): number {
  const found = ACTIVITY_LEVELS.find((a) => a.level === level);
  return found?.multiplier ?? 1.2;
}

/** Weight in kg (pass in kg or convert from lbs: lbs / 2.205). */
function toKg(value: number, unit: "kg" | "lbs"): number {
  return unit === "lbs" ? value / 2.205 : value;
}

/** Height in cm (pass in cm or convert from in: in * 2.54). */
function toCm(value: number, unit: "cm" | "in"): number {
  return unit === "in" ? value * 2.54 : value;
}

/**
 * Revised Harris–Benedict BMR (Roza & Shizgal).
 * weightKg, heightCm, age in years. gender: male | female | other (other uses male formula).
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: "male" | "female" | "other"
): number {
  if (ageYears <= 0 || weightKg <= 0 || heightCm <= 0) return 0;
  if (gender === "female") {
    return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * ageYears;
  }
  // male or other
  return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYears;
}

/**
 * BMR and daily calories from profile inputs.
 * Converts weight/height to kg/cm when needed.
 */
export function calculateBMRAndDailyCalories(
  weight: number,
  weightUnit: "kg" | "lbs",
  height: number,
  heightUnit: "cm" | "in",
  age: number,
  gender: "male" | "female" | "other",
  activityLevel: ActivityLevel
): { bmr: number; dailyCalories: number } {
  const weightKg = toKg(weight, weightUnit);
  const heightCm = toCm(height, heightUnit);
  const bmr = Math.round(calculateBMR(weightKg, heightCm, age, gender));
  const multiplier = getActivityMultiplier(activityLevel);
  const dailyCalories = Math.round(bmr * multiplier);
  return { bmr, dailyCalories };
}
