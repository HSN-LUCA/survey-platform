import { Router, Request, Response } from 'express';
import { query } from '../../lib/db';
import { hashPassword, comparePassword, generateToken } from '../../lib/auth';
import { AdminLoginRequest, AdminLoginResponse } from '../../types';

const router = Router();

/**
 * POST /api/auth/login
 * Admin login endpoint
 * Validates email/password and returns JWT token
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as AdminLoginRequest;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    // Find admin by email
    const result = await query(
      'SELECT id, email, password_hash FROM admins WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    const admin = result.rows[0];

    // Compare password
    const isPasswordValid = await comparePassword(password, admin.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = generateToken(admin.id, admin.email);

    const response: AdminLoginResponse = {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default router;
