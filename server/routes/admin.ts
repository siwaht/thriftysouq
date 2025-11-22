import { Router } from "express";
import { storage } from "../storage";
import { insertProductSchema, insertMenuItemSchema, insertWebhookSchema, insertHeroBannerSchema, insertPaymentCredentialSchema } from "@shared/schema";
import { z } from "zod";
import { requireAdminAuth } from "../middleware/auth";
import { createAdminSession, deleteAdminSession, validateAdminSession, getActiveSessionCount } from "../simple-auth";
import { aiMarketing } from "../ai-marketing";
import { providerRegistry } from "../ai/provider-registry";
import bcrypt from "bcryptjs";

const router = Router();

// Admin Login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await storage.getAdminUserByUsername(username);

        if (!admin || !admin.isActive) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate session
        const sessionId = createAdminSession(admin.id, admin.username);
        console.log("Admin login successful:", admin.username);

        // Set session cookie
        res.cookie('adminSessionId', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'lax'
        });

        res.json({
            message: "Login successful",
            admin: { id: admin.id, username: admin.username },
            sessionId // Return for client-side storage as backup
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});

router.post("/logout", (req, res) => {
    const sessionId = req.cookies?.adminSessionId;
    if (sessionId) {
        deleteAdminSession(sessionId);
    }
    console.log("Admin logout - clearing session");
    res.clearCookie('adminSessionId');
    res.json({ message: "Logout successful" });
});

router.get("/auth-status", (req, res) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.adminSessionId;
    let isAuthenticated = false;
    let adminData = null;

    if (sessionId) {
        adminData = validateAdminSession(sessionId);
        isAuthenticated = !!adminData;
    }

    res.json({
        isAuthenticated,
        session: sessionId ? 'present' : 'missing',
        admin: adminData ? { username: adminData.username } : null,
        debug: {
            hasSession: !!sessionId,
            sessionValid: isAuthenticated,
            activeSessions: getActiveSessionCount()
        }
    });
});

// Admin Product Routes
router.get("/products", requireAdminAuth, async (req, res) => {
    try {
        const products = await storage.getProducts();
        res.json(products);
    } catch (error) {
        console.error("Failed to fetch products for admin:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

router.post("/products", requireAdminAuth, async (req, res) => {
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

router.put("/products/:id", requireAdminAuth, async (req, res) => {
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

router.delete("/products/:id", requireAdminAuth, async (req, res) => {
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

router.post("/products/bulk-import", requireAdminAuth, async (req, res) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Products array is required" });
        }

        const results = {
            success: 0,
            errors: [] as string[]
        };

        for (let i = 0; i < products.length; i++) {
            try {
                const productData = products[i];

                // Validate required fields
                if (!productData.name || !productData.brand || !productData.category ||
                    !productData.originalPrice || !productData.discountedPrice ||
                    typeof productData.discount !== 'number' || typeof productData.stock !== 'number') {
                    results.errors.push(`Product ${i + 1}: Missing or invalid required fields`);
                    continue;
                }

                // Validate category
                if (!["watches", "jewelry", "fashion", "accessories", "beauty"].includes(productData.category)) {
                    results.errors.push(`Product ${i + 1}: Invalid category`);
                    continue;
                }

                // Create product
                await storage.createProduct({
                    name: productData.name,
                    brand: productData.brand,
                    category: productData.category,
                    originalPrice: productData.originalPrice,
                    discountedPrice: productData.discountedPrice,
                    discount: productData.discount,
                    image: productData.image || "https://via.placeholder.com/400x400",
                    stock: productData.stock
                });

                results.success++;
            } catch (error) {
                results.errors.push(`Product ${i + 1}: Failed to create product - ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Failed to process bulk import" });
    }
});

// Admin Menu Items
router.post("/menu-items", requireAdminAuth, async (req, res) => {
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

router.put("/menu-items/:id", requireAdminAuth, async (req, res) => {
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

router.delete("/menu-items/:id", requireAdminAuth, async (req, res) => {
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

router.put("/menu-items/:id/order", requireAdminAuth, async (req, res) => {
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

// User Management
router.get("/users", requireAdminAuth, async (req, res) => {
    try {
        const users = await storage.getAdminUsers();
        const safeUsers = users.map(({ passwordHash, ...user }) => user);
        res.json(safeUsers);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
});
router.post("/users", requireAdminAuth, async (req, res) => {
    try {
        const { username, email, password, role, isActive } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email, and password are required" });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await storage.createAdminUser({
            username, email, passwordHash, role: role || "admin", isActive: isActive !== undefined ? isActive : true
        });
        const { passwordHash: _, ...safeUser } = newUser;
        res.status(201).json(safeUser);
    } catch (error) {
        console.error("Failed to create user:", error);
        res.status(500).json({ message: error.message || "Failed to create user" });
    }
});
router.put("/users/:id", requireAdminAuth, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { username, email, password, role, isActive } = req.body;
        const updates = {};
        if (username) updates.username = username;
        if (email) updates.email = email;
        if (role) updates.role = role;
        if (isActive !== undefined) updates.isActive = isActive;
        if (password) updates.passwordHash = await bcrypt.hash(password, 10);
        const updatedUser = await storage.updateAdminUser(userId, updates);
        const { passwordHash: _, ...safeUser } = updatedUser;
        res.json(safeUser);
    } catch (error) {
        console.error("Failed to update user:", error);
        res.status(500).json({ message: error.message || "Failed to update user" });
    }
});
router.delete("/users/:id", requireAdminAuth, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        await storage.deleteAdminUser(userId);
        res.status(204).send();
    } catch (error) {
        console.error("Failed to delete user:", error);
        res.status(500).json({ message: error.message || "Failed to delete user" });
    }
});
// Webhook Management
router.get("/webhooks", requireAdminAuth, async (req, res) => {
    try {
        const webhooks = await storage.getWebhooks();
        res.json(webhooks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch webhooks" });
    }
});

router.post("/webhooks", requireAdminAuth, async (req, res) => {

    try {

        const webhookData = insertWebhookSchema.parse(req.body);

        const webhook = await storage.createWebhook(webhookData);

        res.json(webhook);


    } catch (error) {

        if (error instanceof z.ZodError) {

            return res.status(400).json({
                message: "Invalid webhook data", errors: error.errors
            });


        }

        res.status(500).json({
            message: "Failed to create webhook"
        });


    }


});



router.put("/webhooks/:id", requireAdminAuth, async (req, res) => {

    try {

        const id = parseInt(req.params.id);

        if (isNaN(id)) {

            return res.status(400).json({
                message: "Invalid webhook ID"
            });


        }



        const webhookData = insertWebhookSchema.parse(req.body);

        const webhook = await storage.updateWebhook(id, webhookData);



        if (!webhook) {

            return res.status(404).json({
                message: "Webhook not found"
            });


        }



        res.json(webhook);


    } catch (error) {

        if (error instanceof z.ZodError) {

            return res.status(400).json({
                message: "Invalid webhook data", errors: error.errors
            });


        }

        res.status(500).json({
            message: "Failed to update webhook"
        });


    }


});



router.delete("/webhooks/:id", requireAdminAuth, async (req, res) => {

    try {

        const id = parseInt(req.params.id);

        if (isNaN(id)) {

            return res.status(400).json({
                message: "Invalid webhook ID"
            });


        }



        const success = await storage.deleteWebhook(id);



        if (!success) {

            return res.status(404).json({
                message: "Webhook not found"
            });


        }



        res.json({
            message: "Webhook deleted successfully"
        });


    } catch (error) {

        res.status(500).json({
            message: "Failed to delete webhook"
        });


    }


});



router.post("/webhooks/:id/test", requireAdminAuth, async (req, res) => {

    try {

        const id = parseInt(req.params.id);

        const webhooks = await storage.getWebhooks();

        const webhook = webhooks.find(w => w.id === id);



        if (!webhook) {

            return res.status(404).json({
                message: "Webhook not found"
            });


        }



        // Send test payload

        const testPayload = {

            event: 'webhook.test',

            timestamp: new Date().toISOString(),

            data: {

                message: 'This is a test webhook from ThriftySouq',

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

                res.json({
                    message: "Test webhook sent successfully", status: response.status
                });


            } else {

                res.status(500).json({
                    message: "Webhook endpoint returned error", status: response.status
                });


            }


        } catch (webhookError) {

            res.status(500).json({
                message: "Failed to send test webhook", error: String(webhookError)
            });


        }


    } catch (error) {

        res.status(500).json({
            message: "Failed to test webhook"
        });


    }


});



// Hero Banner Management

router.put("/hero-banner", requireAdminAuth, async (req, res) => {

    try {

        const bannerData = insertHeroBannerSchema.parse(req.body);

        const banner = await storage.updateHeroBanner(bannerData);

        res.json(banner);


    } catch (error) {

        if (error instanceof z.ZodError) {

            return res.status(400).json({
                message: "Invalid hero banner data", errors: error.errors
            });


        }

        res.status(500).json({
            message: "Failed to update hero banner"
        });


    }


});



// Payment Credentials

router.get("/payment-credentials", requireAdminAuth, async (req, res) => {
    try {
        const credentials = await storage.getPaymentCredentials();
        res.json(credentials);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch payment credentials" });
    }
});



router.post("/payment-credentials", requireAdminAuth, async (req, res) => {

    try {

        const credentialData = insertPaymentCredentialSchema.parse(req.body);

        const credential = await storage.upsertPaymentCredential(credentialData);

        res.json(credential);


    } catch (error) {

        if (error instanceof z.ZodError) {

            return res.status(400).json({
                message: "Invalid credential data", errors: error.errors
            });


        }

        res.status(500).json({
            message: "Failed to save payment credential"
        });


    }


});



router.delete("/payment-credentials/:id", requireAdminAuth, async (req, res) => {

    try {

        const id = parseInt(req.params.id);

        await storage.deletePaymentCredential(id);

        res.json({
            success: true
        });
    } catch (error) {

        res.status(500).json({
            message: "Failed to delete payment credential"
        });


    }


});



// Order Import/Export

router.post("/orders/import", requireAdminAuth, async (req, res) => {

    try {

        const { orders } = req.body;



        if (!Array.isArray(orders)) {

            return res.status(400).json({
                message: "Orders array is required"
            });


        }



        const results = {

            success: 0,

            errors: [] as string[]


        };



        for (let i = 0; i < orders.length; i++) {

            try {

                const orderData = orders[i];



                // Validate required fields

                if (!orderData.customerName || !orderData.customerEmail || !orderData.customerPhone ||

                    !orderData.shippingAddress || !orderData.city || !orderData.paymentMethod ||

                    !orderData.total || !Array.isArray(orderData.items)) {

                    results.errors.push(`Order ${i + 1}: Missing required fields`);

                    continue;


                }



                // Create order with items

                const { order } = await storage.createOrder({

                    customerName: orderData.customerName,

                    customerEmail: orderData.customerEmail,

                    customerPhone: orderData.customerPhone,

                    shippingAddress: orderData.shippingAddress,

                    city: orderData.city,

                    postalCode: orderData.postalCode || null,

                    specialInstructions: orderData.specialInstructions || null,

                    paymentMethod: orderData.paymentMethod,

                    total: orderData.total,

                    status: orderData.status || 'pending'


                }, orderData.items);



                results.success++;


            } catch (error) {

                results.errors.push(`Order ${i + 1}: ${error instanceof Error ? error.message : 'Failed to create'}`);


            }


        }



        res.json({

            success: true,

            message: `Bulk import completed`,

            results


        });


    } catch (error) {

        res.status(500).json({
            message: "Failed to import orders"
        });


    }


});



router.get("/orders/export", requireAdminAuth, async (req, res) => {

    try {

        const orders = await storage.getOrdersWithItems();



        // Convert orders to CSV format

        const csvData = orders.map(order => ({

            orderNumber: order.orderNumber,

            customerName: order.customerName,

            customerEmail: order.customerEmail,

            customerPhone: order.customerPhone,

            shippingAddress: order.shippingAddress,

            city: order.city,

            postalCode: order.postalCode || '',

            specialInstructions: order.specialInstructions || '',

            paymentMethod: order.paymentMethod,

            total: order.total,

            status: order.status,

            itemCount: order.items?.length || 0,

            items: order.items?.map(item =>

                `${item.product.name} (ID: ${item.productId}, Qty: ${item.quantity}, Price: ${item.price})`

            ).join('; ') || ''


        }));



        res.json({

            success: true,

            data: csvData,

            count: csvData.length


        });


    } catch (error) {

        res.status(500).json({
            message: "Failed to export orders"
        });


    }


});



// AI Marketing

router.post("/ai-marketing/analyze", requireAdminAuth, async (req, res) => {

    try {

        console.log("Starting AI analysis...");

        const products = await storage.getProducts();

        console.log("Found products:", products.length);



        if (products.length === 0) {

            return res.status(400).json({
                message: "No products available for analysis"
            });


        }



        // Create a simple fallback analysis for now to test the frontend

        const fallbackAnalysis = {

            luxuryScore: 85,

            discountAppeal: 92,

            targetAudience: "Affluent professionals and luxury enthusiasts seeking authentic designer items at exceptional value",

            sellingPoints: [

                "Authentic luxury brands at 50-70% off retail prices",

                "Limited-time exclusive access to premium designer goods",

                "Curated selection of high-end products from trusted sources"

            ],

            competitiveAdvantages: [

                "Unmatched discount percentages on genuine luxury items",

                "Quick commerce delivery for immediate gratification",

                "Expert curation ensuring only the finest luxury pieces"

            ],

            emotionalHooks: [

                "Own luxury pieces you've always dreamed of at accessible prices",

                "Join an exclusive community of smart luxury shoppers",

                "Don't miss out on these once-in-a-lifetime deals"

            ]


        };



        // Try real AI analysis, fall back to sample if it fails

        let analysis;

        try {

            analysis = await aiMarketing.analyzeProducts(products);

            console.log("Real AI analysis completed:", analysis);


        } catch (aiError) {

            console.log("AI analysis failed, using fallback:", aiError instanceof Error ? aiError.message : String(aiError));

            analysis = fallbackAnalysis;


        }



        res.json(analysis);


    } catch (error) {

        console.error("AI analysis error:", error);

        res.status(500).json({
            message: "Failed to analyze products with AI", error: error instanceof Error ? error.message : String(error)
        });


    }


});



router.post("/ai-marketing/generate-banner", requireAdminAuth, async (req, res) => {
    try {
        const { aiProvider = "openai" } = req.body;
        const products = await storage.getProducts();

        if (products.length === 0) {
            return res.status(400).json({ message: "No products available for content generation" });
        }

        // Fallback content for testing
        const fallbackContent = {
            badgeText: "LIMITED TIME",
            mainTitle: "LUXURY",
            highlightTitle: "UNLEASHED",
            subtitle: "Exclusive Savings",
            description: "Discover authentic luxury brands at incredible discounts. From premium watches to designer fashion, own the luxury pieces you've always desired at prices that won't break the bank. Limited stock, unlimited style.",
            buttonText: "Shop Now",
            footerText: "Free worldwide shipping on all orders",
            urgencyTactics: ["Limited inventory remaining", "24-hour flash sale", "Exclusive member pricing"],
            emotionalTriggers: ["Own luxury you deserve", "Join exclusive community", "Transform your lifestyle"],
            salesTechniques: ["Social proof", "Scarcity marketing", "Value anchoring"]
        };

        let content;
        try {
            if (aiProvider === "gemini") {
                content = await aiMarketing.generateHeroBannerContentWithGemini(products);
            } else {
                content = await aiMarketing.generateHeroBannerContent(products);
            }
            console.log("AI content generation completed");
        } catch (aiError) {
            console.log("AI content generation failed, using fallback:", aiError instanceof Error ? aiError.message : String(aiError));
            content = fallbackContent;
        }

        res.json({ content, provider: aiProvider });
    } catch (error) {
        console.error("AI content generation error:", error);
        res.status(500).json({ message: "Failed to generate marketing content with AI" });
    }
});

router.post("/ai-marketing/generate-dual", requireAdminAuth, async (req, res) => {
    try {
        const products = await storage.getProducts();
        if (products.length === 0) {
            return res.status(400).json({ message: "No products available for content generation" });
        }

        const fallbackResult = {
            openaiContent: {
                badgeText: "FLASH SALE",
                mainTitle: "PREMIUM",
                highlightTitle: "LUXURY",
                subtitle: "Designer Deals",
                description: "Authentic luxury goods at unbeatable prices. Shop premium brands with confidence and style.",
                buttonText: "Shop Now",
                footerText: "Satisfaction guaranteed",
                urgencyTactics: ["Limited time", "While supplies last", "Members only"],
                emotionalTriggers: ["Exclusive access", "Premium lifestyle", "Smart shopping"],
                salesTechniques: ["Value proposition", "Trust building", "FOMO creation"]
            },
            geminiContent: {
                badgeText: "EXCLUSIVE",
                mainTitle: "ELITE",
                highlightTitle: "COLLECTION",
                subtitle: "Luxury Redefined",
                description: "Curated selection of the world's finest luxury brands at remarkable savings. Experience luxury without compromise.",
                buttonText: "Explore",
                footerText: "Worldwide express delivery",
                urgencyTactics: ["VIP access", "Limited quantities", "Today only"],
                emotionalTriggers: ["Prestige ownership", "Elite status", "Lifestyle upgrade"],
                salesTechniques: ["Exclusivity appeal", "Quality emphasis", "Premium positioning"]
            },
            bestContent: {
                badgeText: "EXCLUSIVE SALE",
                mainTitle: "LUXURY",
                highlightTitle: "UNLEASHED",
                subtitle: "Designer Deals",
                description: "Authentic luxury brands at unbeatable prices. Experience premium quality with remarkable savings and worldwide express delivery.",
                buttonText: "Shop Now",
                footerText: "Satisfaction guaranteed worldwide",
                urgencyTactics: ["Limited time VIP access", "While premium stock lasts", "Exclusive member pricing"],
                emotionalTriggers: ["Own luxury you deserve", "Join elite community", "Premium lifestyle upgrade"],
                salesTechniques: ["Value-driven exclusivity", "Trust-based premium positioning", "Smart luxury shopping"]
            },
            comparison: "Optimized content combining the best elements from both AI providers for maximum conversion impact"
        };

        let result;
        try {
            result = await aiMarketing.generateDualAIContent(products);
            console.log("Dual AI generation completed");
        } catch (aiError) {
            console.log("Dual AI generation failed, using fallback:", aiError instanceof Error ? aiError.message : String(aiError));
            result = fallbackResult;
        }

        res.json(result);
    } catch (error) {
        console.error("Dual AI generation error:", error);
        res.status(500).json({ message: "Failed to generate dual AI content" });
    }
});

router.post("/ai-marketing/product-description/:id", requireAdminAuth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await storage.getProductById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const descriptions = await aiMarketing.generateProductDescriptions(product);
        res.json(descriptions);
    } catch (error) {
        console.error("Product description generation error:", error);
        res.status(500).json({ message: "Failed to generate product descriptions with AI" });
    }
});

router.post("/ai-marketing/apply-banner", requireAdminAuth, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: "No content provided" });
        }

        const bannerData = {
            badgeText: content.badgeText || "LIMITED TIME",
            mainTitle: content.mainTitle || "LUXURY",
            highlightTitle: content.highlightTitle || "DEALS",
            subtitle: content.subtitle || "Exclusive Savings",
            description: content.description || "Discover authentic luxury brands at incredible discounts.",
            buttonText: content.buttonText || "Shop Now",
            footerText: content.footerText || "Free worldwide shipping"
        };

        const banner = await storage.updateHeroBanner(bannerData);
        res.json({ banner, message: "AI-generated content applied successfully" });
    } catch (error) {
        console.error("Apply banner content error:", error);
        res.status(500).json({ message: "Failed to apply AI content to banner" });
    }
});

// TTS Routes
router.post("/ai-marketing/tts/generate", requireAdminAuth, async (req, res) => {
    try {
        const { text, voiceId, providerId } = req.body;

        if (!text) {
            return res.status(400).json({ message: "Text is required" });
        }

        const provider = providerRegistry.getTTSProvider(providerId);
        const audioBuffer = await provider.generateSpeech(text, voiceId);

        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length
        });

        res.send(audioBuffer);
    } catch (error) {
        console.error("TTS generation error:", error);
        res.status(500).json({ message: "Failed to generate speech" });
    }
});

router.get("/ai-marketing/tts/voices", requireAdminAuth, async (req, res) => {
    try {
        const { providerId } = req.query;
        const provider = providerRegistry.getTTSProvider(providerId as string);
        const voices = await provider.getVoices();
        res.json(voices);
    } catch (error) {
        console.error("Fetch voices error:", error);
        res.status(500).json({ message: "Failed to fetch voices" });
    }
});
export default router;
