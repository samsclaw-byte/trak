# Trak – Simple Nutrition Tracking

Next.js app with Shadcn UI, Tailwind, and Rive animation on the main CTA. Responsive (mobile-first, scales to tablet/desktop).

## Setup

```bash
cd trak
npm install
```

Copy `.env.example` to `.env` and fill in the values (see **Google login** below).

## Google login

The “Continue with Google” button uses NextAuth.js with the Google OAuth provider.

1. **Google Cloud Console:** Go to [APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials).
2. **Create OAuth client:** Create an **OAuth 2.0 Client ID** (application type: **Web application**).
3. **Authorized redirect URI:** Add `http://localhost:3000/api/auth/callback/google` (for production add your real domain).
4. **Env vars:** In `.env` set:
   - `NEXTAUTH_SECRET` – any long random string (e.g. `openssl rand -base64 32`)
   - `NEXTAUTH_URL` – `http://localhost:3000` (or your production URL)
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from the OAuth client.

After login, users are redirected to `/dashboard`. If they’re already signed in, visiting `/` redirects to the dashboard.

## Rive animation on the CTA button

The main “Continue with Google” CTA can show a Rive animation (e.g. Trak logo) from your design:

- **Editor:** [Rive – trak-logo-2](https://editor.rive.app/file/trak-logo-2/2080458)
- **In the editor:** Export or publish the animation and download the `.riv` file.
- **In the app:** Put the `.riv` file in the `public` folder as `public/trak-logo.riv`.

By default the Google icon is shown. To load a Rive animation, add your `.riv` to `public/` and set:

```env
NEXT_PUBLIC_RIVE_CTA_URL=/path/to/your.riv
```

If the file is missing or fails to load, the button falls back to the Google “G” icon.

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` – Login (Rive CTA)
- `/dashboard` – Dashboard
- `/profile-setup` – Create profile
- `/log-meal` – Quick add meal
- `/water` – Water tracker
- `/progress` – Analytics
- `/profile` – Profile & settings
- `/meals` – Meals (alias)

## Stack

- **Next.js 15** (App Router)
- **Tailwind CSS** (primary `#10b77f`, Manrope)
- **Shadcn-style UI** (Button, Input, Label, Card, Switch)
- **Rive** (`@rive-app/react-webgl2`) for the login CTA
