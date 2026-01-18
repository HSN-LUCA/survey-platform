import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../index';
import { query } from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';

describe('Auth Routes', () => {
  const testEmail = 'test-auth@example.com';
  const testPassword = 'testPassword123';

  beforeAll(async () => {
    // Create test admin
    const passwordHash = await hashPassword(testPassword);
    await query(
      'INSERT INTO admins (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
      [testEmail, passwordHash]
    );
  });

  afterAll(async () => {
    // Clean up test admin
    await query('DELETE FROM admins WHERE email = $1', [testEmail]);
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 if email or password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email and password are required');
    });

    it('should return 401 if email does not exist', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('should return 401 if password is incorrect', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: 'wrongPassword' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('should return token and admin info on successful login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: testPassword });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.admin).toBeDefined();
      expect(res.body.admin.email).toBe(testEmail);
      expect(res.body.admin.id).toBeDefined();
    });
  });
});
