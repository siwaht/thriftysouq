import { db } from "./db";
import { heroBanner } from "@shared/schema";

export async function seedHeroBanner() {
  try {
    console.log("🎨 Seeding hero banner...");
    
    // Check if hero banner already exists
    const existingBanner = await db.select().from(heroBanner).limit(1);
    
    if (existingBanner.length === 0) {
      // Insert default hero banner
      await db.insert(heroBanner).values({
        badgeIcon: "Sparkles",
        badgeText: "Luxury at unprecedented prices",
        mainTitle: "Premium",
        highlightTitle: "Luxury",
        subtitle: "Made Accessible",
        description: "Discover authenticated luxury brands at up to 70% off. Curated collections from the world's finest houses.",
        buttonText: "Explore Collection",
        footerText: "Free shipping on orders over $200",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      console.log("✅ Default hero banner created successfully");
    } else {
      console.log("ℹ️ Hero banner already exists, skipping seed");
    }
  } catch (error) {
    console.error("❌ Error seeding hero banner:", error);
    throw error;
  }
}