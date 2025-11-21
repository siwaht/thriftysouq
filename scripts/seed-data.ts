
import { db } from "../server/db";
import { products, adminUsers } from "../shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Seed Products
    console.log("📦 Seeding products...");
    await db.insert(products).values([
      {
        name: "Royal Oak Perpetual Calendar",
        brand: "Audemars Piguet",
        category: "watches",
        originalPrice: "150000.00",
        discountedPrice: "125000.00",
        discount: 17,
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
        stock: 5,
      },
      {
        name: "Nautilus 5711/1A",
        brand: "Patek Philippe",
        category: "watches",
        originalPrice: "120000.00",
        discountedPrice: "110000.00",
        discount: 8,
        image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800&q=80",
        stock: 3,
      },
      {
        name: "Birkin 30 Black Togo",
        brand: "Hermès",
        category: "fashion",
        originalPrice: "25000.00",
        discountedPrice: "22000.00",
        discount: 12,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
        stock: 2,
      },
      {
        name: "Speedmaster Moonwatch",
        brand: "Omega",
        category: "watches",
        originalPrice: "7500.00",
        discountedPrice: "6500.00",
        discount: 13,
        image: "https://images.unsplash.com/photo-1623998021450-85c29c644e0d?w=800&q=80",
        stock: 10,
      },
      {
        name: "Classic Flap Bag",
        brand: "Chanel",
        category: "fashion",
        originalPrice: "10000.00",
        discountedPrice: "9500.00",
        discount: 5,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
        stock: 4,
      },
    ]);

    // Seed Admin Users
    console.log("busts in silhouette Seeding admin users...");
    const passwordHash = await hashPassword("admin123");

    // Check if admin exists first to avoid unique constraint error
    const existingAdmin = await db.query.adminUsers.findFirst({
      where: (users, { eq }) => eq(users.username, "admin")
    });

    if (!existingAdmin) {
      await db.insert(adminUsers).values([
        {
          username: "admin",
          passwordHash,
          email: "admin@thriftysouq.com",
          role: "super_admin",
          isActive: true,
        },
        {
          username: "manager",
          passwordHash,
          email: "manager@thriftysouq.com",
          role: "manager",
          isActive: true,
        },
        {
          username: "cc_admin",
          passwordHash: await hashPassword("Hola173!"),
          email: "cc@siwaht.com",
          role: "super_admin",
          isActive: true,
        },
      ]);
    } else {
      console.log("Admin user already exists, skipping...");
    }

    console.log("✅ Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();