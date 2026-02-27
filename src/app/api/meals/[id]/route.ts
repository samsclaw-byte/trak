import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getNutritionForMeal } from "@/lib/moonshot";

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

/** PATCH /api/meals/[id] — update a meal (re-run Kimi for new description) */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const mealId = parseInt(id, 10);
  if (Number.isNaN(mealId)) {
    return NextResponse.json({ error: "Invalid meal id" }, { status: 400 });
  }

  let body: { description?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
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
      { error: "Could not estimate nutrition. Try again." },
      { status: 502 }
    );
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);
    const rows = await sql`
      UPDATE meals
      SET description = ${description}, calories = ${nutrition.calories},
          fat = ${nutrition.fat}, protein = ${nutrition.protein}, carbs = ${nutrition.carbs},
          sugars = ${nutrition.sugars}, fibre = ${nutrition.fibre}
      WHERE id = ${mealId} AND "userId" = ${userId}
      RETURNING id, "mealType", description, calories, fat, protein, carbs, sugars, fibre, "createdAt"
    `;
    const row = (rows as Array<Record<string, unknown>>)[0];
    if (!row) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, meal: row });
  } catch (err) {
    console.warn("Meals PATCH:", err);
    return NextResponse.json({ error: "Failed to update meal" }, { status: 500 });
  }
}

/** DELETE /api/meals/[id] */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const mealId = parseInt(id, 10);
  if (Number.isNaN(mealId)) {
    return NextResponse.json({ error: "Invalid meal id" }, { status: 400 });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);
    await sql`
      DELETE FROM meals WHERE id = ${mealId} AND "userId" = ${userId}
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.warn("Meals DELETE:", err);
    return NextResponse.json({ error: "Failed to delete meal" }, { status: 500 });
  }
}
