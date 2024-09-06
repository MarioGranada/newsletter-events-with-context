// import { MongoClient } from 'mongodb';
import { connectDB, insertDocument } from '../../../helpers/db-util';

// const connectDB = async () => {
//   const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vfrndqf.mongodb.net/newsletter-nextjs-course?retryWrites=true&w=majority&appName=Cluster0`;
//   const client = await MongoClient.connect(dbUrl);

//   return client;
// };

// const insertDocument = async (client, document) => {
//   const db = client.db();
//   await db.collection('emails').insertOne(document);
// };

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

  // const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vfrndqf.mongodb.net/newsletter-nextjs-course?retryWrites=true&w=majority&appName=Cluster0`;
  // const client = await MongoClient.connect(dbUrl);
  // // client.db('events');

  // const db = client.db();
  // await db.collection('emails').insertOne({ email: userEmail });

  // const response = new Response(JSON.stringify({ message: 'Signed up!' }), {
  //   status: 201,
  //   headers: { 'Content-Type': 'application/json' },
  // });

  // return response;
  let client;

  try {
    client = await connectDB();
    await insertDocument(client, 'emails', { email: userEmail });
    // client.close();
  } catch (error) {
    const response = new Response(
      JSON.stringify({ message: 'Error adding newsletter email', error }),
      {
        status: 500,
      }
    );
    client?.close();
    return response;
  }

  client.close();
  const response = new Response(JSON.stringify({ message: 'Signed up!' }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });

  return response;
}
