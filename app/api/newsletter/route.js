import { MongoClient } from 'mongodb';

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

  const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vfrndqf.mongodb.net/newsletter-nextjs-course?retryWrites=true&w=majority&appName=Cluster0`;
  const client = await MongoClient.connect(dbUrl);
  // client.db('events');

  const db = client.db();
  await db.collection('emails').insertOne({ email: userEmail });

  client.close();

  const response = new Response(JSON.stringify({ message: 'Signed up!' }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });

  return response;
}
