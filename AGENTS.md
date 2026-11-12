# AGENTS.md — Next.js Events & Newsletter

Compact guide for future OpenCode sessions. It records only the facts an agent is likely to miss or get wrong.

## Quickstart

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies. |
| `vercel env pull .env.local` | Fetch `POSTGRES_URL` from the linked Vercel project. |
| `npm run db:migrate` | Apply the idempotent schema + seed in `db/migration.sql`. |
| `npm run dev` | Start the app at http://localhost:3000. |
| `npm run build` | Verify pages and route handlers compile. |

## Requirements

- Node.js 22+.
- npm (a `package-lock.json` is committed).
- A Postgres database (production: the shared portfolio Supabase project).

## Environment

- `POSTGRES_URL` (required): pooled connection string injected by the Supabase ↔ Vercel integration.
- `POSTGRES_URL_NON_POOLING` (optional): used by `npm run db:migrate`.
- Documented in `.env.example`; keep real values in `.env.local` and never commit them.
- Changing database credentials requires a dev-server restart.

## Architecture

- `pages/` — Pages Router screens and `getStaticProps` data loading.
- `app/api/` — route handlers for events, newsletter and comments.
- `helpers/db.js` — shared postgres.js client (`prepare: false` for the Supabase transaction pooler).
- `helpers/api-util.js` — event queries (`newsletter.events`).
- `helpers/db-util.js` — comment and newsletter queries.
- `db/migration.sql` + `scripts/db-migrate.mjs` — schema and seed.
- `store/notification-context.js` — notification banner state.
- `components/` — event, comment, layout, and UI components with CSS Modules.

## Commands and build order

- Use `npm run dev` for iteration and `npm run build` before finishing.
- There is no lint or test script; rely on the build plus manual checks.

## Conventions and gotchas

- Pages Router pages live in `pages/`, but the API handlers live in `app/api/`; do not move one into the other without checking Next.js conventions.
- Use the shared client from `helpers/db.js`; never open per-request connections or import it into client code.
- Never return commenter emails or raw database errors to the browser.
- The notification effect depends on the whole notification object; avoid creating a new object on every render.
- The catch-all route receives `slug` as an array of strings; parse and validate it before filtering.
- Do not commit `.env.local` or database URLs.
- The shared Supabase database hosts other apps' schemas too (`news`, `foodies`, `auth_demo`); only touch `newsletter`.

## Memory

- Read `MEMORY.md` first to understand the current status and decisions.
- Before changing behaviour, read `constitution.md` and keep the change aligned with it.
- After a task, update `MEMORY.md` with status, decisions, and mistakes to avoid. Keep it short.
- If a rule becomes permanent, move it into this file instead of leaving it in memory.
- Never store secrets, tokens, or personal data in `MEMORY.md`.
