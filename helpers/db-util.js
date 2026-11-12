import sql from './db';

// Comments and newsletter sign-ups, stored in the `newsletter` schema.

export async function insertComment({ eventId, email, name, text }) {
  const [comment] = await sql`
    insert into newsletter.comments (event_id, email, name, text)
    values (${eventId}, ${email}, ${name}, ${text})
    returning id, name, text
  `;
  return comment;
}

// Only public fields: commenter emails are never sent to the browser.
export async function getCommentsForEvent(eventId) {
  return sql`
    select id, name, text from newsletter.comments
    where event_id = ${eventId}
    order by id desc
  `;
}

export async function insertNewsletterEmail(email) {
  await sql`
    insert into newsletter.emails (email) values (${email})
    on conflict (email) do nothing
  `;
}
