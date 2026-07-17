# internships-site

Frontend for my internship tracker. A Python scraper runs on GHA every couple of hours, mirrors open roles into Supabase,
and pings Discord for target companies. This site reads that Supabase data at
runtime — data updates never trigger a rebuild.

## Architecture

```
scraper ──► Supabase Postgres ◄── this site (Vercel, ISR 5 min)
                        └──► Discord webhook (tiered companies)
```

- `lib/jobs.ts` — fetches open roles with the public anon key (tables are
  read-only to it via RLS; writes require the scraper's service_role key).
- `app/page.tsx` — server component, `revalidate = 300`.
- `components/jobs-table.tsx` — client-side search + cycle/category/tier/F-1 filters.

## Setup

1. In the scraper repo, run `db/schema.sql` in the Supabase SQL editor and set
   `SUPABASE_URL` / `SUPABASE_SERVICE_KEY` in its `.env`, then run
   `python run.py update` once — it should print `synced to Postgres   yes`.
2. Copy `.env.local.example` to `.env.local` and fill in the project URL and
   **anon** key (Supabase → Project Settings → API).
3. `npm install && npm run dev` → http://localhost:3000

## Deploy (Vercel)

Push this repo to GitHub, import it in Vercel, and add the same two env vars
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in Project →
Settings → Environment Variables. That's it — new scrape data appears within
5 minutes of each scraper run, with no redeploys.
