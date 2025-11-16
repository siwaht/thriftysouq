import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
  discountedPrice: decimal("discounted_price", { precision: 10, scale: 2 }).notNull(),
  discount: integer("discount").notNull(),
  image: text("image").notNull(),
  stock: integer("stock").notNull().default(0),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code"),
  specialInstructions: text("special_instructions"),
  paymentMethod: text("payment_method").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const heroBanner = pgTable("hero_banner", {
  id: serial("id").primaryKey(),
  badgeIcon: text("badge_icon").default("Sparkles"),
  badgeText: text("badge_text").default("Luxury at unprecedented prices"),
  mainTitle: text("main_title").default("Premium"),
  highlightTitle: text("highlight_title").default("Luxury"),
  subtitle: text("subtitle").default("Made Accessible"),
  description: text("description").default("Discover authenticated luxury brands at up to 70% off. Curated collections from the world's finest houses."),
  buttonText: text("button_text").default("Explore Collection"),
  footerText: text("footer_text").default("Free shipping on orders over $200"),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("admin"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminTokens = pgTable("admin_tokens", {
  token: text("token").primaryKey(),
  adminId: integer("admin_id").notNull().references(() => adminUsers.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  events: text("events").array().notNull(),
  isActive: boolean("is_active").notNull().default(true),
  secret: text("secret"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const paymentCredentials = pgTable("payment_credentials", {
  id: serial("id").primaryKey(),
  provider: text("provider").notNull(),
  keyType: text("key_type").notNull(),
  keyValue: text("key_value").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Simple Zod schemas without using createInsertSchema
export const insertProductSchema = z.object({
  name: z.string(),
  brand: z.string(),
  category: z.string(),
  originalPrice: z.string(),
  discountedPrice: z.string(),
  discount: z.number(),
  image: z.string(),
  stock: z.number(),
});

export const insertOrderSchema = z.object({
  customerName: z.string(),
  customerEmail: z.string(),
  customerPhone: z.string(),
  shippingAddress: z.string(),
  city: z.string(),
  postalCode: z.string().optional(),
  specialInstructions: z.string().optional(),
  paymentMethod: z.string(),
  total: z.string(),
  status: z.string().optional(),
});

export const insertOrderItemSchema = z.object({
  orderId: z.number().optional(),
  productId: z.number(),
  quantity: z.number(),
  price: z.string(),
});

export const insertMenuItemSchema = z.object({
  label: z.string(),
  value: z.string(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const insertHeroBannerSchema = z.object({
  badgeIcon: z.string().optional(),
  badgeText: z.string().optional(),
  mainTitle: z.string().optional(),
  highlightTitle: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  buttonText: z.string().optional(),
  footerText: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const insertAdminUserSchema = z.object({
  username: z.string(),
  passwordHash: z.string(),
  email: z.string().email(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const insertWebhookSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  events: z.array(z.string()),
  isActive: z.boolean().optional(),
  secret: z.string().optional(),
});

export const insertPaymentCredentialSchema = z.object({
  provider: z.string(),
  keyType: z.string(),
  keyValue: z.string(),
  isActive: z.boolean().optional(),
});

// Type exports
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type HeroBanner = typeof heroBanner.$inferSelect;
export type InsertHeroBanner = z.infer<typeof insertHeroBannerSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminToken = typeof adminTokens.$inferSelect;
export type InsertAdminToken = typeof adminTokens.$inferInsert;
export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = z.infer<typeof insertWebhookSchema>;
export type PaymentCredential = typeof paymentCredentials.$inferSelect;
export type InsertPaymentCredential = z.infer<typeof insertPaymentCredentialSchema>;