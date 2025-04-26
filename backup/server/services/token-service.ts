import jwt from 'jsonwebtoken';
import { hasRootPrivileges } from './auth-service';

// In a real application, this would be stored in environment variables
const JWT_SECRET = 'quantum-secure-jwt-token-secret-key';
const TOKEN_EXPIRY = '24h';

interface TokenPayload {
  userId: number;
  email: string;
  username: string;
  // Note: we don't include root status in the token payload
  // This is checked on demand via backend services
}

/**
 * Generate a JWT token for an authenticated user
 * @param userId User ID
 * @param email User email
 * @param username Username
 * @returns Promise<string> JWT token
 */
export async function generateToken(
  userId: number, 
  email: string, 
  username: string
): Promise<string> {
  // Create payload without exposing root status
  const payload: TokenPayload = {
    userId,
    email,
    username
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify a JWT token and return the payload if valid
 * @param token JWT token to verify
 * @returns Promise<TokenPayload | null> Token payload or null if invalid
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Authorization middleware that checks token validity
 * @param token JWT token
 * @param requireRoot Whether the endpoint requires root privileges
 * @returns Promise<{valid: boolean, message?: string}> Validation result
 */
export async function authorizeRequest(
  token: string,
  requireRoot: boolean = false
): Promise<{valid: boolean, message?: string, userId?: number}> {
  try {
    // Verify token
    const payload = await verifyToken(token);
    if (!payload) {
      return { valid: false, message: 'Invalid or expired token' };
    }

    // For root-only endpoints, check if user has root privileges
    if (requireRoot) {
      const isRoot = await hasRootPrivileges(payload.userId);
      if (!isRoot) {
        // Don't reveal that this is a root-only endpoint
        return { valid: false, message: 'You do not have permission to access this resource' };
      }
    }

    return { valid: true, userId: payload.userId };
  } catch (error) {
    console.error('Authorization error:', error);
    return { valid: false, message: 'Authorization failed' };
  }
}