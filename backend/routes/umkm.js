const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const slugify = require("slugify");
const { authMiddleware, requireRole } = require("../middleware/auth");
const validate = require("../src/middleware/validate");
const { umkmSchema, reviewSchema } = require("../src/validators/schemas");

module.exports = function (sql) {
  // GET /api/umkm (Public Catalog with price range filter, search, category, dusun, pagination)
  router.get("/", async (req, res) => {
    try {
      const search = (req.query.search || "").trim();
      const categorySlug = req.query.category || null;
      const dusun = req.query.dusun || null;
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;

      const page = Math.max(1, parseInt(req.query.page || "1", 10));
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || "6", 10)));
      const offset = (page - 1) * limit;

      const items = await sql`
        SELECT 
          u.id, u.user_id AS "userId", u.category_id AS "categoryId",
          u.name, u.slug, u.owner_name AS "ownerName", u.description,
          u.address, u.dusun, u.operational_hours AS "operationalHours",
          u.whatsapp_number AS "whatsappNumber", u.maps_url AS "mapsUrl",
          u.instagram_url AS "instagramUrl", u.image_url AS "imageUrl",
          u.is_verified AS "isVerified", u.certifications, u.latitude, u.longitude,
          u.rating, u.review_count AS "reviewCount",
          u.created_at AS "createdAt", u.updated_at AS "updatedAt",
          c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug, c.icon_name AS cat_icon
        FROM umkms u
        LEFT JOIN categories c ON u.category_id = c.id
        WHERE u.is_verified = TRUE
        ${categorySlug ? sql`AND c.slug = ${categorySlug}` : sql``}
        ${dusun ? sql`AND u.dusun = ${dusun}` : sql``}
        ${search ? sql`AND (u.name ILIKE ${`%${search}%`} OR u.description ILIKE ${`%${search}%`})` : sql``}
        ORDER BY u.created_at DESC
      `;

      // Filter products & prices if minPrice / maxPrice passed
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
            certifications: row.certifications || [],
            latitude: row.latitude,
            longitude: row.longitude,
            rating: row.rating || "0.00",
            reviewCount: row.reviewCount || 0,
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

      // Price Filtering logic
      let filtered = formattedItems;
      if (minPrice !== null || maxPrice !== null) {
        filtered = formattedItems.filter((u) => {
          if (!u.products || u.products.length === 0) return true;
          return u.products.some((p) => {
            const price = parseFloat(p.price);
            if (minPrice !== null && price < minPrice) return false;
            if (maxPrice !== null && price > maxPrice) return false;
            return true;
          });
        });
      }

      const total = filtered.length;
      const paginatedItems = filtered.slice(offset, offset + limit);

      return res.json({
        data: paginatedItems,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        }
      });
    } catch (error) {
      console.error("[GET /api/umkm]", error);
      return res.status(500).json({ error: "Gagal mengambil data UMKM." });
    }
  });

  // GET /api/umkm/:slug (Detail UMKM)
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
          u.is_verified AS "isVerified", u.certifications, u.latitude, u.longitude,
          u.rating, u.review_count AS "reviewCount",
          u.created_at AS "createdAt", u.updated_at AS "updatedAt",
          c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug, c.icon_name AS cat_icon
        FROM umkms u
        LEFT JOIN categories c ON u.category_id = c.id
        WHERE u.slug = ${slug} OR u.id::text = ${slug}
      `;

      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: "UMKM tidak ditemukan." });
      }

      const row = rows[0];
      const products = await sql`
        SELECT id, umkm_id AS "umkmId", title, price, description, image_url AS "imageUrl", created_at AS "createdAt"
        FROM products WHERE umkm_id = ${row.id} ORDER BY created_at DESC
      `;

      const reviewsList = await sql`
        SELECT id, name, rating, comment, created_at AS "createdAt"
        FROM reviews WHERE umkm_id = ${row.id} ORDER BY created_at DESC
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
        certifications: row.certifications || [],
        latitude: row.latitude,
        longitude: row.longitude,
        rating: row.rating || "0.00",
        reviewCount: row.reviewCount || 0,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        category: row.cat_id ? {
          id: row.cat_id,
          name: row.cat_name,
          slug: row.cat_slug,
          iconName: row.cat_icon
        } : null,
        products: products || [],
        reviews: reviewsList || [],
      };

      return res.json({ data });
    } catch (error) {
      console.error("[GET /api/umkm/:slug]", error);
      return res.status(500).json({ error: "Gagal mengambil detail UMKM." });
    }
  });

  // POST /api/umkm (Admin Create UMKM)
  router.post("/", authMiddleware, requireRole("ADMIN", "SUPERADMIN"), validate(umkmSchema), async (req, res) => {
    try {
      const data = req.body;
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
          operational_hours, whatsapp_number, maps_url, instagram_url, image_url, is_verified,
          certifications, latitude, longitude
        ) VALUES (
          ${id}, ${userId}, ${data.categoryId}, ${data.name}, ${generatedSlug}, ${data.ownerName},
          ${data.description || ""}, ${data.address}, ${data.dusun}, ${data.operationalHours || null},
          ${data.whatsappNumber || ""}, ${data.mapsUrl || null}, ${data.instagramUrl || null},
          ${data.imageUrl || ""}, TRUE,
          ${JSON.stringify(data.certifications || [])}, ${data.latitude || null}, ${data.longitude || null}
        )
        RETURNING *
      `;

      return res.status(201).json({ data: inserted[0] });
    } catch (error) {
      console.error("[POST /api/umkm]", error);
      return res.status(500).json({ error: "Gagal membuat UMKM baru." });
    }
  });

  // PUT /api/umkm/:slug (Admin Edit UMKM)
  router.put("/:slug", authMiddleware, async (req, res) => {
    try {
      const { slug } = req.params;
      const existing = await sql`SELECT id FROM umkms WHERE slug = ${slug} OR id::text = ${slug}`;
      if (!existing || existing.length === 0) {
        return res.status(404).json({ error: "UMKM tidak ditemukan." });
      }

      const body = req.body;
      const {
        name, ownerName, description, address, dusun, operationalHours,
        whatsappNumber, mapsUrl, instagramUrl, imageUrl, categoryId, isVerified,
        certifications, latitude, longitude
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
          certifications = COALESCE(${certifications ? JSON.stringify(certifications) : null}, certifications),
          latitude = COALESCE(${latitude || null}, latitude),
          longitude = COALESCE(${longitude || null}, longitude),
          updated_at = CURRENT_TIMESTAMP
        WHERE slug = ${slug} OR id::text = ${slug}
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
      await sql`DELETE FROM umkms WHERE slug = ${slug} OR id::text = ${slug}`;
      return res.json({ data: { success: true } });
    } catch (error) {
      console.error("[DELETE /api/umkm/:slug]", error);
      return res.status(500).json({ error: "Gagal menghapus UMKM." });
    }
  });

  // POST /api/umkm/:id/review (Fitur 6: Ulasan & Rating Publik)
  router.post("/:id/review", validate(reviewSchema), async (req, res) => {
    try {
      const { id } = req.params;
      const { name, rating, comment } = req.body;

      const reviewId = "rev-" + crypto.randomBytes(6).toString("hex");
      const inserted = await sql`
        INSERT INTO reviews (id, umkm_id, name, rating, comment)
        VALUES (${reviewId}, ${id}, ${name}, ${rating}, ${comment})
        RETURNING *
      `;

      // Update aggregate rating on umkm
      const reviews = await sql`SELECT rating FROM reviews WHERE umkm_id = ${id}`;
      const count = reviews.length;
      const sum = reviews.reduce((acc, cur) => acc + Number(cur.rating), 0);
      const avgRating = (sum / (count || 1)).toFixed(2);

      await sql`
        UPDATE umkms SET rating = ${avgRating}, review_count = ${count} WHERE id = ${id} OR slug = ${id}
      `;

      return res.status(201).json({
        success: true,
        message: "Ulasan berhasil dikirim. Terima kasih atas masukan Anda!",
        data: inserted[0],
      });
    } catch (error) {
      console.error("[POST /api/umkm/:id/review]", error);
      return res.status(500).json({ error: "Gagal mengirim ulasan." });
    }
  });

  // GET /api/umkm/:id/reviews
  router.get("/:id/reviews", async (req, res) => {
    try {
      const { id } = req.params;
      const reviews = await sql`
        SELECT id, name, rating, comment, created_at AS "createdAt"
        FROM reviews WHERE umkm_id = ${id} OR umkm_id::text = ${id}
        ORDER BY created_at DESC
      `;
      return res.json({ data: reviews });
    } catch (error) {
      console.error("[GET /api/umkm/:id/reviews]", error);
      return res.status(500).json({ error: "Gagal mengambil ulasan." });
    }
  });

  return router;
};
