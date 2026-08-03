const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { z } = require("zod");
const { authMiddleware, requireRole } = require("../middleware/auth");

const createAdminSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

module.exports = function (sql) {
  // GET /api/superadmin/admins
  router.get("/admins", authMiddleware, requireRole("SUPERADMIN"), async (req, res) => {
    try {
      const admins = await sql`
        SELECT id, name, email, role, created_at AS "createdAt"
        FROM users WHERE role = 'ADMIN'
        ORDER BY created_at DESC
      `;
      return res.json({ data: admins });
    } catch (error) {
      console.error("[GET /api/superadmin/admins]", error);
      return res.status(500).json({ error: "Gagal mengambil data admin." });
    }
  });

  // POST /api/superadmin/admins
  router.post("/admins", authMiddleware, requireRole("SUPERADMIN"), async (req, res) => {
    try {
      const parsed = createAdminSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const { name, email, password } = parsed.data;

      const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
      if (existing && existing.length > 0) {
        return res.status(400).json({ error: "Email sudah digunakan" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const id = "usr-" + crypto.randomBytes(8).toString("hex");

      const inserted = await sql`
        INSERT INTO users (id, name, email, password_hash, role)
        VALUES (${id}, ${name}, ${email}, ${passwordHash}, 'ADMIN')
        RETURNING id, name, email, role
      `;

      return res.status(201).json({ data: inserted[0] });
    } catch (error) {
      console.error("[POST /api/superadmin/admins]", error);
      return res.status(500).json({ error: "Gagal membuat admin." });
    }
  });

  // DELETE /api/superadmin/admins
  router.delete("/admins", authMiddleware, requireRole("SUPERADMIN"), async (req, res) => {
    try {
      const id = req.query.id || req.body.id;
      if (!id) {
        return res.status(400).json({ error: "ID dibutuhkan" });
      }

      await sql`DELETE FROM users WHERE id = ${id}`;
      return res.json({ success: true });
    } catch (error) {
      console.error("[DELETE /api/superadmin/admins]", error);
      return res.status(500).json({ error: "Gagal menghapus admin." });
    }
  });

  // GET /api/superadmin/settings
  router.get("/settings", async (req, res) => {
    try {
      const settings = await sql`SELECT key, value FROM site_settings`;
      const data = settings.reduce((acc, cur) => {
        acc[cur.key] = cur.value;
        return acc;
      }, {});

      return res.json({ data });
    } catch (error) {
      console.error("[GET /api/superadmin/settings]", error);
      return res.status(500).json({ error: "Gagal mengambil pengaturan." });
    }
  });

  // PUT /api/superadmin/settings
  router.put("/settings", authMiddleware, requireRole("SUPERADMIN"), async (req, res) => {
    try {
      const body = req.body;
      const entries = Object.entries(body);

      for (const [key, value] of entries) {
        const id = "st-" + crypto.randomBytes(6).toString("hex");
        await sql`
          INSERT INTO site_settings (id, key, value)
          VALUES (${id}, ${key}, ${String(value)})
          ON CONFLICT (key) DO UPDATE SET value = ${String(value)};
        `;
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("[PUT /api/superadmin/settings]", error);
      return res.status(500).json({ error: "Gagal menyimpan pengaturan." });
    }
  });

  return router;
};
