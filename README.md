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

After login, users are redirected to **Profile setup** (`/profile-setup`). After saving or skipping, they go to the dashboard. If they’re already signed in, visiting `/` redirects to profile-setup (or dashboard if you change that in code).

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

## Deploy with Cloudflare

Trak is set up to deploy to **Cloudflare Workers** via [OpenNext for Cloudflare](https://opennext.js.org/cloudflare).

### 1. Install and log in

```bash
npm install
npx wrangler login
```

### 2. Set environment variables for production

Create a [Cloudflare Workers secret](https://developers.cloudflare.com/workers/configuration/secrets/) or use `wrangler secret put`:

```bash
npx wrangler secret put NEXTAUTH_SECRET
npx wrangler secret put NEXTAUTH_URL      # e.g. https://trak.<your-subdomain>.workers.dev
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
```

Or in **Cloudflare Dashboard** → Workers & Pages → your project → Settings → Variables and Secrets.

### 3. (Optional) D1 database for profiles

To persist profile data when deployed to Cloudflare:

1. Create a D1 database:
   ```bash
   npx wrangler d1 create trak1-db
   ```
2. Copy the `database_id` from the output. In `wrangler.toml`, uncomment the `[[d1_databases]]` block and set `database_id` to that value.
3. Create the `profiles` table (run from project root):
   ```bash
   npx wrangler d1 execute trak1-db --remote --file=./schema.sql
   ```

Without D1, profile data is still accepted (Continue/Skip work) but not persisted. Locally and on Vercel, profile save succeeds without D1.

### 4. Deploy

```bash
npm run deploy
```

After the first deploy, Cloudflare gives you a URL like **https://trak.&lt;your-subdomain&gt;.workers.dev**. Set `NEXTAUTH_URL` to that URL and add the same URL’s callback in Google OAuth:

- **Authorized redirect URI:** `https://trak.<your-subdomain>.workers.dev/api/auth/callback/google`

### 5. Preview locally (optional)

To run the app in the Workers runtime locally before deploying:

```bash
npm run preview
```

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
