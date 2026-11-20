import { MongoClient } from "mongodb";

// Shared MongoDB client — one connection per process.
const globalForMongo = globalThis;

if (!globalForMongo.wedPlanMongoClient) {
  globalForMongo.wedPlanMongoClient = new MongoClient(process.env.MONGODB_URI);
}

const client = globalForMongo.wedPlanMongoClient;

export const db = client.db("wed_plan");
