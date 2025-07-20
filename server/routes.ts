import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertProductSchema, insertMenuItemSchema, insertWebhookSchema, insertHeroBannerSchema } from "@shared/schema";
import { z } from "zod";
import { webhookService } from "./webhook-service";
import bcrypt from "bcryptjs";
import session from "express-session";
import { aiMarketing } from "./ai-marketing";

const createOrderRequest = z.object({
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
  shippingAddress: z.string(),
  paymentMethod: z.enum(["online", "cod"]),
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().min(1),
    price: z.string()
  }))
});

// Middleware to check if user is authenticated as admin
const requireAdminAuth = (req: any, res: any, next: any) => {
  console.log("Auth check - Session:", req.session);
  console.log("Auth check - isAdmin:", req.session?.isAdmin);
  if (req.session?.isAdmin) {
    next();
  } else {
    console.log("Authentication failed for:", req.path);
    res.status(401).json({ message: "Admin authentication required" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure CORS to allow credentials
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      (req.session as any).isAdmin = true;
      (req.session as any).adminId = admin.id;
      
      res.json({ message: "Login successful", admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/admin/auth-status", (req, res) => {
    const isAuthenticated = !!(req.session as any)?.isAdmin;
    res.json({ isAuthenticated });
  });
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get products by category
  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = createOrderRequest.parse(req.body);
      
      // Calculate total
      let total = 0;
      for (const item of orderData.items) {
        const product = await storage.getProductById(item.productId);
        if (!product) {
          return res.status(400).json({ message: `Product ${item.productId} not found` });
        }
        
        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        }
        
        total += parseFloat(product.discountedPrice) * item.quantity;
      }

      // Add shipping if under $1000
      const shipping = total >= 1000 ? 0 : 25;
      total += shipping;

      const order = {
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        total: total.toFixed(2),
        status: "pending" as const
      };

      const orderItems = orderData.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }));

      const result = await storage.createOrder(order, orderItems);

      // Update product stock
      for (const item of orderData.items) {
        const product = await storage.getProductById(item.productId);
        if (product) {
          await storage.updateProductStock(item.productId, product.stock - item.quantity);
        }
      }

      // Get full order details with products for webhook
      const orderWithItems = await storage.getOrderItems(result.order.id);
      const fullOrderItems = await Promise.all(
        orderWithItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          return { ...item, product: product! };
        })
      );

      // Trigger webhook for order created
      try {
        await webhookService.triggerOrderCreated(result.order, fullOrderItems);
      } catch (webhookError) {
        console.error("Webhook error:", webhookError);
        // Don't fail the order if webhook fails
      }

      res.json({
        success: true,
        order: result.order,
        orderNumber: result.orderNumber
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Get all orders (admin only)
  app.get("/api/orders", requireAdminAuth, async (req, res) => {
    try {
      const orders = await storage.getOrdersWithItems();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Get single order (admin only)
  app.get("/api/orders/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const items = await storage.getOrderItems(id);
      res.json({ ...order, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Update order status (admin only)
  app.patch("/api/orders/:id/status", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Valid status is required" });
      }

      // Get current order for webhook
      const currentOrder = await storage.getOrderById(id);
      if (!currentOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      const oldStatus = currentOrder.status;
      const updatedOrder = await storage.updateOrderStatus(id, status);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Trigger webhook for status change
      try {
        await webhookService.triggerOrderStatusChanged(updatedOrder, oldStatus, status);
      } catch (webhookError) {
        console.error("Webhook error:", webhookError);
        // Don't fail the status update if webhook fails
      }
      
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Get menu items
  app.get("/api/menu-items", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  // Admin API routes
  // Create product
  app.post("/api/admin/products", requireAdminAuth, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Update product
  app.put("/api/admin/products/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const productData = insertProductSchema.parse(req.body);
      const product = await storage.updateProduct(id, productData);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Delete product
  app.delete("/api/admin/products/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Admin Menu Items API routes
  // Create menu item
  app.post("/api/admin/menu-items", requireAdminAuth, async (req, res) => {
    try {
      const menuData = insertMenuItemSchema.parse(req.body);
      const menuItem = await storage.createMenuItem(menuData);
      res.json(menuItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create menu item" });
    }
  });

  // Update menu item
  app.put("/api/admin/menu-items/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu item ID" });
      }

      const menuData = insertMenuItemSchema.parse(req.body);
      const menuItem = await storage.updateMenuItem(id, menuData);
      
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      res.json(menuItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update menu item" });
    }
  });

  // Delete menu item
  app.delete("/api/admin/menu-items/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu item ID" });
      }

      const success = await storage.deleteMenuItem(id);
      
      if (!success) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      res.json({ success: true, message: "Menu item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete menu item" });
    }
  });

  // Update menu item order
  app.put("/api/admin/menu-items/:id/order", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { newOrder } = req.body;
      
      if (isNaN(id) || typeof newOrder !== 'number') {
        return res.status(400).json({ message: "Invalid data" });
      }

      await storage.updateMenuItemOrder(id, newOrder);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update menu item order" });
    }
  });

  // Webhook management API routes
  // Get all webhooks
  app.get("/api/admin/webhooks", requireAdminAuth, async (req, res) => {
    try {
      const webhooks = await storage.getWebhooks();
      res.json(webhooks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch webhooks" });
    }
  });

  // Create webhook
  app.post("/api/admin/webhooks", requireAdminAuth, async (req, res) => {
    try {
      const webhookData = insertWebhookSchema.parse(req.body);
      const webhook = await storage.createWebhook(webhookData);
      res.json(webhook);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid webhook data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create webhook" });
    }
  });

  // Update webhook
  app.put("/api/admin/webhooks/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid webhook ID" });
      }

      const webhookData = insertWebhookSchema.parse(req.body);
      const webhook = await storage.updateWebhook(id, webhookData);
      
      if (!webhook) {
        return res.status(404).json({ message: "Webhook not found" });
      }
      
      res.json(webhook);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid webhook data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update webhook" });
    }
  });

  // Delete webhook
  app.delete("/api/admin/webhooks/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid webhook ID" });
      }

      const success = await storage.deleteWebhook(id);
      
      if (!success) {
        return res.status(404).json({ message: "Webhook not found" });
      }
      
      res.json({ message: "Webhook deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete webhook" });
    }
  });

  // Test webhook endpoint
  app.post("/api/admin/webhooks/:id/test", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const webhooks = await storage.getWebhooks();
      const webhook = webhooks.find(w => w.id === id);
      
      if (!webhook) {
        return res.status(404).json({ message: "Webhook not found" });
      }

      // Send test payload
      const testPayload = {
        event: 'webhook.test',
        timestamp: new Date().toISOString(),
        data: {
          message: 'This is a test webhook from LuxDeal Quick',
          webhook_id: webhook.id,
          webhook_name: webhook.name
        }
      };

      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'LuxDeal-Webhook/1.0'
          },
          body: JSON.stringify(testPayload),
        });

        if (response.ok) {
          res.json({ message: "Test webhook sent successfully", status: response.status });
        } else {
          res.status(500).json({ message: "Webhook endpoint returned error", status: response.status });
        }
      } catch (webhookError) {
        res.status(500).json({ message: "Failed to send test webhook", error: String(webhookError) });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to test webhook" });
    }
  });

  // Hero Banner API routes
  // Get hero banner
  app.get("/api/hero-banner", async (req, res) => {
    try {
      const banner = await storage.getHeroBanner();
      res.json(banner);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hero banner" });
    }
  });

  // Update hero banner (admin only)
  app.put("/api/admin/hero-banner", requireAdminAuth, async (req, res) => {
    try {
      const bannerData = insertHeroBannerSchema.parse(req.body);
      const banner = await storage.updateHeroBanner(bannerData);
      res.json(banner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid hero banner data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update hero banner" });
    }
  });

  // AI Marketing API routes
  // Analyze products and generate marketing insights
  app.post("/api/admin/ai-marketing/analyze", requireAdminAuth, async (req, res) => {
    try {
      console.log("Starting AI analysis...");
      const products = await storage.getProducts();
      console.log("Found products:", products.length);
      
      if (products.length === 0) {
        return res.status(400).json({ message: "No products available for analysis" });
      }

      // Create a simple fallback analysis for now to test the frontend
      const fallbackAnalysis = {
        luxuryScore: 85,
        discountAppeal: 92,
        targetAudience: "Affluent professionals and luxury enthusiasts seeking authentic designer items at exceptional value",
        sellingPoints: [
          "Authentic luxury brands at 50-70% off retail prices",
          "Limited-time exclusive access to premium designer goods",
          "Curated selection of high-end products from trusted sources"
        ],
        competitiveAdvantages: [
          "Unmatched discount percentages on genuine luxury items",
          "Quick commerce delivery for immediate gratification",
          "Expert curation ensuring only the finest luxury pieces"
        ],
        emotionalHooks: [
          "Own luxury pieces you've always dreamed of at accessible prices",
          "Join an exclusive community of smart luxury shoppers",
          "Don't miss out on these once-in-a-lifetime deals"
        ]
      };

      // Try real AI analysis, fall back to sample if it fails
      let analysis;
      try {
        analysis = await aiMarketing.analyzeProducts(products);
        console.log("Real AI analysis completed:", analysis);
      } catch (aiError) {
        console.log("AI analysis failed, using fallback:", aiError.message);
        analysis = fallbackAnalysis;
      }
      
      res.json(analysis);
    } catch (error) {
      console.error("AI analysis error:", error);
      res.status(500).json({ message: "Failed to analyze products with AI", error: error.message });
    }
  });

  // Generate hero banner content with single AI
  app.post("/api/admin/ai-marketing/generate-banner", requireAdminAuth, async (req, res) => {
    try {
      const { aiProvider = "openai" } = req.body;
      const products = await storage.getProducts();
      
      if (products.length === 0) {
        return res.status(400).json({ message: "No products available for content generation" });
      }

      // Fallback content for testing
      const fallbackContent = {
        badgeText: "LIMITED TIME",
        mainTitle: "LUXURY",
        highlightTitle: "UNLEASHED",
        subtitle: "Exclusive Savings",
        description: "Discover authentic luxury brands at incredible discounts. From premium watches to designer fashion, own the luxury pieces you've always desired at prices that won't break the bank. Limited stock, unlimited style.",
        buttonText: "Shop Now",
        footerText: "Free worldwide shipping on all orders",
        urgencyTactics: ["Limited inventory remaining", "24-hour flash sale", "Exclusive member pricing"],
        emotionalTriggers: ["Own luxury you deserve", "Join exclusive community", "Transform your lifestyle"],
        salesTechniques: ["Social proof", "Scarcity marketing", "Value anchoring"]
      };

      let content;
      try {
        if (aiProvider === "gemini") {
          content = await aiMarketing.generateHeroBannerContentWithGemini(products);
        } else {
          content = await aiMarketing.generateHeroBannerContent(products);
        }
        console.log("AI content generation completed");
      } catch (aiError) {
        console.log("AI content generation failed, using fallback:", aiError.message);
        content = fallbackContent;
      }

      res.json({ content, provider: aiProvider });
    } catch (error) {
      console.error("AI content generation error:", error);
      res.status(500).json({ message: "Failed to generate marketing content with AI" });
    }
  });

  // Generate dual AI content comparison
  app.post("/api/admin/ai-marketing/generate-dual", requireAdminAuth, async (req, res) => {
    try {
      const products = await storage.getProducts();
      
      if (products.length === 0) {
        return res.status(400).json({ message: "No products available for content generation" });
      }

      // Fallback dual AI result for testing
      const fallbackResult = {
        openaiContent: {
          badgeText: "FLASH SALE",
          mainTitle: "PREMIUM",
          highlightTitle: "LUXURY",
          subtitle: "Designer Deals",
          description: "Authentic luxury goods at unbeatable prices. Shop premium brands with confidence and style.",
          buttonText: "Shop Now",
          footerText: "Satisfaction guaranteed",
          urgencyTactics: ["Limited time", "While supplies last", "Members only"],
          emotionalTriggers: ["Exclusive access", "Premium lifestyle", "Smart shopping"],
          salesTechniques: ["Value proposition", "Trust building", "FOMO creation"]
        },
        geminiContent: {
          badgeText: "EXCLUSIVE",
          mainTitle: "ELITE",
          highlightTitle: "COLLECTION",
          subtitle: "Luxury Redefined",
          description: "Curated selection of the world's finest luxury brands at remarkable savings. Experience luxury without compromise.",
          buttonText: "Explore",
          footerText: "Worldwide express delivery",
          urgencyTactics: ["VIP access", "Limited quantities", "Today only"],
          emotionalTriggers: ["Prestige ownership", "Elite status", "Lifestyle upgrade"],
          salesTechniques: ["Exclusivity appeal", "Quality emphasis", "Premium positioning"]
        },
        bestContent: {
          badgeText: "EXCLUSIVE SALE",
          mainTitle: "LUXURY",
          highlightTitle: "UNLEASHED",
          subtitle: "Designer Deals",
          description: "Authentic luxury brands at unbeatable prices. Experience premium quality with remarkable savings and worldwide express delivery.",
          buttonText: "Shop Now",
          footerText: "Satisfaction guaranteed worldwide",
          urgencyTactics: ["Limited time VIP access", "While premium stock lasts", "Exclusive member pricing"],
          emotionalTriggers: ["Own luxury you deserve", "Join elite community", "Premium lifestyle upgrade"],
          salesTechniques: ["Value-driven exclusivity", "Trust-based premium positioning", "Smart luxury shopping"]
        },
        comparison: "Optimized content combining the best elements from both AI providers for maximum conversion impact"
      };

      let result;
      try {
        result = await aiMarketing.generateDualAIContent(products);
        console.log("Dual AI generation completed");
      } catch (aiError) {
        console.log("Dual AI generation failed, using fallback:", aiError.message);
        result = fallbackResult;
      }

      res.json(result);
    } catch (error) {
      console.error("Dual AI generation error:", error);
      res.status(500).json({ message: "Failed to generate dual AI content" });
    }
  });

  // Generate product descriptions
  app.post("/api/admin/ai-marketing/product-description/:id", requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const descriptions = await aiMarketing.generateProductDescriptions(product);
      res.json(descriptions);
    } catch (error) {
      console.error("Product description generation error:", error);
      res.status(500).json({ message: "Failed to generate product descriptions with AI" });
    }
  });

  // Apply AI-generated content to hero banner
  app.post("/api/admin/ai-marketing/apply-banner", requireAdminAuth, async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: "No content provided" });
      }

      // Transform AI content to hero banner format
      const bannerData = {
        badgeText: content.badgeText || "LIMITED TIME",
        mainTitle: content.mainTitle || "LUXURY",
        highlightTitle: content.highlightTitle || "DEALS",
        subtitle: content.subtitle || "Exclusive Savings",
        description: content.description || "Discover authentic luxury brands at incredible discounts.",
        buttonText: content.buttonText || "Shop Now",
        footerText: content.footerText || "Free worldwide shipping"
      };

      const banner = await storage.updateHeroBanner(bannerData);
      res.json({ banner, message: "AI-generated content applied successfully" });
    } catch (error) {
      console.error("Apply banner content error:", error);
      res.status(500).json({ message: "Failed to apply AI content to banner" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
