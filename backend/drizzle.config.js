require("dotenv").config();

/** @type { import("drizzle-kit").Config } */
module.exports = {
  schema: "./src/db/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://neondb_owner:dummy@ep-dummy.us-east-2.aws.neon.tech/neondb?sslmode=require",
  },
};
