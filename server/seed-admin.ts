import { storage } from "./storage.js";
import bcrypt from "bcryptjs";

export async function seedAdminUser() {
  console.log("Seeding admin user...");
  
  try {
    // Check if admin already exists
    const existingAdmin = await storage.getAdminByUsername("admin");
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create default admin user with hashed password
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    await storage.createAdminUser({
      username: "admin",
      passwordHash: hashedPassword
    });
    
    console.log("Admin user created successfully!");
    console.log("Username: admin");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedAdminUser();
}