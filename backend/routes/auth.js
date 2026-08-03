const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware/auth");

module.exports = function (sql) {
  // POST /api/auth/login
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email dan kata sandi wajib diisi" });
      }

      const users = await sql`SELECT id, name, email, password_hash, profile_image, role FROM users WHERE email = ${email}`;
      if (!users || users.length === 0) {
        return res.status(400).json({ error: "Email tidak terdaftar" });
      }

      const user = users[0];
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Kata sandi salah" });
      }

      const secret = process.env.JWT_SECRET || "kutoharjo-secret-jwt-key-2026";
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        secret,
        { expiresIn: "7d" }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profile_image,
        },
      });
    } catch (error) {
      console.error("[POST /api/auth/login]", error);
      return res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  });

  // GET /api/auth/me
  router.get("/me", authMiddleware, async (req, res) => {
    try {
      const users = await sql`SELECT id, name, email, profile_image, role, created_at FROM users WHERE id = ${req.user.id}`;
      if (!users || users.length === 0) {
        return res.status(404).json({ error: "Pengguna tidak ditemukan" });
      }

      const u = users[0];
      return res.json({
        user: {
          id: u.id,
          name: u.name,
          email: u.email,
          profileImage: u.profile_image,
          role: u.role,
          createdAt: u.created_at,
        },
      });
    } catch (error) {
      console.error("[GET /api/auth/me]", error);
      return res.status(500).json({ error: "Gagal mengambil data pengguna" });
    }
  });

  return router;
};
