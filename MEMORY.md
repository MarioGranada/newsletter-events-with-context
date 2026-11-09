# Next.js Events & Newsletter — Working Memory

_Last updated: 2026-11-02_

## Current status

- Featured, all-events, filtered, and detail pages are implemented.
- Newsletter and comment route handlers persist to MongoDB Atlas.
- Notification context is wired into both forms.
- No tests or deployment workflow yet.

## Key decisions

- Kept event data on Firebase to match the course and avoid building an event API.
- Used MongoDB only for write-oriented features (newsletter and comments).
- Used route handlers under `app/api/` while keeping the Pages Router for screens.

## Known limitations and follow-ups

- The MongoDB host and database name are hardcoded in the helper.
- No authentication, comment moderation, or rate limiting.
- No connection pooling across serverless invocations.
- `swr` is an unused dependency.

## Mistakes to avoid

- Do not assume the API lives under `pages/api/`; it is under `app/api/`.
- Forgetting `DB_USER` or `DB_PASSWORD` makes newsletter and comment requests fail with a 500.
- Re-running the build with an unreachable Firebase endpoint fails static generation.

## Next steps

- Move the MongoDB URI and database name into environment variables.
- Add rate limiting and basic spam protection to the public forms.
- Remove unused course leftovers such as `dummy-data.js` and `swr`.
- Add a deployment workflow or document the Vercel setup.

---

Keep this file under ~60 lines. Summarise or delete notes that no longer add value.
