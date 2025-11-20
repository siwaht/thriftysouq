import { Router } from "express";
import { storage } from "../storage";
import { z } from "zod";
import { webhookService } from "../webhook-service";
import { requireAdminAuth } from "../middleware/auth";

const router = Router();

const createOrderRequest = z.object({
    customerName: z.string(),
    customerEmail: z.string().email(),
    customerPhone: z.string(),
    shippingAddress: z.string(),
    city: z.string(),
    postalCode: z.string().optional(),
    specialInstructions: z.string().optional(),
    paymentMethod: z.enum(["online", "cod"]),
    items: z.array(z.object({
        productId: z.number(),
        quantity: z.number().min(1),
        price: z.string()
    }))
});

// Create order
router.post("/orders", async (req, res) => {
    try {
        console.log("Order request body:", JSON.stringify(req.body, null, 2));
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
            city: orderData.city,
            postalCode: orderData.postalCode || null,
            specialInstructions: orderData.specialInstructions || null,
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
        console.error("Create order error:", error);
        console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid order data", errors: error.errors });
        }
        res.status(500).json({ message: "Failed to create order", error: error instanceof Error ? error.message : "Unknown error" });
    }
});

// Get all orders (admin only)
router.get("/orders", requireAdminAuth, async (req, res) => {
    try {
        const orders = await storage.getOrdersWithItems();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

// Get single order (admin only)
router.get("/orders/:id", requireAdminAuth, async (req, res) => {
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
router.patch("/orders/:id/status", requireAdminAuth, async (req, res) => {
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

export default router;
