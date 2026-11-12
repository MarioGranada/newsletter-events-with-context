# Project Constitution — Next.js Events & Newsletter

This document defines the non-negotiable foundations for this repository. Read it before adding or changing features.

## Guiding Principles

- **Simplicity first** — prefer the smallest solution that solves the problem. If a change needs a long explanation, it is probably over-engineered.
- **No hardcoded secrets or endpoints** — configuration belongs in environment variables; visual design tokens belong in styles, not in `.env` files.
- **Traceability** — every value, dependency, and route should make its origin and purpose obvious.
- **Debuggability** — fail loudly and visibly; avoid silent fallbacks that hide broken data.
- **Official patterns** — use the documented API of each framework and library before inventing a workaround.
- **Portfolio clarity** — this repository is part of a public portfolio. Code should read as clean, intentional, and easy for a reviewer to follow. As a follow-along project, its purpose is to demonstrate the concepts practised in the course, not to imitate production scale.

## Technology Stack Foundations

| Layer | Choice | Rationale |
| --- | --- | --- |
| Framework | Next.js 14 (Pages Router) | The course project uses `pages/` for pages and `getStaticProps` for pre-rendering. |
| UI | React 18 | Component model for the event list, detail, comments, and notification banner. |
| Database | Supabase Postgres via `postgres` (postgres.js) | One hosted store for events, comments and emails (2026-11-12). Replaced the deactivated Firebase events endpoint and MongoDB Atlas. |
| State | React Context | The notification banner is shared by unrelated forms. |
| Styling | CSS Modules + global CSS | Scoped component styles with a small global reset. |

**Rule of thumb:** a new dependency must solve a concrete problem that the current stack cannot solve cleanly. Justify it in the change that introduces it.

## Core Premises

### 1. Scope

A course project that demonstrates Next.js pre-rendering, API route handlers, Postgres access, and shared UI state through context. It is a single-tenant demo; accounts, moderation, and production-grade database pooling are out of scope.

### 2. Environment Isolation

- The app reads `POSTGRES_URL` (and optionally `POSTGRES_URL_NON_POOLING` for migrations) from the environment.
- Keep real values in `.env` (gitignored) and document them in the example file and README.
- Never commit keys, tokens, database URLs, or credentials.
- Validate required values at the point of use and fail with a clear message.

### 3. Architecture

- Keep event queries in `helpers/api-util.js` and comment/newsletter queries in `helpers/db-util.js`; pages and components should not contain queries.
- Route handlers validate input and return explicit status codes.
- Shared UI state belongs in `store/`; component-local state stays local.

### 4. Data and State

- Supabase Postgres (`newsletter` schema) is the source of truth for events, comments and emails; schema and seed live in `db/migration.sql`.
- Event pages are statically generated and revalidated, so changes appear after the revalidation window.
- Comments are fetched on demand and are not cached on the client.
- Never log credentials or full database errors to the browser.

### 5. Styling and UX

- CSS Modules live next to their components; global styles stay in `styles/globals.css`.
- Keep the existing layout and event-card patterns rather than adding a UI library.
- Notification colours must remain distinguishable for pending, success, and error states.

### 6. Quality Gates

- `npm run build` is the only automated gate.
- Manually test the home page, all events, a date filter, a detail page, comments (empty, valid, invalid), and newsletter validation.
- Confirm comment and newsletter failures show an error notification rather than a crash.

### 7. Deployment

- Deploy to Vercel; data lives in the shared portfolio Supabase project and `POSTGRES_URL` comes from the Supabase ↔ Vercel integration.
- A nightly Vercel Cron calls `/api/cron/reset`, which deletes every comment and newsletter email (events stay). The endpoint refuses requests without `Authorization: Bearer $CRON_SECRET`.
- Do not add a database ORM or auth layer unless a feature requires it.

## What to Avoid

- Committing `.env.local`, Atlas credentials, or connection strings.
- Querying the database directly inside presentational components.
- Opening a new database connection per request.
- Assuming comments or emails are available when the database is down.
- Adding a second state library for a notification banner.

## Checklist Before Adding Anything New

- Does this solve a real problem for this project, or am I adding scope for its own sake?
- Is every new value configuration-driven rather than hardcoded?
- Does the change follow the existing folder and naming patterns?
- Is there a clear failure path when data, the network, or the environment is unavailable?
- Have I run the available lint/build/test command and fixed what it reports?
- Did I update `README.md` and `MEMORY.md` if behaviour or setup changed?

## Philosophy Statement

This repository exists to show thoughtful front-end engineering: clear structure, readable code, and deliberate trade-offs. The goal is not to use every tool available, but to make every file explain itself. Simplicity is the feature.
