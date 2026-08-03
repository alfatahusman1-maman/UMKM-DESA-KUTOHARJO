require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const path = require("path");
const { neon } = require("@neondatabase/serverless");

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database client (Neon DB with automatic Local DB Fallback)
const sql = require("./db/client");

// Middlewares
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// Neon DB Version endpoint (Sesuai kode dari pengguna)
app.get("/version", async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(version);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Database connection error: " + err.message);
  }
});

// Root endpoint test
app.get("/", async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    const { version } = result[0] || {};
    res.json({
      status: "online",
      message: "Kutoharjo UMKM Hub Backend API Server",
      databaseVersion: version || "Unknown"
    });
  } catch (err) {
    res.json({
      status: "online",
      message: "Kutoharjo UMKM Hub Backend API Server",
      databaseError: err.message
    });
  }
});

// API Routers
const authRoutes = require("./routes/auth");
const umkmRoutes = require("./routes/umkm");
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const adminRoutes = require("./routes/admin");
const superadminRoutes = require("./routes/superadmin");
const userRoutes = require("./routes/user");
const uploadRoutes = require("./routes/upload");

app.use("/api/auth", authRoutes(sql));
app.use("/api/umkm", umkmRoutes(sql));
app.use("/api/categories", categoriesRoutes(sql));
app.use("/api/products", productsRoutes(sql));
app.use("/api/admin", adminRoutes(sql));
app.use("/api/superadmin", superadminRoutes(sql));
app.use("/api/user", userRoutes(sql));
app.use("/api/upload", uploadRoutes());

// Node HTTP Server creation
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`🚀 Backend Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;

