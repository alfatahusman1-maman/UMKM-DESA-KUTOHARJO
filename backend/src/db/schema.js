const { pgTable, serial, text, varchar, integer, decimal, boolean, timestamp, json } = require("drizzle-orm/pg-core");

const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow(),
});

const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  icon: varchar("icon", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

const umkms = pgTable("umkms", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  ownerName: varchar("owner_name", { length: 255 }).notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  description: text("description"),
  address: text("address"),
  dusun: varchar("dusun", { length: 100 }),
  whatsappNumber: varchar("whatsapp_number", { length: 50 }),
  imageUrl: text("image_url"),
  mapsUrl: text("maps_url"),
  instagramUrl: text("instagram_url"),
  operationalHours: varchar("operational_hours", { length: 255 }),
  isVerified: boolean("is_verified").default(true),
  certifications: json("certifications").$type().default([]),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

const products = pgTable("products", {
  id: serial("id").primaryKey(),
  umkmId: integer("umkm_id").references(() => umkms.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  navbarTitle: varchar("navbar_title", { length: 255 }).default("Portal UMKM Kutoharjo"),
  siteLogo: text("site_logo"),
  heroTitle: varchar("hero_title", { length: 255 }),
  heroSubtitle: text("hero_subtitle"),
  footerBio: text("footer_bio"),
  footerCopyright: varchar("footer_copyright", { length: 255 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  umkmId: integer("umkm_id").references(() => umkms.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

module.exports = {
  users,
  categories,
  umkms,
  products,
  feedbacks,
  siteSettings,
  reviews,
};
