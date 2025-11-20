import { Request, Response, NextFunction } from "express";
import { validateAdminSession } from "../simple-auth";

// Extend Request type to include adminAuth
declare global {
    namespace Express {
        interface Request {
            adminAuth?: {
                adminId: number;
                username: string;
            };
        }
    }
}

export const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
    // Skip authentication for MCP endpoints - they are publicly accessible
    if (req.path.startsWith('/mcp/')) {
        return next();
    }

    const sessionId = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.adminSessionId;

    if (sessionId) {
        const adminData = validateAdminSession(sessionId);
        if (adminData) {
            req.adminAuth = adminData;
            next();
            return;
        }
    }

    console.log("Admin auth failed for:", req.path);
    res.status(401).json({ message: "Admin authentication required" });
};
