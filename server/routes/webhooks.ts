import { Router } from "express";
import { storage } from "../storage";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";

const router = Router();

// Add product via webhook
router.post("/products", async (req, res) => {
    try {
        // Validate webhook signature if secret is provided
        const webhookSecret = req.headers['x-webhook-secret'];
        if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
            return res.status(401).json({ message: "Invalid webhook signature" });
        }

        const productData = insertProductSchema.parse(req.body);
        const product = await storage.createProduct(productData);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Invalid product data",
                errors: error.errors
            });
        }
        res.status(500).json({ message: "Failed to create product" });
    }
});

// Update product via webhook
router.put("/products/:id", async (req, res) => {
    try {
        // Validate webhook signature if secret is provided
        const webhookSecret = req.headers['x-webhook-secret'];
        if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
            return res.status(401).json({ message: "Invalid webhook signature" });
        }

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const productData = insertProductSchema.partial().parse(req.body);
        const product = await storage.updateProduct(id, productData as any);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Invalid product data",
                errors: error.errors
            });
        }
        res.status(500).json({ message: "Failed to update product" });
    }
});

// Delete product via webhook
router.delete("/products/:id", async (req, res) => {
    try {
        // Validate webhook signature if secret is provided
        const webhookSecret = req.headers['x-webhook-secret'];
        if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
            return res.status(401).json({ message: "Invalid webhook signature" });
        }

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const success = await storage.deleteProduct(id);

        if (!success) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete product" });
    }
});

// Get all products via webhook (for external systems to sync)
router.get("/products", async (req, res) => {
    try {
        // Validate webhook signature if secret is provided
        const webhookSecret = req.headers['x-webhook-secret'];
        if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
            return res.status(401).json({ message: "Invalid webhook signature" });
        }

        const products = await storage.getProducts();
        res.json({
            success: true,
            products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

// Bulk operations via webhook
router.post("/products/bulk", async (req, res) => {
    try {
        // Validate webhook signature if secret is provided
        const webhookSecret = req.headers['x-webhook-secret'];
        if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
            return res.status(401).json({ message: "Invalid webhook signature" });
        }

        const { operation, products } = req.body;

        if (!operation || !Array.isArray(products)) {
            return res.status(400).json({
                message: "Operation and products array are required"
            });
        }

        const results = {
            success: 0,
            errors: [] as string[]
        };

        switch (operation) {
            case 'create':
                for (let i = 0; i < products.length; i++) {
                    try {
                        const productData = insertProductSchema.parse(products[i]);
                        await storage.createProduct(productData);
                        results.success++;
                    } catch (error) {
                        results.errors.push(`Product ${i + 1}: ${error instanceof Error ? error.message : 'Failed to create'}`);
                    }
                }
                break;

            case 'update':
                for (let i = 0; i < products.length; i++) {
                    try {
                        const { id, ...productData } = products[i];
                        if (!id) {
                            results.errors.push(`Product ${i + 1}: ID is required for updates`);
                            continue;
                        }
                        const validData = insertProductSchema.partial().parse(productData);
                        const updated = await storage.updateProduct(id, validData as any);
                        if (updated) {
                            results.success++;
                        } else {
                            results.errors.push(`Product ${i + 1}: Not found`);
                        }
                    } catch (error) {
                        results.errors.push(`Product ${i + 1}: ${error instanceof Error ? error.message : 'Failed to update'}`);
                    }
                }
                break;

            case 'delete':
                for (let i = 0; i < products.length; i++) {
                    try {
                        const { id } = products[i];
                        if (!id) {
                            results.errors.push(`Product ${i + 1}: ID is required for deletion`);
                            continue;
                        }
                        const deleted = await storage.deleteProduct(id);
                        if (deleted) {
                            results.success++;
                        } else {
                            results.errors.push(`Product ${i + 1}: Not found`);
                        }
                    } catch (error) {
                        results.errors.push(`Product ${i + 1}: ${error instanceof Error ? error.message : 'Failed to delete'}`);
                    }
                }
                break;

            default:
                return res.status(400).json({
                    message: "Invalid operation. Use 'create', 'update', or 'delete'"
                });
        }

        res.json({
            success: true,
            message: `Bulk ${operation} completed`,
            results
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to process bulk operation" });
    }
});

// Order Management Webhooks

// Get all orders via webhook
router.get("/orders", async (req, res) => {
    try {
        // Validate webhook signature if secret is provided
        const webhookSecret = req.headers['x-webhook-secret'];
        if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
            return res.status(401).json({ message: "Invalid webhook signature" });
        }

        const orders = await storage.getOrders();
        res.json({
            success: true,
            orders,
            count: orders.length
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

// Update order status via webhook
router.put("/orders/:id/status", async (req, res) => {
    try {
        // Validate webhook signature if secret is provided
        const webhookSecret = req.headers['x-webhook-secret'];
        if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
            return res.status(401).json({ message: "Invalid webhook signature" });
        }

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        // Validate status values
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Must be one of: " + validStatuses.join(', ')
            });
        }

        const order = await storage.updateOrderStatus(id, status);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update order status" });
    }
});

// Get specific order via webhook
router.get("/orders/:id", async (req, res) => {
    try {
        // Validate webhook signature if secret is provided
        const webhookSecret = req.headers['x-webhook-secret'];
        if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
            return res.status(401).json({ message: "Invalid webhook signature" });
        }

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const order = await storage.getOrderById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch order" });
    }
});

// Bulk order status update via webhook
router.post("/orders/bulk-status", async (req, res) => {
    try {
        // Validate webhook signature if secret is provided
        const webhookSecret = req.headers['x-webhook-secret'];
        if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
            return res.status(401).json({ message: "Invalid webhook signature" });
        }

        const { orders } = req.body;

        if (!Array.isArray(orders)) {
            return res.status(400).json({
                message: "Orders array is required"
            });
        }

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        const results = {
            success: 0,
            errors: [] as string[]
        };

        for (let i = 0; i < orders.length; i++) {
            try {
                const { id, status } = orders[i];

                if (!id) {
                    results.errors.push(`Order ${i + 1}: ID is required`);
                    continue;
                }

                if (!status) {
                    results.errors.push(`Order ${i + 1}: Status is required`);
                    continue;
                }

                if (!validStatuses.includes(status)) {
                    results.errors.push(`Order ${i + 1}: Invalid status. Must be one of: ${validStatuses.join(', ')}`);
                    continue;
                }

                const updated = await storage.updateOrderStatus(id, status);
                if (updated) {
                    results.success++;
                } else {
                    results.errors.push(`Order ${i + 1}: Not found`);
                }
            } catch (error) {
                results.errors.push(`Order ${i + 1}: ${error instanceof Error ? error.message : 'Failed to update'}`);
            }
        }

        res.json({
            success: true,
            message: `Bulk status update completed`,
            results
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to process bulk status update" });
    }
});

export default router;
