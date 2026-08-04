import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server";

describe("Backend UMKM & Public API Integration Tests", () => {
  it("GET /api/umkm - should return list of verified UMKMs with pagination metadata", async () => {
    const res = await request(app).get("/api/umkm?page=1&limit=6");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("meta");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta.page).toBe(1);
    expect(res.body.meta.limit).toBe(6);
  });

  it("GET /api/umkm - should filter items by search query", async () => {
    const res = await request(app).get("/api/umkm?search=Bandeng");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /api/umkm - should filter items by price range", async () => {
    const res = await request(app).get("/api/umkm?minPrice=10000&maxPrice=100000");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /api/umkm/:id/review - should validate review input (min length)", async () => {
    const res = await request(app)
      .post("/api/umkm/1/review")
      .send({
        name: "A",
        rating: 6,
        comment: "Hi",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/umkm/:id/review - should create review and return 201", async () => {
    const res = await request(app)
      .post("/api/umkm/1/review")
      .send({
        name: "Pengunjung Tes QA",
        rating: 5,
        comment: "Produk UMKM ini sangat luar biasa dan direkomendasikan!",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("name", "Pengunjung Tes QA");
  });

  it("GET /api/export/umkm - should download Excel (.xlsx) file", async () => {
    const res = await request(app).get("/api/export/umkm");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("spreadsheetml.sheet");
  });
});
