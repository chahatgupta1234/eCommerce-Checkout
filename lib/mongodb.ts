import { MongoClient } from "mongodb"

// Connection URI
// NOTE: You need to add your MongoDB connection string to the environment variables
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce"
console.log("MongoDB URI:", uri)

// Create a new MongoClient
const client = new MongoClient(uri)
let clientPromise: Promise<MongoClient>

// In development mode, use a global variable so that the value
// is preserved across module reloads caused by HMR (Hot Module Replacement).
if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = client.connect()
    console.log("MongoDB client connected in development mode")
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = client.connect()
  console.log("MongoDB client connected in production mode")
}
console.log("MongoDB client promise created")

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db()
  return { client, db }
}

// IMPORTANT: Add your MongoDB connection string to the environment variables
// You need to set MONGODB_URI in your environment variables
// Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
