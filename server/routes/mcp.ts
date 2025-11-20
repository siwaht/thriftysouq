import { Router } from "express";
import { storage } from "../storage";

const router = Router();

router.get('/info', (req, res) => {
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

router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'ThriftySouq MCP HTTP Server',
        timestamp: new Date().toISOString()
    });
});

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
