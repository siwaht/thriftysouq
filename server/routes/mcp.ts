import { Router } from "express";
import { storage } from "../storage";
import { insertProductSchema, insertHeroBannerSchema } from "@shared/schema";
import { z } from "zod";

const router = Router();

router.get('/info', (req, res) => {
    res.json({
        name: "ThriftySouq MCP HTTP Server",
        version: "1.1.0",
        description: "HTTP-based MCP server for ThriftySouq luxury e-commerce platform",
        capabilities: [
            "product_management",
            "order_management",
            "marketing_automation",
            "webhook_integration",
            "analytics_reporting"
        ],
        endpoints: {
            products: {
                list: "GET /mcp/products",
                create: "POST /mcp/products",
                update: "PUT /mcp/products/:id",
                delete: "DELETE /mcp/products/:id"
            },
            orders: {
                list: "GET /mcp/orders",
                updateStatus: "PATCH /mcp/orders/:id/status"
            },
            marketing: {
                getBanner: "GET /mcp/marketing/hero-banner",
                updateBanner: "POST /mcp/marketing/hero-banner"
            },
            webhooks: "/mcp/webhooks",
            analytics: "/mcp/analytics"
        }
    });
});

router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'ThriftySouq MCP HTTP Server',
        timestamp: new Date().toISOString()
    });
});

// --- Product Management ---

router.get('/products', async (req, res) => {
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

router.post('/products', async (req, res) => {
    try {
        const productData = insertProductSchema.parse(req.body);
        const product = await storage.createProduct(productData);
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

router.put('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new Error("Invalid product ID");

        const productData = insertProductSchema.parse(req.body);
        const product = await storage.updateProduct(id, productData);

        if (!product) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

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

router.delete('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new Error("Invalid product ID");

        const success = await storage.deleteProduct(id);

        if (!success) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// --- Order Management ---

router.get('/orders', async (req, res) => {
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

router.patch('/orders/:id/status', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;

        if (isNaN(id)) throw new Error("Invalid order ID");
        if (!status) throw new Error("Status is required");

        const order = await storage.updateOrderStatus(id, status);

        if (!order) {
            return res.status(404).json({ success: false, error: "Order not found" });
        }

        res.json({
            success: true,
            data: order,
            message: 'Order status updated successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// --- Marketing Management ---

router.get('/marketing/hero-banner', async (req, res) => {
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

router.post('/marketing/hero-banner', async (req, res) => {
    try {
        const bannerData = insertHeroBannerSchema.parse(req.body);
        const banner = await storage.updateHeroBanner(bannerData);
        res.json({
            success: true,
            data: banner,
            message: 'Hero banner updated successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// --- Analytics ---

router.get('/analytics', async (req, res) => {
    try {
        const { period = 'month' } = req.query;

        const products = await storage.getProducts();
        const orders = await storage.getOrders();

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

export default router;
