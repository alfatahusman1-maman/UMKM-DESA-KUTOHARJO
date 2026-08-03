const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const slugify = require("slugify");
const { z } = require("zod");
const { authMiddleware, requireRole } = require("../middleware/auth");

const createUmkmSchema = z.object({
  categoryId: z.string(),
  name: z.string().min(3),
  ownerName: z.string().min(3),
  description: z.string().min(10),
  address: z.string().min(5),
  dusun: z.string(),
  operationalHours: z.string().optional().or(z.literal("")).nullable(),
  whatsappNumber: z.string().min(8),
  mapsUrl: z.string().optional().or(z.literal("")).nullable(),
  instagramUrl: z.string().optional().or(z.literal("")).nullable(),
  imageUrl: z.string(),
});

module.exports = function (sql) {
  // GET /api/umkm
  router.get("/", async (req, res) => {
    try {
      const search = (req.query.search || "").trim();
      const categorySlug = req.query.category || null;
      const dusun = req.query.dusun || null;
      const page = Math.max(1, parseInt(req.query.page || "1", 10));
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || "12", 10)));
      const offset = (page - 1) * limit;

      // Construct dynamic SQL filter
      let whereClause = `WHERE u.is_verified = TRUE`;
      const params = [];

      if (categorySlug) {
        whereClause += ` AND c.slug = ${sql(categorySlug)}`;
      }

      if (dusun) {
        whereClause += ` AND u.dusun = ${sql(dusun)}`;
      }

      if (search) {
        const searchPattern = `%${search}%`;
        whereClause += ` AND (u.name ILIKE ${sql(searchPattern)} OR u.description ILIKE ${sql(searchPattern)})`;
      }

      const countResult = await sql`
        SELECT COUNT(u.id)::int AS total
        FROM umkms u
        LEFT JOIN categories c ON u.category_id = c.id
        ${search || categorySlug || dusun ? sql`WHERE u.is_verified = TRUE 
          ${categorySlug ? sql`AND c.slug = ${categorySlug}` : sql``}
          ${dusun ? sql`AND u.dusun = ${dusun}` : sql``}
          ${search ? sql`AND (u.name ILIKE ${`%${search}%`} OR u.description ILIKE ${`%${search}%`})` : sql``}
        ` : sql`WHERE u.is_verified = TRUE`}
      `;
      const total = countResult[0]?.total || 0;

      const items = await sql`
        SELECT 
          u.id, u.user_id AS "userId", u.category_id AS "categoryId",
          u.name, u.slug, u.owner_name AS "ownerName", u.description,
          u.address, u.dusun, u.operational_hours AS "operationalHours",
          u.whatsapp_number AS "whatsappNumber", u.maps_url AS "mapsUrl",
          u.instagram_url AS "instagramUrl", u.image_url AS "imageUrl",
          u.is_verified AS "isVerified", u.created_at AS "createdAt", u.updated_at AS "updatedAt",
          c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug, c.icon_name AS cat_icon
        FROM umkms u
        LEFT JOIN categories c ON u.category_id = c.id
        WHERE u.is_verified = TRUE
        ${categorySlug ? sql`AND c.slug = ${categorySlug}` : sql``}
        ${dusun ? sql`AND u.dusun = ${dusun}` : sql``}
        ${search ? sql`AND (u.name ILIKE ${`%${search}%`} OR u.description ILIKE ${`%${search}%`})` : sql``}
        ORDER BY u.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      // Format response with category and products
      const formattedItems = await Promise.all(
        items.map(async (row) => {
          const products = await sql`
            SELECT id, title, price, description, image_url AS "imageUrl", created_at AS "createdAt"
            FROM products WHERE umkm_id = ${row.id} ORDER BY created_at DESC
          `;
          return {
            id: row.id,
            userId: row.userId,
            categoryId: row.categoryId,
            name: row.name,
            slug: row.slug,
            ownerName: row.ownerName,
            description: row.description,
            address: row.address,
            dusun: row.dusun,
            operationalHours: row.operationalHours,
            whatsappNumber: row.whatsappNumber,
            mapsUrl: row.mapsUrl,
            instagramUrl: row.instagramUrl,
            imageUrl: row.imageUrl,
            isVerified: row.isVerified,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            category: row.cat_id ? {
              id: row.cat_id,
              name: row.cat_name,
              slug: row.cat_slug,
              iconName: row.cat_icon
            } : null,
            products: products || []
          };
        })
      );

      return res.json({
        data: formattedItems,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
      });
    } catch (error) {
      console.error("[GET /api/umkm]", error);
      return res.status(500).json({ error: "Gagal mengambil data UMKM." });
    }
  });

  // GET /api/umkm/:slug
  router.get("/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const rows = await sql`
        SELECT 
          u.id, u.user_id AS "userId", u.category_id AS "categoryId",
          u.name, u.slug, u.owner_name AS "ownerName", u.description,
          u.address, u.dusun, u.operational_hours AS "operationalHours",
          u.whatsapp_number AS "whatsappNumber", u.maps_url AS "mapsUrl",
          u.instagram_url AS "instagramUrl", u.image_url AS "imageUrl",
          u.is_verified AS "isVerified", u.created_at AS "createdAt", u.updated_at AS "updatedAt",
          c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug, c.icon_name AS cat_icon,
          usr.name AS usr_name, usr.email AS usr_email
        FROM umkms u
        LEFT JOIN categories c ON u.category_id = c.id
        LEFT JOIN users usr ON u.user_id = usr.id
        WHERE u.slug = ${slug}
      `;

      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: "UMKM tidak ditemukan." });
      }

      const row = rows[0];
      const products = await sql`
        SELECT id, umkm_id AS "umkmId", title, price, description, image_url AS "imageUrl", created_at AS "createdAt"
        FROM products WHERE umkm_id = ${row.id} ORDER BY created_at DESC
      `;

      const data = {
        id: row.id,
        userId: row.userId,
        categoryId: row.categoryId,
        name: row.name,
        slug: row.slug,
        ownerName: row.ownerName,
        description: row.description,
        address: row.address,
        dusun: row.dusun,
        operationalHours: row.operationalHours,
        whatsappNumber: row.whatsappNumber,
        mapsUrl: row.mapsUrl,
        instagramUrl: row.instagramUrl,
        imageUrl: row.imageUrl,
        isVerified: row.isVerified,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        category: row.cat_id ? {
          id: row.cat_id,
          name: row.cat_name,
          slug: row.cat_slug,
          iconName: row.cat_icon
        } : null,
        user: { name: row.usr_name, email: row.usr_email },
        products: products || []
      };

      return res.json({ data });
    } catch (error) {
      console.error("[GET /api/umkm/:slug]", error);
      return res.status(500).json({ error: "Gagal mengambil detail UMKM." });
    }
  });

  // POST /api/umkm
  router.post("/", authMiddleware, requireRole("ADMIN", "SUPERADMIN"), async (req, res) => {
    try {
      const parsed = createUmkmSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }

      const data = parsed.data;
      const baseSlug = slugify(data.name, { lower: true, strict: true }) || "umkm";

      let generatedSlug = baseSlug;
      let suffix = 1;
      while (true) {
        const existing = await sql`SELECT id FROM umkms WHERE slug = ${generatedSlug}`;
        if (!existing || existing.length === 0) break;
        generatedSlug = `${baseSlug}-${suffix++}`;
      }

      const id = "umkm-" + crypto.randomBytes(8).toString("hex");
      const userId = req.user.id;

      const inserted = await sql`
        INSERT INTO umkms (
          id, user_id, category_id, name, slug, owner_name, description, address, dusun,
          operational_hours, whatsapp_number, maps_url, instagram_url, image_url, is_verified
        ) VALUES (
          ${id}, ${userId}, ${data.categoryId}, ${data.name}, ${generatedSlug}, ${data.ownerName},
          ${data.description}, ${data.address}, ${data.dusun}, ${data.operationalHours || null},
          ${data.whatsappNumber}, ${data.mapsUrl || null}, ${data.instagramUrl || null},
          ${data.imageUrl}, TRUE
        )
        RETURNING *
      `;

      return res.status(201).json({ data: inserted[0] });
    } catch (error) {
      console.error("[POST /api/umkm]", error);
      return res.status(500).json({ error: "Gagal membuat UMKM baru." });
    }
  });

  // PUT /api/umkm/:slug
  router.put("/:slug", authMiddleware, async (req, res) => {
    try {
      const { slug } = req.params;
      const existing = await sql`SELECT id FROM umkms WHERE slug = ${slug}`;
      if (!existing || existing.length === 0) {
        return res.status(404).json({ error: "UMKM tidak ditemukan." });
      }

      const body = req.body;
      const {
        name, ownerName, description, address, dusun, operationalHours,
        whatsappNumber, mapsUrl, instagramUrl, imageUrl, categoryId, isVerified
      } = body;

      const updated = await sql`
        UPDATE umkms SET
          name = COALESCE(${name || null}, name),
          owner_name = COALESCE(${ownerName || null}, owner_name),
          description = COALESCE(${description || null}, description),
          address = COALESCE(${address || null}, address),
          dusun = COALESCE(${dusun || null}, dusun),
          operational_hours = ${operationalHours || null},
          whatsapp_number = COALESCE(${whatsappNumber || null}, whatsapp_number),
          maps_url = ${mapsUrl || null},
          instagram_url = ${instagramUrl || null},
          image_url = COALESCE(${imageUrl || null}, image_url),
          category_id = COALESCE(${categoryId || null}, category_id),
          is_verified = COALESCE(${isVerified !== undefined ? isVerified : null}, is_verified),
          updated_at = CURRENT_TIMESTAMP
        WHERE slug = ${slug}
        RETURNING *
      `;

      return res.json({ data: updated[0] });
    } catch (error) {
      console.error("[PUT /api/umkm/:slug]", error);
      return res.status(500).json({ error: "Gagal memperbarui UMKM." });
    }
  });

  // DELETE /api/umkm/:slug
  router.delete("/:slug", authMiddleware, requireRole("ADMIN", "SUPERADMIN"), async (req, res) => {
    try {
      const { slug } = req.params;
      const existing = await sql`SELECT id FROM umkms WHERE slug = ${slug}`;
      if (!existing || existing.length === 0) {
        return res.status(404).json({ error: "UMKM tidak ditemukan." });
      }

      await sql`DELETE FROM umkms WHERE slug = ${slug}`;
      return res.json({ data: { success: true } });
    } catch (error) {
      console.error("[DELETE /api/umkm/:slug]", error);
      return res.status(500).json({ error: "Gagal menghapus UMKM." });
    }
  });

  return router;
};
