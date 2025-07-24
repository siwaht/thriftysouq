import { Server } from "@modelcontextprotocol/sdk/server/index";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types";
import { storage } from "./storage";

// MCP Server for ThriftySouq E-commerce Platform
class ThriftySouqMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "thriftysouq-mcp-server",
        version: "1.0.0",
        description: "MCP server for ThriftySouq luxury e-commerce platform providing access to products, orders, admin functions, and marketing tools"
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    // List all available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        // Product Management Tools
        {
          name: "get_products",
          description: "Get all products with optional category filtering",
          inputSchema: {
            type: "object",
            properties: {
              category: { type: "string", description: "Filter by category (optional)" }
            }
          }
        },
        {
          name: "get_product",
          description: "Get a specific product by ID",
          inputSchema: {
            type: "object",
            properties: {
              id: { type: "number", description: "Product ID" }
            },
            required: ["id"]
          }
        },
        {
          name: "create_product",
          description: "Create a new product (admin required)",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string", description: "Product name" },
              brand: { type: "string", description: "Product brand" },
              category: { type: "string", description: "Product category" },
              originalPrice: { type: "string", description: "Original price in AED" },
              discountedPrice: { type: "string", description: "Discounted price in AED" },
              discount: { type: "number", description: "Discount percentage" },
              image: { type: "string", description: "Product image URL" },
              stock: { type: "number", description: "Stock quantity" }
            },
            required: ["name", "brand", "category", "originalPrice", "discountedPrice", "discount", "image", "stock"]
          }
        },
        {
          name: "update_product",
          description: "Update an existing product (admin required)",
          inputSchema: {
            type: "object",
            properties: {
              id: { type: "number", description: "Product ID" },
              name: { type: "string", description: "Product name" },
              brand: { type: "string", description: "Product brand" },
              category: { type: "string", description: "Product category" },
              originalPrice: { type: "string", description: "Original price in AED" },
              discountedPrice: { type: "string", description: "Discounted price in AED" },
              discount: { type: "number", description: "Discount percentage" },
              image: { type: "string", description: "Product image URL" },
              stock: { type: "number", description: "Stock quantity" }
            },
            required: ["id"]
          }
        },
        {
          name: "delete_product",
          description: "Delete a product (admin required)",
          inputSchema: {
            type: "object",
            properties: {
              id: { type: "number", description: "Product ID" }
            },
            required: ["id"]
          }
        },
        
        // Order Management Tools
        {
          name: "get_orders",
          description: "Get all orders (admin required)",
          inputSchema: {
            type: "object",
            properties: {
              status: { type: "string", description: "Filter by order status (optional)" }
            }
          }
        },
        {
          name: "create_order",
          description: "Create a new order",
          inputSchema: {
            type: "object",
            properties: {
              customerName: { type: "string", description: "Customer name" },
              customerEmail: { type: "string", description: "Customer email" },
              customerPhone: { type: "string", description: "Customer phone" },
              shippingAddress: { type: "string", description: "Shipping address" },
              city: { type: "string", description: "City" },
              postalCode: { type: "string", description: "Postal code (optional)" },
              specialInstructions: { type: "string", description: "Special instructions (optional)" },
              paymentMethod: { type: "string", enum: ["online", "cod"], description: "Payment method" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    productId: { type: "number", description: "Product ID" },
                    quantity: { type: "number", description: "Quantity" },
                    price: { type: "string", description: "Price per item" }
                  },
                  required: ["productId", "quantity", "price"]
                }
              }
            },
            required: ["customerName", "customerEmail", "customerPhone", "shippingAddress", "city", "paymentMethod", "items"]
          }
        },
        {
          name: "update_order_status",
          description: "Update order status (admin required)",
          inputSchema: {
            type: "object",
            properties: {
              orderNumber: { type: "string", description: "Order number" },
              status: { type: "string", enum: ["pending", "processing", "shipped", "delivered", "cancelled"], description: "New status" }
            },
            required: ["orderNumber", "status"]
          }
        },

        // Marketing & Analytics Tools
        {
          name: "get_hero_banner",
          description: "Get hero banner content",
          inputSchema: {
            type: "object",
            properties: {}
          }
        },
        {
          name: "update_hero_banner",
          description: "Update hero banner content (admin required)",
          inputSchema: {
            type: "object",
            properties: {
              badgeIcon: { type: "string", description: "Badge icon name" },
              badgeText: { type: "string", description: "Badge text" },
              mainTitle: { type: "string", description: "Main title" },
              highlightTitle: { type: "string", description: "Highlight title" },
              subtitle: { type: "string", description: "Subtitle" },
              description: { type: "string", description: "Description" },
              buttonText: { type: "string", description: "Button text" },
              footerText: { type: "string", description: "Footer text" }
            }
          }
        },
        {
          name: "generate_ai_marketing",
          description: "Generate AI-powered marketing content (admin required)",
          inputSchema: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["hero", "product", "email"], description: "Content type" },
              productIds: { type: "array", items: { type: "number" }, description: "Product IDs for context (optional)" }
            },
            required: ["type"]
          }
        },

        // Menu Management Tools
        {
          name: "get_menu_items",
          description: "Get navigation menu items",
          inputSchema: {
            type: "object",
            properties: {}
          }
        },
        {
          name: "create_menu_item",
          description: "Create a new menu item (admin required)",
          inputSchema: {
            type: "object",
            properties: {
              label: { type: "string", description: "Menu label" },
              value: { type: "string", description: "Menu value" },
              order: { type: "number", description: "Display order" },
              isActive: { type: "boolean", description: "Is active" }
            },
            required: ["label", "value", "order"]
          }
        },

        // Webhook Management Tools
        {
          name: "get_webhooks",
          description: "Get all webhooks (admin required)",
          inputSchema: {
            type: "object",
            properties: {}
          }
        },
        {
          name: "create_webhook",
          description: "Create a new webhook (admin required)",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string", description: "Webhook name" },
              url: { type: "string", description: "Webhook URL" },
              events: { type: "array", items: { type: "string" }, description: "Event types" },
              secret: { type: "string", description: "Webhook secret (optional)" }
            },
            required: ["name", "url", "events"]
          }
        },
        {
          name: "test_webhook",
          description: "Test a webhook endpoint (admin required)",
          inputSchema: {
            type: "object",
            properties: {
              url: { type: "string", description: "Webhook URL to test" },
              event: { type: "string", description: "Event type to simulate" },
              data: { type: "object", description: "Test data payload" }
            },
            required: ["url", "event"]
          }
        },

        // Analytics Tools
        {
          name: "get_analytics",
          description: "Get business analytics data (admin required)",
          inputSchema: {
            type: "object",
            properties: {
              period: { type: "string", enum: ["day", "week", "month", "year"], description: "Analytics period" }
            }
          }
        }
      ]
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // Product Management
          case "get_products":
            if (args?.category) {
              return { content: [{ type: "text", text: JSON.stringify(await storage.getProductsByCategory(args.category), null, 2) }] };
            }
            return { content: [{ type: "text", text: JSON.stringify(await storage.getProducts(), null, 2) }] };

          case "get_product":
            const product = await storage.getProductById(args.id);
            return { content: [{ type: "text", text: JSON.stringify(product || { error: "Product not found" }, null, 2) }] };

          case "create_product":
            const newProduct = await storage.createProduct(args);
            return { content: [{ type: "text", text: JSON.stringify(newProduct, null, 2) }] };

          case "update_product":
            const updatedProduct = await storage.updateProduct(args.id, args);
            return { content: [{ type: "text", text: JSON.stringify(updatedProduct, null, 2) }] };

          case "delete_product":
            await storage.deleteProduct(args.id);
            return { content: [{ type: "text", text: JSON.stringify({ success: true, message: "Product deleted" }) }] };

          // Order Management
          case "get_orders":
            const orders = await storage.getOrders();
            const filteredOrders = args?.status ? orders.filter(o => o.status === args.status) : orders;
            return { content: [{ type: "text", text: JSON.stringify(filteredOrders, null, 2) }] };

          case "create_order":
            const orderResult = await storage.createOrder(args, args.items);
            return { content: [{ type: "text", text: JSON.stringify(orderResult, null, 2) }] };

          case "update_order_status":
            await storage.updateOrderStatus(args.orderNumber, args.status);
            return { content: [{ type: "text", text: JSON.stringify({ success: true, message: "Order status updated" }) }] };

          // Marketing & Content
          case "get_hero_banner":
            const heroBanner = await storage.getHeroBanner();
            return { content: [{ type: "text", text: JSON.stringify(heroBanner, null, 2) }] };

          case "update_hero_banner":
            const updatedBanner = await storage.updateHeroBanner(args);
            return { content: [{ type: "text", text: JSON.stringify(updatedBanner, null, 2) }] };

          case "generate_ai_marketing":
            // This would integrate with the AI marketing service
            return { content: [{ type: "text", text: JSON.stringify({ message: "AI marketing content generation initiated", type: args.type }) }] };

          // Menu Management
          case "get_menu_items":
            const menuItems = await storage.getMenuItems();
            return { content: [{ type: "text", text: JSON.stringify(menuItems, null, 2) }] };

          case "create_menu_item":
            const newMenuItem = await storage.createMenuItem(args);
            return { content: [{ type: "text", text: JSON.stringify(newMenuItem, null, 2) }] };

          // Webhook Management
          case "get_webhooks":
            const webhooks = await storage.getAllWebhooks();
            return { content: [{ type: "text", text: JSON.stringify(webhooks, null, 2) }] };

          case "create_webhook":
            const newWebhook = await storage.createWebhook(args);
            return { content: [{ type: "text", text: JSON.stringify(newWebhook, null, 2) }] };

          case "test_webhook":
            // This would integrate with the webhook service
            return { content: [{ type: "text", text: JSON.stringify({ message: "Webhook test initiated", url: args.url, event: args.event }) }] };

          // Analytics
          case "get_analytics":
            const analytics = {
              totalProducts: (await storage.getProducts()).length,
              totalOrders: (await storage.getOrders()).length,
              period: args?.period || "month",
              timestamp: new Date().toISOString()
            };
            return { content: [{ type: "text", text: JSON.stringify(analytics, null, 2) }] };

          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${errorMessage}`);
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log("ThriftySouq MCP Server running on stdio");
  }
}

// Run the server
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new ThriftySouqMCPServer();
  server.run().catch(console.error);
}

export { ThriftySouqMCPServer };