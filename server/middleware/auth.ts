import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../../lib/auth';
import { JWTPayload } from '../../types';

/**
 * Extend Express Request to include admin info
 */
declare global {
  namespace Express {
    interface Request {
      admin?: JWTPayload;
    }
  }
}

/**
 * JWT Authentication Middleware
 * Verifies JWT token from Authorization header
 * Attaches admin info to request if valid
 * Returns 401 if token is missing or invalid
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        error: 'Authorization token required',
      });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({
        error: 'Invalid or expired token',
      });
    }

    // Attach admin info to request
    req.admin = payload;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      error: 'Unauthorized',
    });
  }
}

/**
 * Optional middleware to check if admin is authenticated
 * Does not block request if token is missing, but attaches admin if valid
 */
export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        req.admin = payload;
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
}
