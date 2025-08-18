import { db } from "../server/db";
import { products, menuItems, heroBanner } from "../shared/schema";

async function seedData() {
  console.log("Starting database seeding...");

  try {
    // Check if data already exists
    const existingProducts = await db.select().from(products);
    
    if (existingProducts.length === 0) {
      console.log("Seeding products...");
      
      // Insert sample products
      await db.insert(products).values([
        {
          name: "Luxury Watch Collection",
          brand: "Rolex",
          category: "accessories",
          originalPrice: "36700.00",
          discountedPrice: "11010.00", 
          discount: 70,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
          stock: 5
        },
        {
          name: "Designer Handbag",
          brand: "Louis Vuitton",
          category: "fashion",
          originalPrice: "12850.00",
          discountedPrice: "5140.00",
          discount: 60,
          image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
          stock: 8
        },
        {
          name: "Premium Sunglasses",
          brand: "Ray-Ban",
          category: "accessories", 
          originalPrice: "1468.00",
          discountedPrice: "734.00",
          discount: 50,
          image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
          stock: 12
        },
        {
          name: "Luxury Perfume",
          brand: "Chanel",
          category: "beauty",
          originalPrice: "2202.00",
          discountedPrice: "1101.00",
          discount: 50,
          image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
          stock: 15
        },
        {
          name: "Smart Watch Pro",
          brand: "Apple",
          category: "electronics",
          originalPrice: "2936.00",
          discountedPrice: "1762.00",
          discount: 40,
          image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400",
          stock: 20
        }
      ]);
      
      console.log("Products seeded successfully");
    } else {
      console.log(`Found ${existingProducts.length} existing products, skipping product seeding`);
    }

    // Check if menu items exist
    const existingMenuItems = await db.select().from(menuItems);
    
    if (existingMenuItems.length === 0) {
      console.log("Seeding menu items...");
      
      await db.insert(menuItems).values([
        { label: "All", value: "all", order: 0, isActive: true },
        { label: "Electronics", value: "electronics", order: 1, isActive: true },
        { label: "Fashion", value: "fashion", order: 2, isActive: true },
        { label: "Accessories", value: "accessories", order: 3, isActive: true },
        { label: "Beauty", value: "beauty", order: 4, isActive: true }
      ]);
      
      console.log("Menu items seeded successfully");
    } else {
      console.log(`Found ${existingMenuItems.length} existing menu items, skipping menu seeding`);
    }

    // Check if hero banner exists
    const existingBanner = await db.select().from(heroBanner);
    
    if (existingBanner.length === 0) {
      console.log("Seeding hero banner...");
      
      await db.insert(heroBanner).values({
        badgeIcon: "Sparkles",
        badgeText: "Luxury at unprecedented prices",
        mainTitle: "Premium",
        highlightTitle: "Luxury",
        subtitle: "Made Accessible",
        description: "Discover authenticated luxury brands at up to 70% off. Curated collections from the world's finest houses.",
        buttonText: "Explore Collection",
        footerText: "Free shipping on orders over AED 3,670",
        isActive: true
      });
      
      console.log("Hero banner seeded successfully");
    } else {
      console.log("Hero banner already exists, skipping");
    }

    console.log("Database seeding completed successfully!");
    
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

// Run seeding
seedData().then(() => {
  console.log("Seeding script finished");
  process.exit(0);
}).catch(err => {
  console.error("Seeding script failed:", err);
  process.exit(1);
});