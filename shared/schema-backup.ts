import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
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

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

// Relations
export const ordersRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const adminTokens = pgTable("admin_tokens", {
  token: text("token").primaryKey(),
  adminId: integer("admin_id").notNull().references(() => adminUsers.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
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

export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  events: text("events").array().notNull(),
  isActive: boolean("is_active").notNull().default(true),
  secret: text("secret"),
});

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export const insertWebhookSchema = createInsertSchema(webhooks).omit({
  id: true,
});

export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = z.infer<typeof insertWebhookSchema>;

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
});

export const insertHeroBannerSchema = createInsertSchema(heroBanner).omit({
  id: true,
  updatedAt: true,
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminToken = typeof adminTokens.$inferSelect;
export type InsertAdminToken = typeof adminTokens.$inferInsert;
export type HeroBanner = typeof heroBanner.$inferSelect;
export type InsertHeroBanner = z.infer<typeof insertHeroBannerSchema>;

// Payment credentials table for secure storage
export const paymentCredentials = pgTable("payment_credentials", {
  id: serial("id").primaryKey(),
  provider: text("provider").notNull(), // 'stripe' or 'paypal'
  keyType: text("key_type").notNull(), // 'public_key', 'secret_key', 'client_id', 'client_secret'
  keyValue: text("key_value").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPaymentCredentialSchema = createInsertSchema(paymentCredentials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type PaymentCredential = typeof paymentCredentials.$inferSelect;
export type InsertPaymentCredential = z.infer<typeof insertPaymentCredentialSchema>;
