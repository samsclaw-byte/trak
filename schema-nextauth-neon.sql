-- NextAuth database session tables for Neon (same DB as profiles/meals).
-- Run this in the Neon SQL Editor once if you don't run "npx prisma db push".
-- Alternatively, run: npx prisma db push (with DATABASE_URL set to your Neon connection string).

CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT,
  "email" TEXT,
  "emailVerified" TIMESTAMPTZ,
  "image" TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

CREATE TABLE IF NOT EXISTS "Account" (
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  PRIMARY KEY ("provider", "providerAccountId"),
  CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Session" (
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMPTZ NOT NULL,
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires" TIMESTAMPTZ NOT NULL,
  PRIMARY KEY ("identifier", "token")
);
