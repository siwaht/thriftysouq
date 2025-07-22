import { products, orders, orderItems, menuItems, webhooks, adminUsers, adminTokens, heroBanner, paymentCredentials, type Product, type Order, type OrderItem, type MenuItem, type Webhook, type AdminUser, type AdminToken, type HeroBanner, type PaymentCredential, type InsertProduct, type InsertOrder, type InsertOrderItem, type InsertMenuItem, type InsertWebhook, type InsertAdminUser, type InsertAdminToken, type InsertHeroBanner, type InsertPaymentCredential } from "@shared/schema";
import { db } from "./db";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getAllProducts(): Promise<Product[]>; // Added for webhook compatibility
  getProduct(id: number): Promise<Product | undefined>; // Added for webhook compatibility
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createOrder(order: InsertOrder, items: Omit<InsertOrderItem, 'orderId'>[]): Promise<{ order: Order; orderNumber: string }>;
  updateProductStock(productId: number, newStock: number): Promise<void>;
  // Menu methods
  getMenuItems(): Promise<MenuItem[]>;
  // Admin methods
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, menuItem: InsertMenuItem): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  updateMenuItemOrder(id: number, newOrder: number): Promise<void>;
  // Order management methods
  getOrders(): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>; // Added for webhook compatibility
  getOrder(id: number): Promise<Order | undefined>; // Added for webhook compatibility
  getOrderById(id: number): Promise<Order | undefined>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  getOrdersWithItems(): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]>;
  // Webhook methods
  getWebhooks(): Promise<Webhook[]>;
  createWebhook(webhook: InsertWebhook): Promise<Webhook>;
  updateWebhook(id: number, webhook: InsertWebhook): Promise<Webhook | undefined>;
  deleteWebhook(id: number): Promise<boolean>;
  getActiveWebhooksForEvent(event: string): Promise<Webhook[]>;
  // Admin authentication methods
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  // Token management methods
  createToken(token: InsertAdminToken): Promise<AdminToken>;
  validateToken(token: string): Promise<AdminToken | undefined>;
  deleteToken(token: string): Promise<boolean>;
  cleanupExpiredTokens(): Promise<number>;
  // Hero banner methods
  getHeroBanner(): Promise<HeroBanner | undefined>;
  updateHeroBanner(banner: InsertHeroBanner): Promise<HeroBanner>;
  
  // Payment credentials methods
  getPaymentCredentials(): Promise<PaymentCredential[]>;
  upsertPaymentCredential(data: InsertPaymentCredential): Promise<PaymentCredential>;
  deletePaymentCredential(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
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
        orderNumber,
        status: "pending",
        ...order
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

  // Admin methods
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

  // Menu methods
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

  // Order management methods
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(asc(orders.id));
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(asc(orders.id));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder || undefined;
  }

  async getOrdersWithItems(): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]> {
    const allOrders = await db.select().from(orders).orderBy(asc(orders.id));
    const result = [];

    for (const order of allOrders) {
      const items = await db
        .select({
          id: orderItems.id,
          orderId: orderItems.orderId,
          productId: orderItems.productId,
          quantity: orderItems.quantity,
          price: orderItems.price,
          product: products
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, order.id));

      result.push({
        ...order,
        items: items.map(item => ({
          id: item.id,
          orderId: item.orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          product: item.product
        }))
      });
    }

    return result;
  }

  // Webhook methods
  async getWebhooks(): Promise<Webhook[]> {
    return await db.select().from(webhooks).orderBy(asc(webhooks.id));
  }

  async createWebhook(webhook: InsertWebhook): Promise<Webhook> {
    const [newWebhook] = await db
      .insert(webhooks)
      .values(webhook)
      .returning();
    return newWebhook;
  }

  async updateWebhook(id: number, webhook: InsertWebhook): Promise<Webhook | undefined> {
    const [updatedWebhook] = await db
      .update(webhooks)
      .set(webhook)
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

  async getActiveWebhooksForEvent(event: string): Promise<Webhook[]> {
    const allWebhooks = await db.select().from(webhooks).where(eq(webhooks.isActive, true));
    return allWebhooks.filter(webhook => webhook.events.includes(event));
  }

  // Admin authentication methods
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return admin || undefined;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [newAdmin] = await db
      .insert(adminUsers)
      .values(user)
      .returning();
    return newAdmin;
  }

  async getHeroBanner(): Promise<HeroBanner | undefined> {
    const [banner] = await db.select().from(heroBanner).where(eq(heroBanner.isActive, true)).limit(1);
    return banner || undefined;
  }

  // Token management methods (missing implementation)
  async createToken(token: InsertAdminToken): Promise<AdminToken> {
    const [newToken] = await db
      .insert(adminTokens)
      .values(token)
      .returning();
    return newToken;
  }

  async validateToken(token: string): Promise<AdminToken | undefined> {
    const [adminToken] = await db.select().from(adminTokens).where(eq(adminTokens.token, token));
    return adminToken || undefined;
  }

  async deleteToken(token: string): Promise<boolean> {
    const result = await db
      .delete(adminTokens)
      .where(eq(adminTokens.token, token));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async cleanupExpiredTokens(): Promise<number> {
    const now = new Date();
    const result = await db
      .delete(adminTokens)
      .where(eq(adminTokens.expiresAt, now));
    return result.rowCount || 0;
  }

  async updateHeroBanner(banner: InsertHeroBanner): Promise<HeroBanner> {
    // First, deactivate all existing banners
    await db.update(heroBanner).set({ isActive: false });
    
    // Insert or update the new banner
    const [newBanner] = await db.insert(heroBanner).values({
      ...banner,
      isActive: true,
      updatedAt: new Date(),
    }).returning();
    
    return newBanner;
  }

  // Payment credentials methods
  async getPaymentCredentials(): Promise<PaymentCredential[]> {
    return await db.select().from(paymentCredentials).where(eq(paymentCredentials.isActive, true));
  }

  async upsertPaymentCredential(data: InsertPaymentCredential): Promise<PaymentCredential> {
    const [credential] = await db
      .insert(paymentCredentials)
      .values({
        ...data,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [paymentCredentials.provider, paymentCredentials.keyType],
        set: {
          keyValue: data.keyValue,
          isActive: data.isActive ?? true,
          updatedAt: new Date(),
        },
      })
      .returning();
    return credential;
  }

  async deletePaymentCredential(id: number): Promise<void> {
    await db.delete(paymentCredentials).where(eq(paymentCredentials.id, id));
  }
}

export class MemStorage implements Partial<IStorage> {
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private currentProductId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentProductId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;

    // Initialize with sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts = [
      {
        id: this.currentProductId++,
        name: "Rolex Submariner Watch",
        brand: "Rolex",
        category: "watches",
        originalPrice: "8950.00",
        discountedPrice: "2685.00",
        discount: 70,
        image: "https://images.unsplash.com/photo-1523170335258-f5c0e6f3cafa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 3
      },
      {
        id: this.currentProductId++,
        name: "Ray-Ban Aviator Classic",
        brand: "Ray-Ban",
        category: "sunglasses",
        originalPrice: "195.00",
        discountedPrice: "97.00",
        discount: 50,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 12
      },
      {
        id: this.currentProductId++,
        name: "Tiffany & Co. Diamond Necklace",
        brand: "Tiffany & Co.",
        category: "jewelry",
        originalPrice: "2850.00",
        discountedPrice: "1425.00",
        discount: 50,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 5
      },
      {
        id: this.currentProductId++,
        name: "Louis Vuitton Neverfull MM",
        brand: "Louis Vuitton",
        category: "bags",
        originalPrice: "1690.00",
        discountedPrice: "845.00",
        discount: 50,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 7
      },
      {
        id: this.currentProductId++,
        name: "Gucci Leather Wallet",
        brand: "Gucci",
        category: "wallets",
        originalPrice: "420.00",
        discountedPrice: "168.00",
        discount: 60,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 15
      },
      {
        id: this.currentProductId++,
        name: "Omega Seamaster Watch",
        brand: "Omega",
        category: "watches",
        originalPrice: "4200.00",
        discountedPrice: "2520.00",
        discount: 40,
        image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 4
      },
      {
        id: this.currentProductId++,
        name: "Prada Sunglasses",
        brand: "Prada",
        category: "sunglasses",
        originalPrice: "385.00",
        discountedPrice: "154.00",
        discount: 60,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 8
      },
      {
        id: this.currentProductId++,
        name: "Cartier Love Bracelet",
        brand: "Cartier",
        category: "jewelry",
        originalPrice: "6300.00",
        discountedPrice: "3150.00",
        discount: 50,
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 2
      },
      {
        id: this.currentProductId++,
        name: "Hermès Birkin Bag",
        brand: "Hermès",
        category: "bags",
        originalPrice: "12000.00",
        discountedPrice: "3600.00",
        discount: 70,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 1
      },
      {
        id: this.currentProductId++,
        name: "Mont Blanc Wallet",
        brand: "Mont Blanc",
        category: "wallets",
        originalPrice: "295.00",
        discountedPrice: "147.00",
        discount: 50,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 10
      },
      {
        id: this.currentProductId++,
        name: "Tag Heuer Formula 1",
        brand: "Tag Heuer",
        category: "watches",
        originalPrice: "1200.00",
        discountedPrice: "600.00",
        discount: 50,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 6
      },
      {
        id: this.currentProductId++,
        name: "Oakley Radar Sunglasses",
        brand: "Oakley",
        category: "sunglasses",
        originalPrice: "185.00",
        discountedPrice: "92.00",
        discount: 50,
        image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 20
      },
      {
        id: this.currentProductId++,
        name: "Bulgari Serpenti Ring",
        brand: "Bulgari",
        category: "jewelry",
        originalPrice: "1850.00",
        discountedPrice: "925.00",
        discount: 50,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 3
      },
      {
        id: this.currentProductId++,
        name: "Chanel Quilted Bag",
        brand: "Chanel",
        category: "bags",
        originalPrice: "5400.00",
        discountedPrice: "2160.00",
        discount: 60,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 2
      },
      {
        id: this.currentProductId++,
        name: "Breitling Chronomat",
        brand: "Breitling",
        category: "watches",
        originalPrice: "4850.00",
        discountedPrice: "2425.00",
        discount: 50,
        image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 4
      },
      {
        id: this.currentProductId++,
        name: "Versace Medusa Sunglasses",
        brand: "Versace",
        category: "sunglasses",
        originalPrice: "295.00",
        discountedPrice: "147.00",
        discount: 50,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 12
      },
      {
        id: this.currentProductId++,
        name: "Chopard Happy Diamonds Ring",
        brand: "Chopard",
        category: "jewelry",
        originalPrice: "3200.00",
        discountedPrice: "1280.00",
        discount: 60,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 3
      },
      {
        id: this.currentProductId++,
        name: "Fendi Baguette Bag",
        brand: "Fendi",
        category: "bags",
        originalPrice: "2890.00",
        discountedPrice: "1156.00",
        discount: 60,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 5
      },
      {
        id: this.currentProductId++,
        name: "Bottega Veneta Intrecciato Wallet",
        brand: "Bottega Veneta",
        category: "wallets",
        originalPrice: "650.00",
        discountedPrice: "260.00",
        discount: 60,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 8
      },
      {
        id: this.currentProductId++,
        name: "Patek Philippe Calatrava",
        brand: "Patek Philippe",
        category: "watches",
        originalPrice: "28500.00",
        discountedPrice: "8550.00",
        discount: 70,
        image: "https://images.unsplash.com/photo-1523170335258-f5c0e6f3cafa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 1
      },
      {
        id: this.currentProductId++,
        name: "Tom Ford Aviator Sunglasses",
        brand: "Tom Ford",
        category: "sunglasses",
        originalPrice: "425.00",
        discountedPrice: "170.00",
        discount: 60,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 15
      },
      {
        id: this.currentProductId++,
        name: "Van Cleef & Arpels Alhambra Necklace",
        brand: "Van Cleef & Arpels",
        category: "jewelry",
        originalPrice: "4950.00",
        discountedPrice: "1485.00",
        discount: 70,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 2
      },
      {
        id: this.currentProductId++,
        name: "Balenciaga City Bag",
        brand: "Balenciaga",
        category: "bags",
        originalPrice: "1890.00",
        discountedPrice: "945.00",
        discount: 50,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 6
      },
      {
        id: this.currentProductId++,
        name: "Saint Laurent Card Holder",
        brand: "Saint Laurent",
        category: "wallets",
        originalPrice: "325.00",
        discountedPrice: "162.00",
        discount: 50,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 20
      },
      {
        id: this.currentProductId++,
        name: "Audemars Piguet Royal Oak",
        brand: "Audemars Piguet",
        category: "watches",
        originalPrice: "35000.00",
        discountedPrice: "14000.00",
        discount: 60,
        image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 1
      },
      {
        id: this.currentProductId++,
        name: "Dior So Real Sunglasses",
        brand: "Dior",
        category: "sunglasses",
        originalPrice: "395.00",
        discountedPrice: "158.00",
        discount: 60,
        image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 10
      },
      {
        id: this.currentProductId++,
        name: "Harry Winston Diamond Earrings",
        brand: "Harry Winston",
        category: "jewelry",
        originalPrice: "8500.00",
        discountedPrice: "3400.00",
        discount: 60,
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 2
      },
      {
        id: this.currentProductId++,
        name: "Goyard Saint Louis Tote",
        brand: "Goyard",
        category: "bags",
        originalPrice: "1720.00",
        discountedPrice: "516.00",
        discount: 70,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 4
      },
      {
        id: this.currentProductId++,
        name: "Berluti Scritto Wallet",
        brand: "Berluti",
        category: "wallets",
        originalPrice: "495.00",
        discountedPrice: "148.00",
        discount: 70,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 12
      },
      {
        id: this.currentProductId++,
        name: "IWC Portugieser",
        brand: "IWC",
        category: "watches",
        originalPrice: "6200.00",
        discountedPrice: "2480.00",
        discount: 60,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 3
      },
      {
        id: this.currentProductId++,
        name: "Persol Steve McQueen Sunglasses",
        brand: "Persol",
        category: "sunglasses",
        originalPrice: "315.00",
        discountedPrice: "126.00",
        discount: 60,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 18
      },
      {
        id: this.currentProductId++,
        name: "Mikimoto Pearl Necklace",
        brand: "Mikimoto",
        category: "jewelry",
        originalPrice: "3850.00",
        discountedPrice: "1155.00",
        discount: 70,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 3
      },
      {
        id: this.currentProductId++,
        name: "Celine Luggage Tote",
        brand: "Celine",
        category: "bags",
        originalPrice: "3200.00",
        discountedPrice: "1280.00",
        discount: 60,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 3
      },
      {
        id: this.currentProductId++,
        name: "Hermès Constance Wallet",
        brand: "Hermès",
        category: "wallets",
        originalPrice: "2100.00",
        discountedPrice: "630.00",
        discount: 70,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        stock: 2
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  async createOrder(order: InsertOrder, items: Omit<InsertOrderItem, 'orderId'>[]): Promise<{ order: Order; orderNumber: string }> {
    const orderNumber = `LD-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const newOrder: Order = {
      id: this.currentOrderId++,
      orderNumber,
      status: "pending",
      ...order,
      postalCode: order.postalCode || null
    };

    this.orders.set(newOrder.id, newOrder);

    // Create order items
    items.forEach(item => {
      const orderItem: OrderItem = {
        id: this.currentOrderItemId++,
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      };
      this.orderItems.set(orderItem.id, orderItem);
    });

    return { order: newOrder, orderNumber };
  }

  async updateProductStock(productId: number, newStock: number): Promise<void> {
    const product = this.products.get(productId);
    if (product) {
      product.stock = newStock;
      this.products.set(productId, product);
    }
  }

  // Admin methods
  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      id: this.currentProductId++,
      ...product,
      stock: product.stock ?? 0
    };
    this.products.set(newProduct.id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: InsertProduct): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      return undefined;
    }
    
    const updatedProduct: Product = {
      id,
      ...product,
      stock: product.stock ?? 0
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Menu methods
  async getMenuItems(): Promise<MenuItem[]> {
    // Return default menu items for memory storage
    return [
      { id: 1, label: "Watches", value: "watches", order: 1, isActive: true },
      { id: 2, label: "Jewelry", value: "jewelry", order: 2, isActive: true },
      { id: 3, label: "Sunglasses", value: "sunglasses", order: 3, isActive: true },
      { id: 4, label: "Bags", value: "bags", order: 4, isActive: true },
      { id: 5, label: "Wallets", value: "wallets", order: 5, isActive: true },
    ];
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const newMenuItem: MenuItem = {
      id: Date.now(), // Simple ID generation for memory storage
      label: menuItem.label,
      value: menuItem.value,
      order: menuItem.order ?? 0,
      isActive: menuItem.isActive ?? true
    };
    return newMenuItem;
  }

  async updateMenuItem(id: number, menuItem: InsertMenuItem): Promise<MenuItem | undefined> {
    // For memory storage, just return the updated item
    return {
      id,
      label: menuItem.label,
      value: menuItem.value,
      order: menuItem.order ?? 0,
      isActive: menuItem.isActive ?? true
    };
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    // For memory storage, always return true
    return true;
  }

  async updateMenuItemOrder(id: number, newOrder: number): Promise<void> {
    // For memory storage, no-op
  }

  // Order management methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      this.orders.set(id, order);
      return order;
    }
    return undefined;
  }

  async getOrdersWithItems(): Promise<(Order & { items: (OrderItem & { product: Product })[] })[]> {
    const result = [];
    const allOrders = Array.from(this.orders.values());

    for (const order of allOrders) {
      const items = Array.from(this.orderItems.values())
        .filter(item => item.orderId === order.id)
        .map(item => {
          const product = this.products.get(item.productId);
          return {
            ...item,
            product: product!
          };
        });

      result.push({
        ...order,
        items
      });
    }

    return result;
  }

  // Webhook methods for MemStorage (simplified for memory storage)
  async getWebhooks(): Promise<Webhook[]> {
    return []; // Return empty for memory storage
  }

  async createWebhook(webhook: InsertWebhook): Promise<Webhook> {
    const newWebhook: Webhook = {
      id: Date.now(),
      name: webhook.name,
      url: webhook.url,
      events: webhook.events,
      isActive: webhook.isActive ?? true,
      secret: webhook.secret || null
    };
    return newWebhook;
  }

  async updateWebhook(id: number, webhook: InsertWebhook): Promise<Webhook | undefined> {
    return {
      id,
      name: webhook.name,
      url: webhook.url,
      events: webhook.events,
      isActive: webhook.isActive ?? true,
      secret: webhook.secret || null
    };
  }

  async deleteWebhook(id: number): Promise<boolean> {
    return true;
  }

  async getActiveWebhooksForEvent(event: string): Promise<Webhook[]> {
    return [];
  }

  // Admin authentication methods for MemStorage (simplified for memory storage)
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    // For memory storage, return a default admin user if username is "admin"
    if (username === "admin") {
      return {
        id: 1,
        username: "admin",
        passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" // "password"
      };
    }
    return undefined;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    return {
      id: Date.now(),
      username: user.username,
      passwordHash: user.passwordHash
    };
  }
}

export const storage = new DatabaseStorage();
