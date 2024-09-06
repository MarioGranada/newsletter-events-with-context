export async function POST(request) {
  const body = await request.json();

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

  console.log('data here', { email, name, text });
  const newComment = {
    id: new Date().toString(),
    email,
    name,
    text,
  };

  return new Response(
    JSON.stringify({
      message: 'Comment added Successfully!',
      comment: newComment,
    }),
    {
      status: 201,
    }
  );
}

export async function GET(request) {
  const dummyList = [
    {
      id: 'c1',
      name: 'sarah',
      text: 'this is a first comment',
    },
    {
      id: 'c2',
      name: 'Maximilian',
      text: 'this is a second comment',
    },
    {
      id: 'c3',
      name: 'Peter',
      text: 'this is a third comment',
    },
  ];

  return new Response(JSON.stringify({ comments: dummyList }), {
    status: 200,
  });
}
