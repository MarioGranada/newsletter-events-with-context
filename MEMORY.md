# Next.js Events & Newsletter — Working Memory

_Last updated: 2026-11-12_

## Current status

- Featured, all-events, filtered, and detail pages are implemented.
- Events, comments and newsletter emails live in Supabase Postgres (`newsletter` schema); schema + seed in `db/migration.sql` (idempotent). Verified end to end against Postgres on 2026-11-12.
- Linked to Vercel project `newsletter-events-with-context` (GitHub connected). Live at https://newsletter-events-with-context.vercel.app since 2026-11-12.
- Nightly reset (2026-11-12): Vercel Cron `0 4 * * *` → `/api/cron/reset` deletes every comment and newsletter email (events stay); guarded by the `CRON_SECRET` env var.
- No tests yet.

## Key decisions

- 2026-11-12: the Firebase Realtime Database that served events was deactivated; moved events, plus comments and emails (MongoDB Atlas), to the shared portfolio Supabase project.
- Filtered page keeps client-side SWR, now against `GET /api/events`.
- Comment listing returns only id/name/text; emails stay server-side.
- Route handlers stay under `app/api/` while screens use the Pages Router.

## Known limitations and follow-ups

- No authentication, comment moderation, or rate limiting.

## Mistakes to avoid

- Building without `POSTGRES_URL` fails: SSG pages query the database at build time.
- Returning raw database errors to the client (was done with MongoDB before 2026-11-12).

## Next steps


---

Keep this file under ~60 lines. Summarise or delete notes that no longer add value.
