import { MongoClient } from 'mongodb';

export const connectDB = async () => {
  const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vfrndqf.mongodb.net/newsletter-nextjs-course?retryWrites=true&w=majority&appName=Cluster0`;
  const client = await MongoClient.connect(dbUrl);

  return client;
};

export const insertDocument = async (client, collection, document) => {
  const db = client.db();
  //   await db.collection('emails').insertOne(document);
  const result = await db.collection(collection).insertOne(document);
  return result;
};

export const getAllDocuments = async (client, collection, filter, sort) => {
  const db = client.db();
  const documents = await db
    .collection(collection)
    .find(filter)
    .sort(sort)
    .toArray();
  return documents;
};
