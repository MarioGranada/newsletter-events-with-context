export async function POST(request) {
  const body = await request.json();
  // const body = { email: 'this@isatest.com' };
  const userEmail = body.email;

  if (!userEmail || !userEmail.includes('@')) {
    return new Response(
      { message: 'Invalid email address.' },
      {
        status: 422,
      }
    );
  }

  console.log('User Email', { message: 'Signed up!', userEmail });

  const response = new Response(JSON.stringify({ message: 'Signed up!' }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });

  return response;
}
