# Next.js Events & Newsletter

An events directory built with the Next.js Pages Router. Visitors can browse featured and upcoming events, filter events by date, open a detail page, leave comments, and subscribe to a newsletter.

Events, comments and newsletter emails all live in a `newsletter` schema of a hosted Supabase Postgres database. Pages read events at build/revalidation time, and route handlers write comments and sign-ups. A React context drives the notification banner used by both forms.

> **Follow-along project.** This app was built while following **Next.js 14 & React — The Complete Guide (Academind / Maximilian Schwarzmüller)**. It is included in the portfolio as a learning exercise, not as a production product. The implementation is my own work based on the course material.

## Live demo

| | |
| --- | --- |
| **Live site** | https://newsletter-events-with-context.vercel.app |
| **Repository** | https://github.com/MarioGranada/newsletter-events-with-context |
| **Portfolio summary** | Events directory on the Next.js Pages Router with ISR, date filtering, per-event comments and newsletter sign-up, backed by Supabase Postgres. |

## Features

- Featured events on the home page with incremental static regeneration.
- All-events page with month/year filtering.
- Dynamic event detail route and catch-all date-filter route.
- Newsletter signup with client and server-side email validation.
- Per-event comments loaded on demand and stored in Postgres (commenter emails are never sent to the browser).
- Notification context with pending, success, and error states.
- Reusable event, comment, and layout components with CSS Modules.
- Small query helpers for events, comments and newsletter emails.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (Pages Router) |
| UI | React 18 |
| Database | Supabase Postgres via `postgres` (postgres.js) |
| State | React Context |
| Styling | CSS Modules + global CSS |

## Project structure

```text
newsletter-events-with-context/
├── app/api/                    # Route handlers (App Router style)
│   ├── events/route.js         # GET all events (used by the filtered page)
│   ├── newsletter/route.js     # POST newsletter signup
│   └── comments/[eventId]/     # GET and POST event comments
├── pages/                      # Pages Router
│   ├── index.js                # Featured events
│   ├── events/index.js         # All events
│   ├── events/[eventId].js     # Event detail
│   ├── events/[...slug].js     # Filtered events by year/month
│   ├── _app.js                 # Layout and notification provider
│   └── _document.js
├── components/                 # events, event-detail, input, layout, ui, icons
├── helpers/
│   ├── db.js                   # Shared postgres.js client
│   ├── api-util.js             # Event queries
│   └── db-util.js              # Comment and newsletter queries
├── store/notification-context.js
├── styles/globals.css
├── db/migration.sql            # Idempotent schema + event seed
└── scripts/db-migrate.mjs      # Applies db/migration.sql
```

## Getting started

### Requirements

- Node.js 22+.
- npm (a `package-lock.json` is committed).
- A Postgres database. The deployed app uses the shared portfolio Supabase project, connected to the Vercel project through the Supabase integration.

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
vercel link          # once, links the folder to the Vercel project
vercel env pull .env.local
```

| Variable | Purpose | Required |
| --- | --- | --- |
| `POSTGRES_URL` | Pooled Postgres connection string (set by the Supabase integration). | Yes |
| `POSTGRES_URL_NON_POOLING` | Direct connection used by `npm run db:migrate`; falls back to `POSTGRES_URL`. | No |

Any Postgres works locally, e.g. `POSTGRES_URL=postgres://postgres:postgres@localhost:5432/postgres`. See `.env.example`.

### 3. Create the schema and seed data

```bash
npm run db:migrate
```

Safe to re-run: tables use `if not exists` and seed rows `on conflict do nothing`.

### 4. Run locally

**Start the development server**

```bash
npm run dev
```

Open http://localhost:3000.

Use `.env.local` for local values. Restart the server after changing them.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js in development mode on port 3000. |
| `npm run build` | Create a production build and validate pages and route handlers. |
| `npm run start` | Serve the production build. |
| `npm run db:migrate` | Apply `db/migration.sql` (schema + seed). |

## How it works

`helpers/api-util.js` queries `newsletter.events` and exposes `getAllEvents`, `getFeaturedEvents`, `getEventById`, and `getFilteredEvents`. Pages call these from `getStaticProps` or `getStaticPaths`, so event data is fetched at build/revalidation time rather than in the browser.

`pages/index.js` renders featured events with `revalidate: 1800`; `pages/events/index.js` renders all events with `revalidate: 60`; `pages/events/[...slug].js` parses year and month from the catch-all route and filters the list it loads client-side (SWR) from `GET /api/events`.

The API surface lives in `app/api/` as route handlers: `POST /api/newsletter` validates an email and stores it in `newsletter.emails` (duplicates are ignored), while `GET` and `POST /api/comments/[eventId]` list and create comments for one event (unknown events return 404). Both use `helpers/db-util.js`; database errors are logged server-side, never returned to the client.

`store/notification-context.js` exposes `showNotification` and `hideNotification`. The provider auto-dismisses settled notifications after three seconds but keeps `pending` notifications visible until they are replaced.

`pages/_app.js` wraps every page in the notification provider and the shared `Layout`, which renders the main header and content shell.

## Deployment

- **Live:** https://newsletter-events-with-context.vercel.app (Vercel production, deployed from `master`).
- Target: Vercel, with data in the shared portfolio Supabase project (schema `newsletter`). The Supabase ↔ Vercel integration injects `POSTGRES_URL` into every environment.
- Run `npm run db:migrate` once against the Supabase database before the first deployment.
- History: events used to come from a Firebase Realtime Database that has since been deactivated, and comments/emails from MongoDB Atlas; both were replaced by Postgres on 2026-11-12.
- Deployed through Vercel’s Git integration; no GitHub Actions workflow is needed.

## Notes and limitations

- The `newsletter` schema is not exposed through the Supabase Data API; RLS is enabled with no policies, and the app connects server-side only.
- Statically generated pages query the database at build time, so `POSTGRES_URL` must be available during `next build`.
- No moderation or rate limiting on comments and sign-ups.
- Comments are only fetched after the user opens the comments section.
- The notification provider never clears a `pending` notification on its own; a success or error notification must follow it.

---

**Author:** Mario Granada
