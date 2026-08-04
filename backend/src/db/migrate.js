require("dotenv").config();
const { migrate } = require("drizzle-orm/neon-http/migrator");
const { db } = require("./index");

async function runMigration() {
  if (db.isMock) {
    console.log("ℹ️ In-memory mode active. Skipping live Neon migration step.");
    return;
  }
  console.log("⏳ Running migrations...");
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrations completed successfully!");
  } catch (err) {
    console.error("❌ Migration error:", err);
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = runMigration;
