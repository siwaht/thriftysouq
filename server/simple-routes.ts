import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  // Simple products endpoint with database query
  app.get("/api/products", async (req, res) => {
    try {
      const { DatabaseStorage } = await import("./storage");
      const storage = new DatabaseStorage();
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Database query failed:", error);
      res.json([
        {
          id: 1,
          name: "Test Product",
          brand: "Test Brand", 
          category: "test",
          originalPrice: "100.00",
          discountedPrice: "50.00",
          discount: 50,
          image: "https://via.placeholder.com/400",
          stock: 10
        }
      ]);
    }
  });

  // Simple menu items endpoint
  app.get("/api/menu-items", async (req, res) => {
    try {
      const { DatabaseStorage } = await import("./storage");
      const storage = new DatabaseStorage();
      const menuItems = await storage.getMenuItems();
      res.json(menuItems);
    } catch (error) {
      console.error("Menu items query failed:", error);
      res.json([
        { id: 1, label: "All", value: "all", order: 0, isActive: true },
        { id: 2, label: "Electronics", value: "electronics", order: 1, isActive: true },
        { id: 3, label: "Fashion", value: "fashion", order: 2, isActive: true }
      ]);
    }
  });

  // Simple hero banner endpoint
  app.get("/api/hero-banner", async (req, res) => {
    try {
      const { DatabaseStorage } = await import("./storage");
      const storage = new DatabaseStorage();
      const banner = await storage.getHeroBanner();
      res.json(banner || {
        id: 1,
        badgeIcon: "Sparkles",
        badgeText: "Luxury at unprecedented prices",
        mainTitle: "Premium",
        highlightTitle: "Luxury",
        subtitle: "Made Accessible",
        description: "Discover authenticated luxury brands at up to 70% off. Curated collections from the world's finest houses.",
        buttonText: "Explore Collection",
        footerText: "Free shipping on orders over $200",
        isActive: true,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Hero banner query failed:", error);
      res.json({
        id: 1,
        badgeIcon: "Sparkles",
        badgeText: "Luxury at unprecedented prices",
        mainTitle: "Premium",
        highlightTitle: "Luxury", 
        subtitle: "Made Accessible",
        description: "Discover authenticated luxury brands at up to 70% off. Curated collections from the world's finest houses.",
        buttonText: "Explore Collection",
        footerText: "Free shipping on orders over $200",
        isActive: true,
        updatedAt: new Date()
      });
    }
  });

  const server = createServer(app);
  return server;
}