-- Run only if you already have the profiles table without activityLevel/bmr/dailyCalories:
-- npx wrangler d1 execute trak1-db --remote --file=./schema-migration-activity-bmr.sql

ALTER TABLE profiles ADD COLUMN activityLevel INTEGER;
ALTER TABLE profiles ADD COLUMN bmr REAL;
ALTER TABLE profiles ADD COLUMN dailyCalories REAL;
