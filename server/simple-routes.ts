import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  // Simple products endpoint with in-memory storage
  app.get("/api/products", async (req, res) => {
    const { MemStorage } = await import("./storage");
    const storage = new MemStorage();
    const products = await storage.getProducts();
    res.json(products);
  });

  // Simple menu items endpoint
  app.get("/api/menu-items", async (req, res) => {
    const { MemStorage } = await import("./storage");
    const storage = new MemStorage();
    const menuItems = await storage.getMenuItems();
    res.json(menuItems);
  });

  // Simple hero banner endpoint
  app.get("/api/hero-banner", async (req, res) => {
    const { MemStorage } = await import("./storage");
    const storage = new MemStorage();
    const banner = await storage.getHeroBanner();
    res.json(banner);
  });

  const server = createServer(app);
  return server;
}