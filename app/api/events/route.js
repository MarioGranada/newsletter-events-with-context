import { getAllEvents } from '../../../helpers/api-util';

export const dynamic = 'force-dynamic';

// Used by the client-side (SWR) filtered events page.
export async function GET() {
  try {
    const events = await getAllEvents();
    return Response.json(events);
  } catch (error) {
    console.error('Listing events failed', error);
    return Response.json({ message: 'Error listing events' }, { status: 500 });
  }
}
