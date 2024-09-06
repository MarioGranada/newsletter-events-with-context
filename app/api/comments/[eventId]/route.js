import { MongoClient } from 'mongodb';

export async function POST(request, { params }) {
  const body = await request.json();
  const { eventId } = params;

  const { email, name, text } = body;

  if (
    !email.includes('@') ||
    !name ||
    name.trim() === '' ||
    !text ||
    text.trim() === ''
  ) {
    return new Response(JSON.stringify({ message: 'Invalid input.' }), {
      status: 422,
    });
  }

  // const newComment = {
  //   id: new Date().toString(),
  //   email,
  //   name,
  //   text,
  // };

  const newComment = {
    email,
    name,
    text,
    eventId,
  };

  console.log('data here', { newComment });

  const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vfrndqf.mongodb.net/newsletter-nextjs-course?retryWrites=true&w=majority&appName=Cluster0`;
  const client = await MongoClient.connect(dbUrl);
  const db = client.db();
  const result = await db.collection('comments').insertOne(newComment);
  console.log('in here oe result', { result });
  client.close();

  return new Response(
    JSON.stringify({
      message: 'Comment added Successfully!',
      comment: { ...newComment, id: result.insertedId },
    }),
    {
      status: 201,
    }
  );
}

export async function GET(request, { params }) {
  const { eventId } = params;
  // const dummyList = [
  //   {
  //     id: 'c1',
  //     name: 'sarah',
  //     text: 'this is a first comment',
  //   },
  //   {
  //     id: 'c2',
  //     name: 'Maximilian',
  //     text: 'this is a second comment',
  //   },
  //   {
  //     id: 'c3',
  //     name: 'Peter',
  //     text: 'this is a third comment',
  //   },
  // ];

  // return new Response(JSON.stringify({ comments: dummyList }), {
  //   status: 200,
  // });

  const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vfrndqf.mongodb.net/newsletter-nextjs-course?retryWrites=true&w=majority&appName=Cluster0`;
  const client = await MongoClient.connect(dbUrl);
  const db = client.db();
  const result = await db
    .collection('comments')
    .find({ eventId: eventId })
    .sort({ _id: -1 })
    .toArray();
  client.close();

  return new Response(
    JSON.stringify({
      comments: result.map((item) => ({ ...item, id: item._id })),
    }),
    {
      status: 200,
    }
  );
}
