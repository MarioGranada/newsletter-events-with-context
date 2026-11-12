import sql from './db';

// Event catalogue, read from the `newsletter` schema in Supabase Postgres.
// Server-only: called from getStaticProps/getStaticPaths and route handlers.
const columns = sql`
  id, title, description, location, image,
  to_char(date, 'YYYY-MM-DD') as date,
  is_featured as "isFeatured"
`;

export async function getAllEvents() {
  return sql`select ${columns} from newsletter.events order by date`;
}

export async function getFeaturedEvents() {
  return sql`select ${columns} from newsletter.events where is_featured order by date`;
}

export async function getEventById(id) {
  const [event] = await sql`select ${columns} from newsletter.events where id = ${id}`;
  return event;
}

export async function getFilteredEvents({ year, month }) {
  return sql`
    select ${columns} from newsletter.events
    where extract(year from date) = ${year} and extract(month from date) = ${month}
    order by date
  `;
}
