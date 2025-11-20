import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";
import adminRoutes from "./routes/admin";
import mcpRoutes from "./routes/mcp";
import webhookRoutes from "./routes/webhooks";
import { OpenAIProvider } from "./ai/openai-provider";
import { GeminiProvider } from "./ai/gemini-provider";
import { ElevenLabsProvider } from "./ai/elevenlabs-provider";
import { providerRegistry } from "./ai/provider-registry";

// Import all seeding functions
async function initializeDatabase() {
  try {
    console.log("Initializing database with seed data...");

    // Check if products exist, if not seed them
    try {
      const existingProducts = await storage.getProducts();
      if (existingProducts.length === 0) {
        console.log("No products found, seeding products...");
        const { seedProducts } = await import("./seed");
        await seedProducts();
      } else {
        console.log(`Found ${existingProducts.length} existing products`);
      }
    } catch (error) {
      console.log("Error checking/seeding products:", error instanceof Error ? error.message : String(error));
    }

    // Check and seed admin user
    try {
      const admin = await storage.getAdminUserByUsername("admin");
      if (!admin) {
        console.log("No admin found, seeding admin user...");
        const { seedAdminUser } = await import("./seed-admin");
        await seedAdminUser();
      } else {
        console.log("Admin user already exists");
      }
    } catch (error) {
      console.log("Error checking/seeding admin user:", error instanceof Error ? error.message : String(error));
      try {
        const { seedAdminUser } = await import("./seed-admin");
        await seedAdminUser();
      } catch (seedError) {
        console.log("Failed to seed admin user:", seedError instanceof Error ? seedError.message : String(seedError));
      }
    }

    // Check and seed menu items
    try {
      const menuItems = await storage.getMenuItems();
      if (menuItems.length === 0) {
        console.log("No menu items found, seeding menu items...");
        const { seedMenuItems } = await import("./seed-menu");
        await seedMenuItems();
      } else {
        console.log(`Found ${menuItems.length} existing menu items`);
      }
    } catch (error) {
      console.log("Error checking/seeding menu items:", error instanceof Error ? error.message : String(error));
    }

    // Check and seed hero banner
    try {
      const heroBanner = await storage.getHeroBanner();
      if (!heroBanner) {
        console.log("No hero banner found, seeding hero banner...");
        const { seedHeroBanner } = await import("./seed-hero-banner");
        await seedHeroBanner();
      } else {
        console.log("Hero banner already exists");
      }
    } catch (error) {
      console.log("Error checking/seeding hero banner:", error instanceof Error ? error.message : String(error));
      try {
        const { seedHeroBanner } = await import("./seed-hero-banner");
        await seedHeroBanner();
      } catch (seedError) {
        console.log("Failed to seed hero banner:", seedError instanceof Error ? seedError.message : String(seedError));
      }
    }

    console.log("Database initialization completed");
  } catch (error: any) {
    console.error("Database initialization failed:", error.message);
    // Continue server startup even if seeding fails
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint specifically for deployment health checks
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      app: 'ThriftySouq',
      timestamp: new Date().toISOString()
    });
  });

  // Initialize database with seed data on startup (async in background)
  initializeDatabase().catch((error: any) => {
    console.error("Background database initialization failed:", error.message);
  });

  // Configure CORS to allow credentials - critical for session persistence
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    res.header('Access-Control-Allow-Credentials', 'true');

    // Allow requests from same origin and common deployment domains
    if (origin && (origin.includes('replit') || origin.includes('localhost') || origin === req.protocol + '://' + req.get('host'))) {
      res.header('Access-Control-Allow-Origin', origin);
    } else {
      res.header('Access-Control-Allow-Origin', req.headers.origin || req.protocol + '://' + req.get('host'));
    }

    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Cookie, Set-Cookie, x-webhook-secret');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Mount modular routes
  app.use("/api", productRoutes);
  app.use("/api", orderRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/mcp", mcpRoutes);
  app.use("/webhook", webhookRoutes);

  console.log("Routes registered");

  // Register AI providers
  providerRegistry.registerConversationalProvider(new OpenAIProvider());
  providerRegistry.registerConversationalProvider(new GeminiProvider());
  providerRegistry.registerTTSProvider(new ElevenLabsProvider());

  console.log("AI Providers initialized");

  const httpServer = createServer(app);
  return httpServer;
}
