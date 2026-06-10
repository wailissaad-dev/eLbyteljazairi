# Deploy this site (from any laptop)

This is a **Next.js** site (El Bayt El Djazairi). You can put it online with
**Vercel** (free) in a few minutes. It works with **no configuration** out of the
box — adding the variables at the bottom unlocks the `/admin` panel and saved orders.

## Prerequisite
Install **Node.js 18+** (LTS) from https://nodejs.org

## Option 1 — Vercel CLI (fastest, no GitHub)
Open a terminal **in this folder** and run:
```bash
npm install
npm install -g vercel
vercel login        # opens the browser to sign in / sign up (free)
vercel --prod       # accept the defaults; it auto-detects Next.js
```
It prints a live URL. Done.

## Option 2 — GitHub + vercel.com (auto-deploys on every change)
```bash
git init
git add .
git commit -m "El Bayt El Djazairi"
git branch -M main
git remote add origin https://github.com/<username>/elbayt.git
git push -u origin main
```
Then on **vercel.com → Add New → Project → Import** the repo → it detects Next.js →
**don't change the build settings** → **Deploy**.

## Run locally first (optional)
```bash
npm install
npm run dev         # http://localhost:3000
```

## Optional: enable the admin panel + saved orders
1. Create a project at https://supabase.com
2. In its **SQL Editor**, run these files (in `/supabase`) in order:
   `migrations/0001_init.sql` → `migrations/0002_admin.sql` → `seed.sql`
3. On Vercel, **Settings → Environment Variables**, add then **Redeploy**:
   - `ADMIN_PASSWORD` = a password you choose
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (from Supabase → Settings → API)
4. Log in at `https://your-url/admin` to add products, packs, and edit contact info.

Without those, the site shows the built-in catalog and `/admin` shows a short setup notice.
