import { db } from "./db";
import { menuItems } from "../shared/schema";

async function seedMenuItems() {
  try {
    console.log("Seeding menu items...");
    
    await db.insert(menuItems).values([
      { label: 'Watches', value: 'watches', order: 1, isActive: true },
      { label: 'Jewelry', value: 'jewelry', order: 2, isActive: true },
      { label: 'Sunglasses', value: 'sunglasses', order: 3, isActive: true },
      { label: 'Bags', value: 'bags', order: 4, isActive: true },
      { label: 'Wallets', value: 'wallets', order: 5, isActive: true }
    ]).onConflictDoNothing();
    
    console.log("Menu items seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding menu items:", error);
    process.exit(1);
  }
}

seedMenuItems();