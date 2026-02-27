import { NextResponse } from "next/server";
import { getUserId } from "@/lib/supabase/auth-server";
import { getNutritionForMeal } from "@/lib/moonshot";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;

function todayISO(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

/** GET /api/meals?date=YYYY-MM-DD — list meals for a date (default today) */
export async function GET(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || todayISO();

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ meals: [] });
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);
    const rows = await sql`
      SELECT id, "mealType", description, calories, fat, protein, carbs, sugars, fibre, "createdAt"
      FROM meals
      WHERE "userId" = ${userId} AND "mealDate" = ${date}
      ORDER BY "mealType", "createdAt"
    `;
    return NextResponse.json({
      meals: (rows as Array<{
        id: number;
        mealType: string;
        description: string;
        calories: number;
        fat: number | null;
        protein: number | null;
        carbs: number | null;
        sugars: number | null;
        fibre: number | null;
        createdAt: string;
      }>).map((r) => ({
        id: r.id,
        mealType: r.mealType,
        description: r.description,
        calories: r.calories,
        fat: r.fat ?? 0,
        protein: r.protein ?? 0,
        carbs: r.carbs ?? 0,
        sugars: r.sugars ?? 0,
        fibre: r.fibre ?? 0,
        createdAt: r.createdAt,
      })),
    });
  } catch (err) {
    console.warn("Meals GET:", err);
    return NextResponse.json({ error: "Failed to load meals" }, { status: 500 });
  }
}

/** POST /api/meals — add a meal (calls Kimi for nutrition, then saves to Neon) */
export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { mealType?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const mealType = body.mealType?.toLowerCase();
  if (!mealType || !MEAL_TYPES.includes(mealType as (typeof MEAL_TYPES)[number])) {
    return NextResponse.json({ error: "Invalid mealType: use breakfast, lunch, dinner, or snack" }, { status: 400 });
  }

  const description = typeof body.description === "string" ? body.description.trim() : "";
  if (!description) {
    return NextResponse.json({ error: "description is required" }, { status: 400 });
  }

  let nutrition;
  try {
    nutrition = await getNutritionForMeal(description);
  } catch (err) {
    console.warn("Moonshot nutrition:", err);
    return NextResponse.json(
      { error: "Could not estimate nutrition. Check MOONSHOT_API_KEY or try again." },
      { status: 502 }
    );
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const mealDate = todayISO();

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);
    const rows = await sql`
      INSERT INTO meals ("userId", "mealDate", "mealType", description, calories, fat, protein, carbs, sugars, fibre)
      VALUES (${userId}, ${mealDate}, ${mealType}, ${description}, ${nutrition.calories}, ${nutrition.fat}, ${nutrition.protein}, ${nutrition.carbs}, ${nutrition.sugars}, ${nutrition.fibre})
      RETURNING id, "mealType", description, calories, fat, protein, carbs, sugars, fibre, "createdAt"
    `;
    const row = (rows as Array<Record<string, unknown>>)[0];
    return NextResponse.json({
      ok: true,
      meal: {
        id: row?.id,
        mealType,
        description,
        calories: nutrition.calories,
        fat: nutrition.fat,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        sugars: nutrition.sugars,
        fibre: nutrition.fibre,
        createdAt: row?.createdAt,
      },
    });
  } catch (err) {
    console.warn("Meals POST:", err);
    return NextResponse.json({ error: "Failed to save meal" }, { status: 500 });
  }
}
