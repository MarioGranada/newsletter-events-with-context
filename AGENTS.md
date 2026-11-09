# AGENTS.md — Next.js Events & Newsletter

Compact guide for future OpenCode sessions. It records only the facts an agent is likely to miss or get wrong.

## Quickstart

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies. |
| `npm run dev` | Start the app at http://localhost:3000. |
| `npm run build` | Verify pages and route handlers compile. |

## Requirements

- Node.js 18 or 20.
- npm (a `package-lock.json` is committed).
- A MongoDB Atlas cluster, database user, and network access for your IP.
- Outbound internet access to the Firebase Realtime Database endpoint.

## Environment

- Create a `.env` file (or `.env.local` where the framework expects it) and set the variables. Never commit real secrets.

  - `DB_USER` — MongoDB Atlas database user name.
  - `DB_PASSWORD` — MongoDB Atlas database user password.
- Use `.env.local` for `DB_USER` and `DB_PASSWORD`; never commit it.
- The Firebase endpoint is public and needs no environment variable.
- Changing database credentials requires a dev-server restart.

## Architecture

- `pages/` — Pages Router screens and `getStaticProps` data loading.
- `app/api/` — route handlers for newsletter and comments.
- `helpers/api-util.js` — Firebase event queries.
- `helpers/db-util.js` — MongoDB connection and collection helpers.
- `store/notification-context.js` — notification banner state.
- `components/` — event, comment, layout, and UI components with CSS Modules.

## Commands and build order

- Use `npm run dev` for iteration and `npm run build` before finishing.
- There is no lint or test script; rely on the build plus manual checks.

## Conventions and gotchas

- Pages Router pages live in `pages/`, but the API handlers live in `app/api/`; do not move one into the other without checking Next.js conventions.
- MongoDB clients must be closed on both success and error paths.
- The notification effect depends on the whole notification object; avoid creating a new object on every render.
- The catch-all route receives `slug` as an array of strings; parse and validate it before filtering.
- Do not commit `.env.local` or real Atlas credentials.

## Memory

- Read `MEMORY.md` first to understand the current status and decisions.
- Before changing behaviour, read `constitution.md` and keep the change aligned with it.
- After a task, update `MEMORY.md` with status, decisions, and mistakes to avoid. Keep it short.
- If a rule becomes permanent, move it into this file instead of leaving it in memory.
- Never store secrets, tokens, or personal data in `MEMORY.md`.
