import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";

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

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
