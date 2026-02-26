-- Run this in your Postgres database (e.g. Neon) when using Vercel.
-- Create the DB in Vercel: Storage / Marketplace → Neon (or another Postgres), then run this in the SQL editor or via psql.

CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "fullName" TEXT,
  age INTEGER,
  weight REAL,
  "weightUnit" TEXT CHECK ("weightUnit" IN ('kg', 'lbs')),
  height REAL,
  "heightUnit" TEXT CHECK ("heightUnit" IN ('cm', 'in')),
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  "activityLevel" INTEGER CHECK ("activityLevel" >= 1 AND "activityLevel" <= 5),
  bmr REAL,
  "dailyCalories" REAL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles ("userId");
