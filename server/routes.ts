import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertProductSchema, insertMenuItemSchema, insertWebhookSchema } from "@shared/schema";
import { z } from "zod";
import { webhookService } from "./webhook-service";

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
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrdersWithItems();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Get single order (admin only)
  app.get("/api/orders/:id", async (req, res) => {
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
  app.patch("/api/orders/:id/status", async (req, res) => {
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
  app.post("/api/admin/products", async (req, res) => {
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
  app.put("/api/admin/products/:id", async (req, res) => {
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
  app.delete("/api/admin/products/:id", async (req, res) => {
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
  app.post("/api/admin/menu-items", async (req, res) => {
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
  app.put("/api/admin/menu-items/:id", async (req, res) => {
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
  app.delete("/api/admin/menu-items/:id", async (req, res) => {
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
  app.put("/api/admin/menu-items/:id/order", async (req, res) => {
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
  app.get("/api/admin/webhooks", async (req, res) => {
    try {
      const webhooks = await storage.getWebhooks();
      res.json(webhooks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch webhooks" });
    }
  });

  // Create webhook
  app.post("/api/admin/webhooks", async (req, res) => {
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
  app.put("/api/admin/webhooks/:id", async (req, res) => {
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
  app.delete("/api/admin/webhooks/:id", async (req, res) => {
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
  app.post("/api/admin/webhooks/:id/test", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
