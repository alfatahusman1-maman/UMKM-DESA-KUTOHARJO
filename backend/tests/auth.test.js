import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server";

describe("Backend Auth API Integration Tests", () => {
  it("POST /api/auth/login - should fail with invalid credentials (400)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "nonexistent@korowelang.desa.id",
        password: "wrongpassword123",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/auth/login - should reject invalid email format with Zod validation (400)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "invalid-email-format",
        password: "short",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Validasi data gagal");
  });

  it("POST /api/auth/login - should succeed with valid admin credentials (200)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "superadmin@korowelangkulon.desa.id",
        password: "superadmin123",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe("superadmin@korowelangkulon.desa.id");
  });

  it("GET /api/auth/me - should reject unauthorized request without token (401)", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
