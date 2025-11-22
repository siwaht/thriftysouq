
import { storage } from "../server/storage";
import bcrypt from "bcryptjs";

async function createAdmin() {
    try {
        const username = "cc@siwaht.com";
        const password = "Hola173!";
        const email = "cc@siwaht.com";

        console.log(`Checking for admin user: ${username}`);
        const existingUser = await storage.getAdminUserByUsername(username);

        const passwordHash = await bcrypt.hash(password, 10);

        if (existingUser) {
            console.log("User exists, updating password...");
            await storage.updateAdminUser(existingUser.id, {
                passwordHash,
                isActive: true,
                role: "super_admin"
            });
            console.log("Admin user updated successfully.");
        } else {
            console.log("User does not exist, creating...");
            await storage.createAdminUser({
                username,
                passwordHash,
                email,
                role: "super_admin",
                isActive: true
            });
            console.log("Admin user created successfully.");
        }
    } catch (error) {
        console.error("Error creating admin user:", error);
    } finally {
        process.exit(0);
    }
}

createAdmin();
