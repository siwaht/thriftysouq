# ThriftySouq MCP (Model Context Protocol) Integration

## Overview

ThriftySouq now includes comprehensive MCP server integration, providing standardized access to all platform endpoints for AI assistants, automation tools, and external integrations.

## MCP Server Features

### 🔧 Dual MCP Implementation

**1. Standard MCP Server (stdio)**
- Protocol-compliant MCP server for AI assistant integration
- Supports all MCP standard operations (list_tools, call_tool)
- Ideal for Claude Desktop, AI agents, and MCP-compatible tools

**2. HTTP MCP Server (REST API)**
- RESTful HTTP endpoints with MCP-style responses
- API key authentication support
- Perfect for webhooks, external services, and custom integrations

## Available Tools & Endpoints

### 📦 Product Management
- `get_products` / `GET /mcp/products` - List all products with optional category filtering
- `get_product` / `GET /mcp/products/:id` - Get specific product details
- `create_product` / `POST /mcp/products` - Create new luxury products
- `update_product` / `PUT /mcp/products/:id` - Update existing products
- `delete_product` / `DELETE /mcp/products/:id` - Remove products from catalog

### 🛒 Order Management
- `get_orders` / `GET /mcp/orders` - List all orders with status filtering
- `create_order` / `POST /mcp/orders` - Process new customer orders
- `update_order_status` / `PATCH /mcp/orders/:orderNumber/status` - Update order fulfillment

### 🎯 Marketing Automation
- `get_hero_banner` / `GET /mcp/marketing/hero-banner` - Get current hero banner content
- `update_hero_banner` / `PUT /mcp/marketing/hero-banner` - Update hero banner
- `generate_ai_marketing` / `POST /mcp/marketing/ai-generate` - AI-powered content generation

### 🔗 Webhook Integration
- `get_webhooks` / `GET /mcp/webhooks` - List configured webhooks
- `create_webhook` / `POST /mcp/webhooks` - Register new webhook endpoints
- `test_webhook` / `POST /mcp/webhooks/test` - Test webhook connectivity

### 📊 Analytics & Reporting
- `get_analytics` / `GET /mcp/analytics` - Business metrics and performance data
- `get_menu_items` / `GET /mcp/menu-items` - Navigation menu management

## Integration Examples

### Using with Claude Desktop

1. **Configure MCP Server**
```json
{
  "mcpServers": {
    "thriftysouq": {
      "command": "node",
      "args": ["dist/mcp-server.js"],
      "cwd": "/path/to/thriftysouq"
    }
  }
}
```

2. **Example Queries**
- "Show me all luxury watches in the catalog"
- "Create a new product for a Cartier bracelet"
- "Generate AI marketing content for our top jewelry pieces"
- "Update the hero banner for the holiday sale"

### HTTP API Integration

1. **Base URL**: `https://your-domain.com/mcp`

2. **Authentication** (Optional)
```bash
curl -H "X-API-Key: your-api-key" https://your-domain.com/mcp/products
```

3. **Example Requests**
```bash
# Get all products
curl https://your-domain.com/mcp/products

# Create new product
curl -X POST https://your-domain.com/mcp/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hermès Birkin Bag",
    "brand": "Hermès",
    "category": "bags",
    "originalPrice": "36700.00",
    "discountedPrice": "25690.00",
    "discount": 30,
    "stock": 1
  }'

# Generate AI marketing content
curl -X POST https://your-domain.com/mcp/marketing/ai-generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "hero",
    "productIds": [1, 2, 3]
  }'

# Get business analytics
curl https://your-domain.com/mcp/analytics?period=month
```

## Response Format

All HTTP endpoints return standardized responses:

```json
{
  "success": true,
  "data": { /* Response data */ },
  "message": "Operation completed successfully",
  "count": 10 // For list operations
}
```

Error responses:
```json
{
  "success": false,
  "error": "Detailed error message"
}
```

## Use Cases

### 🤖 AI Assistant Integration
- Automate product catalog management
- Generate marketing content with AI
- Analyze sales performance
- Manage customer orders

### 🔄 External System Integration
- Sync with inventory management systems
- Connect to CRM platforms
- Integrate with shipping providers
- Link to accounting software

### 📈 Business Automation
- Automated reordering based on stock levels
- Dynamic pricing updates
- Marketing campaign automation
- Customer service workflows

## Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp/info` | GET | Server information and capabilities |
| `/mcp/health` | GET | Health check status |
| `/mcp/products` | GET/POST | Product management |
| `/mcp/products/:id` | GET/PUT/DELETE | Individual product operations |
| `/mcp/orders` | GET/POST | Order management |
| `/mcp/orders/:orderNumber/status` | PATCH | Update order status |
| `/mcp/marketing/hero-banner` | GET/PUT | Hero banner management |
| `/mcp/marketing/ai-generate` | POST | AI content generation |
| `/mcp/webhooks` | GET/POST | Webhook management |
| `/mcp/webhooks/test` | POST | Webhook testing |
| `/mcp/analytics` | GET | Business analytics |

## Security Considerations

- Optional API key authentication via `X-API-Key` header
- CORS enabled for external access
- Input validation on all endpoints
- Error handling prevents information leakage

## Getting Started

1. **MCP Server is automatically running** when you start the application
2. **HTTP endpoints available** at `/mcp/*` routes
3. **No additional configuration required** - works out of the box
4. **Test connectivity** using `/mcp/health` endpoint

Your ThriftySouq platform now provides complete MCP integration for seamless AI assistant and external system connectivity! 🚀