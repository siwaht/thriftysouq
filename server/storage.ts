import { products, orders, orderItems, menuItems, heroBanner, webhooks, adminUsers, paymentCredentials, type Product, type Order, type OrderItem, type MenuItem, type HeroBanner, type Webhook, type AdminUser, type PaymentCredential, type InsertProduct, type InsertOrder, type InsertOrderItem, type InsertMenuItem, type InsertHeroBanner, type InsertWebhook, type InsertAdminUser, type InsertPaymentCredential } from "@shared/schema";
import { db } from "./db";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createOrder(order: InsertOrder, items: Omit<InsertOrderItem, 'orderId'>[]): Promise<{ order: Order; orderNumber: string }>;
  updateProductStock(productId: number, newStock: number): Promise<void>;
  // Menu methods
  getMenuItems(): Promise<MenuItem[]>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, menuItem: InsertMenuItem): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  updateMenuItemOrder(id: number, newOrder: number): Promise<void>;
  // Admin methods
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  // Order management methods
  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  getOrdersWithItems(): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  // Hero banner methods
  getHeroBanner(): Promise<HeroBanner | undefined>;
  updateHeroBanner(banner: InsertHeroBanner): Promise<HeroBanner>;
  // Webhook methods
  getWebhooks(): Promise<Webhook[]>;
  createWebhook(webhook: InsertWebhook): Promise<Webhook>;
  updateWebhook(id: number, webhook: Partial<InsertWebhook>): Promise<Webhook | undefined>;
  deleteWebhook(id: number): Promise<boolean>;
  // Admin user methods
  getAdminUsers(): Promise<AdminUser[]>;
  getAdminUserById(id: number): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: number, user: Partial<InsertAdminUser>): Promise<AdminUser>;
  deleteAdminUser(id: number): Promise<void>;
  // Payment credentials methods
  getPaymentCredentials(): Promise<PaymentCredential[]>;
  createPaymentCredential(credential: InsertPaymentCredential): Promise<PaymentCredential>;
  updatePaymentCredential(id: number, credential: Partial<InsertPaymentCredential>): Promise<PaymentCredential | undefined>;
  deletePaymentCredential(id: number): Promise<boolean>;
  upsertPaymentCredential(credential: InsertPaymentCredential): Promise<PaymentCredential>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async createOrder(order: InsertOrder, items: Omit<InsertOrderItem, 'orderId'>[]): Promise<{ order: Order; orderNumber: string }> {
    const orderNumber = `LD-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const [newOrder] = await db
      .insert(orders)
      .values({
        ...order,
        orderNumber,
        status: order.status || "pending"
      })
      .returning();

    // Create order items
    if (items.length > 0) {
      const orderItemsData = items.map(item => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }));

      await db.insert(orderItems).values(orderItemsData);
    }

    return { order: newOrder, orderNumber };
  }

  async updateProductStock(productId: number, newStock: number): Promise<void> {
    await db
      .update(products)
      .set({ stock: newStock })
      .where(eq(products.id, productId));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, product: InsertProduct): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems).orderBy(asc(menuItems.order));
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const [newMenuItem] = await db
      .insert(menuItems)
      .values(menuItem)
      .returning();
    return newMenuItem;
  }

  async updateMenuItem(id: number, menuItem: InsertMenuItem): Promise<MenuItem | undefined> {
    const [updatedMenuItem] = await db
      .update(menuItems)
      .set(menuItem)
      .where(eq(menuItems.id, id))
      .returning();
    return updatedMenuItem || undefined;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const result = await db
      .delete(menuItems)
      .where(eq(menuItems.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async updateMenuItemOrder(id: number, newOrder: number): Promise<void> {
    await db
      .update(menuItems)
      .set({ order: newOrder })
      .where(eq(menuItems.id, id));
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async getOrdersWithItems(): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]> {
    const allOrders = await this.getOrders();
    const results = [];

    for (const order of allOrders) {
      const items = await this.getOrderItems(order.id);
      const itemsWithProducts = [];

      for (const item of items) {
        const product = await this.getProductById(item.productId);
        if (product) {
          itemsWithProducts.push({ ...item, product });
        }
      }

      results.push({ ...order, items: itemsWithProducts });
    }

    return results;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder || undefined;
  }

  async getHeroBanner(): Promise<HeroBanner | undefined> {
    const [banner] = await db.select().from(heroBanner).where(eq(heroBanner.isActive, true));
    return banner || undefined;
  }

  async updateHeroBanner(banner: InsertHeroBanner): Promise<HeroBanner> {
    const [updated] = await db
      .update(heroBanner)
      .set({
        ...banner,
        updatedAt: new Date()
      })
      .where(eq(heroBanner.id, 1))
      .returning();
    return updated;
  }

  // Webhook methods
  async getWebhooks(): Promise<Webhook[]> {
    return await db.select().from(webhooks);
  }

  async createWebhook(webhook: InsertWebhook): Promise<Webhook> {
    const [newWebhook] = await db
      .insert(webhooks)
      .values(webhook)
      .returning();
    return newWebhook;
  }

  async updateWebhook(id: number, webhook: Partial<InsertWebhook>): Promise<Webhook | undefined> {
    const [updatedWebhook] = await db
      .update(webhooks)
      .set({
        ...webhook,
        updatedAt: new Date()
      })
      .where(eq(webhooks.id, id))
      .returning();
    return updatedWebhook || undefined;
  }

  async deleteWebhook(id: number): Promise<boolean> {
    const result = await db
      .delete(webhooks)
      .where(eq(webhooks.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Admin user methods
  async getAdminUsers(): Promise<AdminUser[]> {
    return await db.select().from(adminUsers);
  }

  async getAdminUserById(id: number): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user || undefined;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user || undefined;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [newUser] = await db
      .insert(adminUsers)
      .values({
        ...user,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newUser;
  }

  async updateAdminUser(id: number, user: Partial<InsertAdminUser>): Promise<AdminUser> {
    const [updatedUser] = await db
      .update(adminUsers)
      .set({
        ...user,
        updatedAt: new Date()
      })
      .where(eq(adminUsers.id, id))
      .returning();
    return updatedUser;
  }

  async deleteAdminUser(id: number): Promise<void> {
    await db.delete(adminUsers).where(eq(adminUsers.id, id));
  }

  // Payment credentials methods
  async getPaymentCredentials(): Promise<PaymentCredential[]> {
    return await db.select().from(paymentCredentials);
  }

  async createPaymentCredential(credential: InsertPaymentCredential): Promise<PaymentCredential> {
    const [newCredential] = await db
      .insert(paymentCredentials)
      .values({
        ...credential,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newCredential;
  }

  async updatePaymentCredential(id: number, credential: Partial<InsertPaymentCredential>): Promise<PaymentCredential | undefined> {
    const [updatedCredential] = await db
      .update(paymentCredentials)
      .set({
        ...credential,
        updatedAt: new Date()
      })
      .where(eq(paymentCredentials.id, id))
      .returning();
    return updatedCredential || undefined;
  }

  async deletePaymentCredential(id: number): Promise<boolean> {
    const result = await db
      .delete(paymentCredentials)
      .where(eq(paymentCredentials.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async upsertPaymentCredential(credential: InsertPaymentCredential): Promise<PaymentCredential> {
    const existing = await this.getPaymentCredentials();
    if (existing.length > 0) {
      const updated = await this.updatePaymentCredential(existing[0].id, credential);
      if (!updated) throw new Error("Failed to update credential");
      return updated;
    } else {
      return await this.createPaymentCredential(credential);
    }
  }
}

export const storage = new DatabaseStorage();