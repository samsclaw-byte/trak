# Supabase Auth setup

Trak uses **Supabase Auth** for sign-in (Google OAuth). Neon is still used for app data (profiles, meals).

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings → API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Environment variables

Add to `.env.local` (and Vercel → Settings → Environment Variables for production):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 3. Enable Google sign-in in Supabase

1. In Supabase: **Authentication → Providers** → enable **Google**.
2. Use your Google Cloud OAuth client **Client ID** and **Client Secret** (same or new OAuth client).
3. In **Authentication → URL Configuration**, set:
   - **Site URL**: `https://trak-nine.vercel.app` (or your production URL)
   - **Redirect URLs**: add  
     `https://trak-nine.vercel.app/auth/callback`  
     and for local dev:  
     `http://localhost:3000/auth/callback`

## 4. Google Cloud Console (if needed)

If you create a new OAuth client for Supabase:

- **Authorized redirect URIs**: add  
  `https://xxxxx.supabase.co/auth/v1/callback`  
  (use the Supabase project URL from step 1).

After that, deploy and use **Continue with Google** on the app.
