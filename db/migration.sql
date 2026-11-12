-- newsletter-events-with-context schema + seed (idempotent). Run with: npm run db:migrate
-- Replaces the (now deactivated) Firebase events endpoint and MongoDB Atlas.
create schema if not exists newsletter;

create table if not exists newsletter.events (
  id text primary key,
  title text not null,
  description text not null,
  location text not null,
  date date not null,
  image text not null,
  is_featured boolean not null default false
);

create table if not exists newsletter.comments (
  id serial primary key,
  event_id text not null references newsletter.events (id) on delete cascade,
  email text not null,
  name text not null,
  text text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_event_id_idx on newsletter.comments (event_id);

create table if not exists newsletter.emails (
  id serial primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Not exposed through the Supabase Data API; the app queries server-side only.
alter table newsletter.events enable row level security;
alter table newsletter.comments enable row level security;
alter table newsletter.emails enable row level security;

insert into newsletter.events (id, title, description, location, date, image, is_featured) values
  ('e1', 'Programming for everyone', 'Everyone can learn to code! Yes, everyone! In this live event, we are going to go through all the key basics and get you started with programming as well.', 'Somestreet 25, 12345 San Somewhereo', '2021-05-12', 'images/coding-event.jpg', false),
  ('e2', 'Networking for introverts', 'We know: Networking is no fun if you are an introvert person. That''s why we came up with this event - it''ll be so much easier. Promised!', 'New Wall Street 5, 98765 New Work', '2021-05-30', 'images/introvert-event.jpg', true),
  ('e3', 'Networking for extroverts', 'You probably need no help with networking in general. But focusing your energy correctly - that is something where most people can improve.', 'My Street 12, 10115 Broke City', '2022-04-10', 'images/extrovert-event.jpg', true)
on conflict (id) do nothing;
