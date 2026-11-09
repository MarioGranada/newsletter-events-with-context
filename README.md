# Next.js Events & Newsletter

An events directory built with the Next.js Pages Router. Visitors can browse featured and upcoming events, filter events by date, open a detail page, leave comments, and subscribe to a newsletter.

Event content is read from a public Firebase Realtime Database, while newsletter emails and comments are written to MongoDB Atlas through Next.js route handlers. A React context drives the notification banner used by both forms.

> **Follow-along project.** This app was built while following **Next.js 14 & React — The Complete Guide (Academind / Maximilian Schwarzmüller)**. It is included in the portfolio as a learning exercise, not as a production product. The implementation is my own work based on the course material.

## Features

- Featured events on the home page with incremental static regeneration.
- All-events page with month/year filtering.
- Dynamic event detail route and catch-all date-filter route.
- Newsletter signup with client and server-side email validation.
- Per-event comments loaded on demand and stored in MongoDB.
- Notification context with pending, success, and error states.
- Reusable event, comment, and layout components with CSS Modules.
- MongoDB helpers for connecting, inserting, and listing documents.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (Pages Router) |
| UI | React 18 |
| Event data | Firebase Realtime Database |
| Database | MongoDB Atlas + `mongodb` driver |
| State | React Context |
| Styling | CSS Modules + global CSS |

## Project structure

```text
newsletter-events-with-context/
├── app/api/                    # Route handlers (App Router style)
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
│   ├── api-util.js             # Firebase event queries
│   └── db-util.js              # MongoDB connect/insert/list helpers
├── store/notification-context.js
├── styles/globals.css
└── dummy-data.js
```

## Getting started

### Requirements

- Node.js 18 or 20.
- npm (a `package-lock.json` is committed).
- A MongoDB Atlas cluster, database user, and network access for your IP.
- Outbound internet access to the Firebase Realtime Database endpoint.

### 1. Install dependencies

```bash
npm install
# create .env.local with DB_USER and DB_PASSWORD (see below)
```

### 2. Configure environment variables

Create a `.env` file in the project root and add the values below. Use the committed example file as a template when one exists.

```bash
DB_USER=
DB_PASSWORD=
```

| Variable | Purpose | Required |
| --- | --- | --- |
| `DB_USER` | MongoDB Atlas database user name. | Yes |
| `DB_PASSWORD` | MongoDB Atlas database user password. | Yes |

### 3. Run locally

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

## How it works

`helpers/api-util.js` fetches the Firebase `events.json` endpoint and exposes `getAllEvents`, `getFeaturedEvents`, `getEventById`, and `getFilteredEvents`. Pages call these from `getStaticProps` or `getStaticPaths`, so event data is fetched at build/revalidation time rather than in the browser.

`pages/index.js` renders featured events with `revalidate: 1800`; `pages/events/index.js` renders all events with `revalidate: 60`; `pages/events/[...slug].js` parses year and month from the catch-all route and filters the list.

The API surface lives in `app/api/` as route handlers: `POST /api/newsletter` validates an email and inserts it into the `emails` collection, while `GET` and `POST /api/comments/[eventId]` list and create comments for one event. Both use `helpers/db-util.js`.

`store/notification-context.js` exposes `showNotification` and `hideNotification`. The provider auto-dismisses settled notifications after three seconds but keeps `pending` notifications visible until they are replaced.

`pages/_app.js` wraps every page in the notification provider and the shared `Layout`, which renders the main header and content shell.

## Deployment

- Target: Vercel for the Next.js app plus MongoDB Atlas for persistence. Add `DB_USER` and `DB_PASSWORD` as project environment variables.
- The Firebase URL is public and hardcoded in `helpers/api-util.js`; no key is required, but the database rules must allow reads.
- No GitHub Actions workflow is committed. Vercel’s Git integration is the simplest deployment path for this app.
- If the app moves to Supabase, the route handlers can be pointed at Supabase Postgres while keeping the same request/response contract.

## Notes and limitations

- The MongoDB connection string in `helpers/db-util.js` hardcodes the cluster host and the `newsletter-nextjs-course` database name. Change both if you use your own cluster.
- `swr` is installed but the pages use plain `fetch`; there is no global data-fetching client.
- Comments are only fetched after the user opens the comments section.
- `dummy-data.js` and `dummy_data.json` are course leftovers and are not used by the running app.
- The notification provider never clears a `pending` notification on its own; a success or error notification must follow it.

---

**Author:** Mario Granada
