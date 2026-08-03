const { neon } = require("@neondatabase/serverless");
const { executeLocalSql } = require("./local_db");

let isNeonActive = false;
let neonSql = null;

if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("your_neon_password")) {
  try {
    neonSql = neon(process.env.DATABASE_URL);
    isNeonActive = true;
  } catch (err) {
    console.warn("⚠️ Neon DB client creation failed:", err.message);
  }
}

async function dbQuery(strings, ...values) {
  if (isNeonActive && neonSql) {
    try {
      return await neonSql(strings, ...values);
    } catch (err) {
      if (!dbQuery.warned) {
        console.warn("⚠️ Neon DB connection/auth failed (" + err.message + "). Automatically switching to Local Database Store.");
        dbQuery.warned = true;
      }
      isNeonActive = false;
    }
  }

  return await executeLocalSql(strings, values);
}

module.exports = dbQuery;
