const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/auth");

module.exports = function (sql) {
  // POST /api/admin/verify
  router.post("/verify", authMiddleware, requireRole("ADMIN", "SUPERADMIN"), async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "ID UMKM dibutuhkan" });
      }

      const updated = await sql`
        UPDATE umkms SET is_verified = TRUE, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;

      if (!updated || updated.length === 0) {
        return res.status(404).json({ error: "UMKM tidak ditemukan" });
      }

      return res.json({ success: true, data: updated[0] });
    } catch (error) {
      console.error("[POST /api/admin/verify]", error);
      return res.status(500).json({ error: "Gagal memverifikasi UMKM." });
    }
  });

  // DELETE /api/admin/delete
  router.delete("/delete", authMiddleware, requireRole("ADMIN", "SUPERADMIN"), async (req, res) => {
    try {
      const id = req.query.id || req.body.id;
      if (!id) {
        return res.status(400).json({ error: "ID UMKM dibutuhkan" });
      }

      await sql`DELETE FROM umkms WHERE id = ${id}`;
      return res.json({ success: true });
    } catch (error) {
      console.error("[DELETE /api/admin/delete]", error);
      return res.status(500).json({ error: "Gagal menghapus UMKM." });
    }
  });

  // GET /api/admin/stats
  router.get("/stats", authMiddleware, requireRole("ADMIN", "SUPERADMIN"), async (req, res) => {
    try {
      const totalUmkmsRes = await sql`SELECT COUNT(*)::int AS count FROM umkms`;
      const verifiedUmkmsRes = await sql`SELECT COUNT(*)::int AS count FROM umkms WHERE is_verified = TRUE`;
      const pendingUmkmsRes = await sql`SELECT COUNT(*)::int AS count FROM umkms WHERE is_verified = FALSE`;
      const totalUsersRes = await sql`SELECT COUNT(*)::int AS count FROM users`;

      const recentPending = await sql`
        SELECT 
          u.id, u.name, u.slug, u.owner_name AS "ownerName", u.dusun, u.created_at AS "createdAt",
          c.name AS category_name
        FROM umkms u
        LEFT JOIN categories c ON u.category_id = c.id
        WHERE u.is_verified = FALSE
        ORDER BY u.created_at DESC
        LIMIT 5
      `;

      return res.json({
        stats: {
          totalUmkm: totalUmkmsRes[0]?.count || 0,
          verifiedUmkm: verifiedUmkmsRes[0]?.count || 0,
          pendingUmkm: pendingUmkmsRes[0]?.count || 0,
          totalUser: totalUsersRes[0]?.count || 0,
        },
        recentPending: recentPending.map(r => ({
          ...r,
          category: { name: r.category_name }
        }))
      });
    } catch (error) {
      console.error("[GET /api/admin/stats]", error);
      return res.status(500).json({ error: "Gagal mengambil statistik admin." });
    }
  });

  return router;
};
