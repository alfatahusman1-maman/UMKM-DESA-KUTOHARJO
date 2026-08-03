const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const { authMiddleware } = require("../middleware/auth");

const updateProfileSchema = z.object({
  name: z.string().min(3),
  profileImage: z.string().optional().or(z.literal("")),
  password: z.string().min(6).optional().or(z.literal("")),
});

module.exports = function (sql) {
  // PUT /api/user/settings
  router.put("/settings", authMiddleware, async (req, res) => {
    try {
      const parsed = updateProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const { name, profileImage, password } = parsed.data;
      let newPasswordHash = null;
      if (password && password.trim() !== "") {
        newPasswordHash = await bcrypt.hash(password, 10);
      }

      const updated = await sql`
        UPDATE users SET
          name = ${name},
          profile_image = COALESCE(${profileImage || null}, profile_image),
          password_hash = COALESCE(${newPasswordHash || null}, password_hash)
        WHERE id = ${req.user.id}
        RETURNING id, name, email, profile_image AS "profileImage", role
      `;

      if (!updated || updated.length === 0) {
        return res.status(404).json({ error: "Pengguna tidak ditemukan" });
      }

      return res.json({ success: true, user: updated[0] });
    } catch (error) {
      console.error("[PUT /api/user/settings]", error);
      return res.status(500).json({ error: "Gagal memperbarui profil." });
    }
  });

  return router;
};
