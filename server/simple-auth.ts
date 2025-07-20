// Ultra-simple authentication that works everywhere
import bcrypt from "bcryptjs";
import crypto from "crypto";

// In-memory session storage (survives single deployment session)
const adminSessions = new Map<string, {
  adminId: number;
  username: string;
  expiresAt: number;
}>();

// Clean up expired sessions every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of adminSessions.entries()) {
    if (now > session.expiresAt) {
      adminSessions.delete(sessionId);
    }
  }
}, 10 * 60 * 1000);

export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function createAdminSession(adminId: number, username: string): string {
  const sessionId = generateSessionId();
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  
  adminSessions.set(sessionId, {
    adminId,
    username,
    expiresAt
  });
  
  console.log(`Admin session created: ${sessionId.substring(0, 8)}... for ${username}`);
  return sessionId;
}

export function validateAdminSession(sessionId: string): { adminId: number; username: string } | null {
  if (!sessionId) return null;
  
  const session = adminSessions.get(sessionId);
  if (!session) {
    console.log(`Session not found: ${sessionId.substring(0, 8)}...`);
    return null;
  }
  
  if (Date.now() > session.expiresAt) {
    adminSessions.delete(sessionId);
    console.log(`Session expired: ${sessionId.substring(0, 8)}...`);
    return null;
  }
  
  console.log(`Session valid for: ${session.username}`);
  return {
    adminId: session.adminId,
    username: session.username
  };
}

export function deleteAdminSession(sessionId: string): void {
  const deleted = adminSessions.delete(sessionId);
  console.log(`Session deleted: ${sessionId.substring(0, 8)}... (${deleted ? 'success' : 'not found'})`);
}

export function getActiveSessionCount(): number {
  return adminSessions.size;
}