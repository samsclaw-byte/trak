-- Run this in your Neon SQL editor (same DB as profiles).
-- Meals are logged by date and linked to the user's profile via "userId".

CREATE TABLE IF NOT EXISTS meals (
  id SERIAL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "mealDate" DATE NOT NULL,
  "mealType" TEXT NOT NULL CHECK ("mealType" IN ('breakfast', 'lunch', 'dinner', 'snack')),
  description TEXT NOT NULL,
  calories INTEGER NOT NULL,
  fat REAL,
  protein REAL,
  carbs REAL,
  sugars REAL,
  fibre REAL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals ("userId", "mealDate");
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals ("userId");
