require("dotenv").config();
const { neon } = require("@neondatabase/serverless");
const { drizzle } = require("drizzle-orm/neon-http");
const schema = require("./schema");

const connectionString = process.env.DATABASE_URL;

let db;
let sqlClient;

if (connectionString && !connectionString.includes("dummy")) {
  sqlClient = neon(connectionString);
  db = drizzle(sqlClient, { schema });
} else {
  // Mock DB / fallback wrapper if connection string not provided
  console.log("ℹ️ DATABASE_URL not set or dummy. Initializing in-memory Drizzle fallback client.");
  db = {
    isMock: true,
    schema,
  };
}

module.exports = {
  db,
  sqlClient,
  schema,
};
