import { getCommentsForEvent, insertComment } from '../../../../helpers/db-util';

export const dynamic = 'force-dynamic';

const isBlank = (value) => typeof value !== 'string' || value.trim() === '';

export async function POST(request, { params }) {
  const { eventId } = params;
  const { email, name, text } = await request.json();

  if (isBlank(email) || !email.includes('@') || isBlank(name) || isBlank(text)) {
    return Response.json({ message: 'Invalid input.' }, { status: 422 });
  }

  try {
    const comment = await insertComment({ eventId, email, name, text });
    return Response.json(
      { message: 'Comment added Successfully!', comment },
      { status: 201 }
    );
  } catch (error) {
    // 23503 = foreign_key_violation: the event does not exist.
    if (error.code === '23503') {
      return Response.json({ message: 'Event not found.' }, { status: 404 });
    }
    console.error('Adding comment failed', error);
    return Response.json({ message: 'Error adding comment' }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  const { eventId } = params;

  try {
    const comments = await getCommentsForEvent(eventId);
    return Response.json({ comments });
  } catch (error) {
    console.error('Listing comments failed', error);
    return Response.json({ message: 'Error listing comments' }, { status: 500 });
  }
}
