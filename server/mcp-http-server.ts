import express from "express";
import { storage } from "./storage";
import { aiMarketing } from "./ai-marketing";
import { webhookService } from "./webhook-service";

/**
 * MCP HTTP Server for ThriftySouq E-commerce Platform
 * Provides RESTful API endpoints for external integrations and AI assistants
 */
export function createMCPHttpServer() {
  const app = express();
  app.use(express.json());
  
  // Debug middleware
  app.use((req, res, next) => {
    console.log(`[MCP] ${req.method} ${req.path}`);
    next();
  });

  // CORS for external access
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // API Key authentication middleware (optional)
  const authenticateAPI = (req: any, res: any, next: any) => {
    const apiKey = req.headers['x-api-key'];
    // For now, allow any API key or no key for easier integration
    // In production, you would validate against stored API keys
    next();
  };

  // MCP Server Information
  app.get('/mcp/info', (req, res) => {
    res.json({
      name: "ThriftySouq MCP HTTP Server",
      version: "1.0.0",
      description: "HTTP-based MCP server for ThriftySouq luxury e-commerce platform",
      capabilities: [
        "product_management",
        "order_management", 
        "marketing_automation",
        "webhook_integration",
        "analytics_reporting"
      ],
      endpoints: {
        products: "/mcp/products",
        orders: "/mcp/orders", 
        marketing: "/mcp/marketing",
        webhooks: "/mcp/webhooks",
        analytics: "/mcp/analytics"
      }
    });
  });

  // Product Management Endpoints
  app.get('/mcp/products', authenticateAPI, async (req, res) => {
    try {
      const { category } = req.query;
      const products = category ? 
        await storage.getProductsByCategory(category as string) : 
        await storage.getProducts();
      
      res.json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get('/mcp/products/:id', authenticateAPI, async (req, res) => {
    try {
      const product = await storage.getProductById(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post('/mcp/products', authenticateAPI, async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.status(201).json({
        success: true,
        data: product,
        message: 'Product created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.put('/mcp/products/:id', authenticateAPI, async (req, res) => {
    try {
      const product = await storage.updateProduct(parseInt(req.params.id), req.body);
      res.json({
        success: true,
        data: product,
        message: 'Product updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.delete('/mcp/products/:id', authenticateAPI, async (req, res) => {
    try {
      await storage.deleteProduct(parseInt(req.params.id));
      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Order Management Endpoints
  app.get('/mcp/orders', authenticateAPI, async (req, res) => {
    try {
      const { status } = req.query;
      let orders = await storage.getOrders();
      
      if (status) {
        orders = orders.filter(order => order.status === status);
      }
      
      res.json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post('/mcp/orders', authenticateAPI, async (req, res) => {
    try {
      const { items, ...orderData } = req.body;
      const result = await storage.createOrder(orderData, items);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Order created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.patch('/mcp/orders/:orderNumber/status', authenticateAPI, async (req, res) => {
    try {
      const { status } = req.body;
      await storage.updateOrderStatus(req.params.orderNumber, status);
      
      res.json({
        success: true,
        message: 'Order status updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Marketing Automation Endpoints
  app.get('/mcp/marketing/hero-banner', authenticateAPI, async (req, res) => {
    try {
      const heroBanner = await storage.getHeroBanner();
      res.json({
        success: true,
        data: heroBanner
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.put('/mcp/marketing/hero-banner', authenticateAPI, async (req, res) => {
    try {
      const heroBanner = await storage.updateHeroBanner(req.body);
      res.json({
        success: true,
        data: heroBanner,
        message: 'Hero banner updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post('/mcp/marketing/ai-generate', authenticateAPI, async (req, res) => {
    try {
      const { type, productIds } = req.body;
      let products = await storage.getProducts();
      
      if (productIds && productIds.length > 0) {
        products = products.filter(p => productIds.includes(p.id));
      }

      let result;
      switch (type) {
        case 'hero':
          result = await aiMarketing.generateHeroBannerContent(products);
          break;
        case 'dual':
          result = await aiMarketing.generateDualAIContent(products);
          break;
        default:
          throw new Error(`Unsupported content type: ${type}`);
      }

      res.json({
        success: true,
        data: result,
        message: 'AI content generated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Webhook Management Endpoints
  app.get('/mcp/webhooks', authenticateAPI, async (req, res) => {
    try {
      const webhooks = await storage.getAllWebhooks();
      res.json({
        success: true,
        data: webhooks,
        count: webhooks.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post('/mcp/webhooks', authenticateAPI, async (req, res) => {
    try {
      const webhook = await storage.createWebhook(req.body);
      res.status(201).json({
        success: true,
        data: webhook,
        message: 'Webhook created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post('/mcp/webhooks/test', authenticateAPI, async (req, res) => {
    try {
      const { url, event, data } = req.body;
      const result = await webhookService.testWebhook(url, event, data);
      
      res.json({
        success: true,
        data: result,
        message: 'Webhook test completed'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Analytics Endpoints
  app.get('/mcp/analytics', authenticateAPI, async (req, res) => {
    try {
      const { period = 'month' } = req.query;
      
      const products = await storage.getProducts();
      const orders = await storage.getOrders();
      
      // Calculate basic analytics
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
      const topCategories = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const analytics = {
        period,
        timestamp: new Date().toISOString(),
        metrics: {
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue: totalRevenue.toFixed(2),
          averageOrderValue: averageOrderValue.toFixed(2),
          topCategories,
          orderStatusDistribution: orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        }
      };
      
      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Health check endpoint
  app.get('/mcp/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'ThriftySouq MCP HTTP Server',
      timestamp: new Date().toISOString()
    });
  });

  return app;
}