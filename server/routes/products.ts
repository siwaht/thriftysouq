import { Router } from "express";
import { storage } from "../storage";

const router = Router();

// Get all products
router.get("/products", async (req, res) => {
    try {
        const products = await storage.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

// Get products by category
router.get("/products/category/:category", async (req, res) => {
    try {
        const { category } = req.params;
        const products = await storage.getProductsByCategory(category);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products by category" });
    }
});

// Get single product
router.get("/products/:id", async (req, res) => {
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

// Get menu items
router.get("/menu-items", async (req, res) => {
    try {
        const items = await storage.getMenuItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch menu items" });
    }
});

export default router;
