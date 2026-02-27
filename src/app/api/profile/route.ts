import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import type { ActivityLevel } from "@/lib/bmr";
import { calculateBMRAndDailyCalories } from "@/lib/bmr";
import { authOptions } from "@/lib/auth";

// Profile is keyed by session.user.id (Google sub). BMR and daily calories (Harris–Benedict + activity) are computed and stored in Neon/D1 so the app remembers returning users.

export type ProfileBody = {
  fullName?: string;
  age?: number;
  weight?: number;
  weightUnit?: "kg" | "lbs";
  height?: number;
  heightUnit?: "cm" | "in";
  gender?: "male" | "female" | "other";
  activityLevel?: ActivityLevel;
};

const DEV_TEST_HEADER = "x-trak-d1-test";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(databaseUrl);
      const rows = await sql`
        SELECT "fullName", "dailyCalories", bmr
        FROM profiles
        WHERE "userId" = ${userId}
        LIMIT 1
      `;
      const row = rows[0] as { fullName: string | null; dailyCalories: number | null; bmr: number | null } | undefined;
      if (row) {
        return NextResponse.json({
          fullName: row.fullName ?? null,
          dailyCalories: row.dailyCalories ?? null,
          bmr: row.bmr ?? null,
        });
      }
    } catch (err) {
      console.warn("Profile GET (Postgres):", err);
    }
  }

  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = getCloudflareContext();
    const db = (env as { DB?: D1Database }).DB;
    if (db) {
      const stmt = db.prepare("SELECT fullName, dailyCalories, bmr FROM profiles WHERE userId = ? LIMIT 1").bind(userId);
      const runResult = await stmt.run();
      const result = (runResult as D1Result).results?.[0] as { fullName: string | null; dailyCalories: number | null; bmr: number | null } | undefined;
      if (result) {
        return NextResponse.json({
          fullName: result.fullName ?? null,
          dailyCalories: result.dailyCalories ?? null,
          bmr: result.bmr ?? null,
        });
      }
    }
  } catch {
    // D1 not available
  }

  return NextResponse.json({ fullName: null, dailyCalories: null, bmr: null });
}

export async function POST(request: Request) {
  let userId: string | null = null;

  const devSecret = process.env.TRAK_D1_TEST_SECRET;
  const testHeader = request.headers.get(DEV_TEST_HEADER);
  if (devSecret && testHeader === devSecret) {
    userId = "dev-test-user-preview";
  } else {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    userId = session.user.id;
  }

  let body: ProfileBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const fullName = body.fullName ?? null;
  const age = body.age != null ? Number(body.age) : null;
  const weight = body.weight != null ? Number(body.weight) : null;
  const weightUnit = body.weightUnit ?? "kg";
  const height = body.height != null ? Number(body.height) : null;
  const heightUnit = body.heightUnit ?? "cm";
  const gender = body.gender ?? null;
  const activityLevel = body.activityLevel != null ? Math.min(5, Math.max(1, Math.round(body.activityLevel))) as ActivityLevel : 3;

  let bmr: number | null = null;
  let dailyCalories: number | null = null;
  if (
    weight != null && weight > 0 &&
    height != null && height > 0 &&
    age != null && age > 0 &&
    gender
  ) {
    const result = calculateBMRAndDailyCalories(
      weight,
      weightUnit,
      height,
      heightUnit,
      age,
      gender,
      activityLevel
    );
    bmr = result.bmr;
    dailyCalories = result.dailyCalories;
  }

  // 1) Try Cloudflare D1 (when deployed on Cloudflare)
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = getCloudflareContext();
    const db = (env as { DB?: D1Database }).DB;
    if (db) {
      await db
        .prepare(
          `INSERT INTO profiles (userId, fullName, age, weight, weightUnit, height, heightUnit, gender, activityLevel, bmr, dailyCalories)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(userId) DO UPDATE SET
             fullName = excluded.fullName,
             age = excluded.age,
             weight = excluded.weight,
             weightUnit = excluded.weightUnit,
             height = excluded.height,
             heightUnit = excluded.heightUnit,
             gender = excluded.gender,
             activityLevel = excluded.activityLevel,
             bmr = excluded.bmr,
             dailyCalories = excluded.dailyCalories`
        )
        .bind(userId, fullName, age, weight, weightUnit, height, heightUnit, gender, activityLevel, bmr, dailyCalories)
        .run();
      return NextResponse.json({ ok: true, bmr, dailyCalories });
    }
  } catch {
    // D1 not available (e.g. Vercel or local dev without Cloudflare)
  }

  // 2) Try Neon/Postgres (when DATABASE_URL is set, e.g. on Vercel with Neon)
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(databaseUrl);
      await sql`
        INSERT INTO profiles ("userId", "fullName", age, weight, "weightUnit", height, "heightUnit", gender, "activityLevel", bmr, "dailyCalories")
        VALUES (${userId}, ${fullName}, ${age}, ${weight}, ${weightUnit}, ${height}, ${heightUnit}, ${gender}, ${activityLevel}, ${bmr}, ${dailyCalories})
        ON CONFLICT ("userId") DO UPDATE SET
          "fullName" = EXCLUDED."fullName",
          age = EXCLUDED.age,
          weight = EXCLUDED.weight,
          "weightUnit" = EXCLUDED."weightUnit",
          height = EXCLUDED.height,
          "heightUnit" = EXCLUDED."heightUnit",
          gender = EXCLUDED.gender,
          "activityLevel" = EXCLUDED."activityLevel",
          bmr = EXCLUDED.bmr,
          "dailyCalories" = EXCLUDED."dailyCalories"
      `;
      return NextResponse.json({ ok: true, bmr, dailyCalories });
    } catch (err) {
      console.warn("Profile save (Postgres):", err);
      return NextResponse.json(
        { error: "Failed to save profile. Check database connection." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { ok: true, message: "Profile saved (no database configured; add D1 on Cloudflare or DATABASE_URL on Vercel)", bmr, dailyCalories },
    { status: 200 }
  );
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<D1Result>;
}

interface D1Result {
  success: boolean;
  results?: Array<Record<string, unknown>>;
}
