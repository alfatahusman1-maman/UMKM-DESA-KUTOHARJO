const { z } = require("zod");

const loginSchema = z.object({
  email: z.string({ required_error: "Email wajib diisi" }).email("Format email tidak valid"),
  password: z.string({ required_error: "Password wajib diisi" }).min(6, "Password minimal 6 karakter"),
});

const umkmSchema = z.object({
  name: z.string({ required_error: "Nama UMKM wajib diisi" }).min(3, "Nama UMKM minimal 3 karakter"),
  ownerName: z.string({ required_error: "Nama Pemilik wajib diisi" }).min(2, "Nama Pemilik minimal 2 karakter"),
  categoryId: z.coerce.number({ required_error: "Kategori wajib dipilih" }),
  description: z.string().optional(),
  address: z.string({ required_error: "Alamat wajib diisi" }),
  dusun: z.string({ required_error: "Dusun wajib diisi" }),
  whatsappNumber: z.string().optional(),
  imageUrl: z.string().optional(),
  mapsUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  operationalHours: z.string().optional(),
  certifications: z.array(z.string()).optional().default([]),
  latitude: z.union([z.number(), z.string()]).optional(),
  longitude: z.union([z.number(), z.string()]).optional(),
});

const productSchema = z.object({
  umkmId: z.coerce.number({ required_error: "UMKM ID wajib diisi" }),
  title: z.string({ required_error: "Nama Produk wajib diisi" }).min(2, "Nama Produk minimal 2 karakter"),
  description: z.string().optional(),
  price: z.coerce.number({ required_error: "Harga wajib diisi" }).positive("Harga harus berupa angka positif"),
  imageUrl: z.string().optional(),
});

const feedbackSchema = z.object({
  name: z.string({ required_error: "Nama wajib diisi" }).min(2, "Nama minimal 2 karakter"),
  email: z.string({ required_error: "Email wajib diisi" }).email("Format email tidak valid"),
  message: z.string({ required_error: "Pesan wajib diisi" }).min(10, "Pesan masukan minimal 10 karakter"),
});

const adminSchema = z.object({
  name: z.string({ required_error: "Nama admin wajib diisi" }).min(2, "Nama minimal 2 karakter"),
  email: z.string({ required_error: "Email wajib diisi" }).email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter").optional().or(z.literal("")),
  role: z.enum(["admin", "superadmin"]).default("admin"),
});

const reviewSchema = z.object({
  name: z.string({ required_error: "Nama pengulas wajib diisi" }).min(2, "Nama minimal 2 karakter"),
  rating: z.coerce.number().min(1, "Rating minimal 1").max(5, "Rating maksimal 5"),
  comment: z.string({ required_error: "Komentar wajib diisi" }).min(5, "Komentar ulasan minimal 5 karakter"),
});

module.exports = {
  loginSchema,
  umkmSchema,
  productSchema,
  feedbackSchema,
  adminSchema,
  reviewSchema,
};
