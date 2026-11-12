import { insertNewsletterEmail } from '../../../helpers/db-util';

export async function POST(request) {
  const body = await request.json();
  const userEmail = body.email;

  if (typeof userEmail !== 'string' || !userEmail.includes('@')) {
    return Response.json({ message: 'Invalid email address.' }, { status: 422 });
  }

  try {
    await insertNewsletterEmail(userEmail.trim().toLowerCase());
  } catch (error) {
    console.error('Newsletter sign-up failed', error);
    return Response.json({ message: 'Error adding newsletter email' }, { status: 500 });
  }

  return Response.json({ message: 'Signed up!' }, { status: 201 });
}
