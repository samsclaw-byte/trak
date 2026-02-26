-- Run this against your D1 database after creating it:
-- wrangler d1 create trak1-db
-- wrangler d1 execute trak1-db --remote --file=./schema.sql

CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL UNIQUE,
  fullName TEXT,
  age INTEGER,
  weight REAL,
  weightUnit TEXT CHECK(weightUnit IN ('kg', 'lbs')),
  height REAL,
  heightUnit TEXT CHECK(heightUnit IN ('cm', 'in')),
  gender TEXT CHECK(gender IN ('male', 'female', 'other')),
  activityLevel INTEGER CHECK(activityLevel >= 1 AND activityLevel <= 5),
  bmr REAL,
  dailyCalories REAL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(userId);
