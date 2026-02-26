# Vercel + NextAuth setup (Google sign-in)

## 1. Deploy to Vercel

- Push your code to GitHub (if not already).
- Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import the `trak` repo.
- Use the default **Framework Preset** (Next.js) and **Root Directory** (`.`). Deploy.

Your app will get a URL like `https://trak-xxxx.vercel.app` (or your custom domain).

---

## 2. Set environment variables in Vercel

In the Vercel project: **Settings** → **Environment Variables**. Add:

| Name | Value | Notes |
|------|--------|--------|
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | **Required.** Use your real Vercel URL (e.g. `https://trak-xxxx.vercel.app`) or custom domain (e.g. `https://trak-app.net`) **with no trailing slash**. |
| `NEXTAUTH_SECRET` | (random string) | **Required.** Generate with: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | (from Google Console) | Same OAuth client as before. |
| `GOOGLE_CLIENT_SECRET` | (from Google Console) | Same as above. |

- Enable these for **Production** (and Preview if you want auth in previews).
- **Redeploy** after saving (Deployments → … on latest → Redeploy).

---

## 3. Google Cloud Console (OAuth client)

Use the **same** OAuth 2.0 Client ID as now. Add the Vercel URLs:

- **Authorized JavaScript origins**
  - `https://your-app.vercel.app`  
  - If you use a custom domain: `https://trak-app.net`

- **Authorized redirect URIs**
  - `https://your-app.vercel.app/api/auth/callback/google`  
  - If you use a custom domain: `https://trak-app.net/api/auth/callback/google`

Save. No need to change any code.

---

## 4. Custom domain (optional) — trak-app.net on Vercel

- In Vercel: **Settings** → **Domains** → add `trak-app.net`.
- Follow the instructions (add the CNAME or A record in your DNS).
- After the domain is active, set:
  - **Vercel env:** `NEXTAUTH_URL` = `https://trak-app.net`
  - **Google Console:** add `https://trak-app.net` and `https://trak-app.net/api/auth/callback/google` as above.

---

## 5. Quick checklist

- [ ] Project deployed on Vercel.
- [ ] `NEXTAUTH_URL` = exact app URL, no trailing slash.
- [ ] `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` set in Vercel.
- [ ] Google OAuth client has the Vercel (and custom domain) redirect URI and JS origin.
- [ ] Redeploy after changing env vars.

After that, **Continue with Google** should work on Vercel.

---

## 6. Save profiles on Vercel (Neon Postgres)

After login, users are sent to **Create your profile**. To persist that data on Vercel:

1. **Add a Postgres database**
   - Vercel Dashboard → your project → **Storage** (or **Integrations** / Marketplace).
   - Create or connect a **Neon** Postgres database (or another Postgres provider). Vercel will inject a `DATABASE_URL` env var.

2. **Create the `profiles` table in Neon** — detailed steps:
   - **Open Neon**
     - From **Vercel:** Project → **Storage** tab → click your Neon database → **Open in Neon** (or the link to open the Neon console).
     - Or go to [neon.tech](https://neon.tech), sign in, and select the same project/database you connected to Vercel.
   - **Open the SQL Editor**
     - In the Neon dashboard, click **SQL Editor** in the left sidebar (or **Query** / **Console** depending on the UI).
     - You should see a large text area where you can type or paste SQL.
   - **Paste the schema** (choose one method):

     **Option A — From the file in your repo**
     - On your computer, open your **trak** project folder (the one with `package.json`, `src/`, etc.).
     - In the project **root** (same level as `package.json`), find the file **`schema-vercel-postgres.sql`**.
     - Open it in your editor (e.g. Cursor, VS Code, or any text editor). You can double‑click it in the file explorer, or use **File → Open** and select it.
     - Select everything in the file (Ctrl+A or Cmd+A). Make sure you include the first line that starts with `CREATE TABLE` and the last line that ends with `);` for the index.
     - Copy (Ctrl+C or Cmd+C).
     - Switch to the Neon SQL Editor tab in your browser, click inside the big text area, and paste (Ctrl+V or Cmd+V). You should see both the `CREATE TABLE` and the `CREATE INDEX` statements.

     **Option B — From the SQL block in this doc**
     - Open **`VERCEL_NEXTAUTH_SETUP.md`** in your project (same folder as the repo).
     - Scroll to the section **“6. Save profiles on Vercel (Neon Postgres)”**, then to the grey code block that starts with **“Or copy this SQL”**.
     - Click once inside that code block, then select all the SQL (from `CREATE TABLE` down to the line with `idx_profiles_user_id`). Do not include the line that says ` ```sql ` or ` ``` `.
     - Copy, then paste into Neon’s SQL editor.

     In both cases you should end up with **two statements** in the Neon editor: one `CREATE TABLE ...` and one `CREATE INDEX ...`. If you only see one, copy again and include the full contents.
   - **Run the SQL**
     - Click **Run** (or **Execute** / press the shortcut, e.g. Ctrl+Enter or Cmd+Enter).
     - You should see a success message and no errors.
   - **Confirm the table exists**
     - In the left sidebar, expand **Tables** (or run `SELECT * FROM profiles LIMIT 1;` in the SQL editor). You should see a table named **`profiles`**.
   - If you get an error, check that you’re in the correct **branch** and **database** (Neon can have multiple). The schema creates the table in the current database.

   **Or copy this SQL** (same as `schema-vercel-postgres.sql`):

   ```sql
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
   ```

3. **Environment variable**
   - Ensure **`DATABASE_URL`** is set in Vercel (usually automatic when you connect Neon). It should look like:
     `postgresql://user:password@host/dbname?sslmode=require`

4. **Redeploy** after connecting the database.

The profile API uses **D1** when deployed on Cloudflare and **Neon/Postgres** when `DATABASE_URL` is set (e.g. on Vercel).
