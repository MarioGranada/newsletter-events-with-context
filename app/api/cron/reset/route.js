import sql from '../../../../helpers/db';

export const dynamic = 'force-dynamic';

// Nightly Vercel Cron (vercel.json): deletes visitor comments and newsletter
// emails so the public demo stays clean (events are untouched). Vercel sends
// `Authorization: Bearer $CRON_SECRET`; without the secret every request is
// refused.
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  await sql`truncate newsletter.comments, newsletter.emails`;

  return Response.json({ message: 'Demo data reset.' });
}
