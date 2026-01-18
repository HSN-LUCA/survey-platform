import { describe, it, expect } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../auth';
import { generateToken } from '../../../lib/auth';

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn().mockReturnValue({});
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockReq = { headers: {} };
    mockRes = { status: statusMock };
    mockNext = jest.fn();
  });

  describe('authMiddleware', () => {
    it('should return 401 if no authorization header', () => {
      authMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Authorization token required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if authorization header is malformed', () => {
      mockReq.headers = { authorization: 'InvalidFormat' };
      authMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Authorization token required',
      });
    });

    it('should return 401 if token is invalid', () => {
      mockReq.headers = { authorization: 'Bearer invalid.token.here' };
      authMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Invalid or expired token',
      });
    });

    it('should attach admin info and call next on valid token', () => {
      const adminId = 'test-admin-id';
      const adminEmail = 'admin@test.com';
      const token = generateToken(adminId, adminEmail);

      mockReq.headers = { authorization: `Bearer ${token}` };
      authMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.admin).toBeDefined();
      expect(mockReq.admin?.id).toBe(adminId);
      expect(mockReq.admin?.email).toBe(adminEmail);
      expect(mockNext).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuthMiddleware', () => {
    it('should call next without error if no authorization header', () => {
      optionalAuthMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.admin).toBeUndefined();
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should attach admin info if valid token provided', () => {
      const adminId = 'test-admin-id';
      const adminEmail = 'admin@test.com';
      const token = generateToken(adminId, adminEmail);

      mockReq.headers = { authorization: `Bearer ${token}` };
      optionalAuthMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.admin).toBeDefined();
      expect(mockReq.admin?.id).toBe(adminId);
      expect(mockReq.admin?.email).toBe(adminEmail);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next even if token is invalid', () => {
      mockReq.headers = { authorization: 'Bearer invalid.token' };
      optionalAuthMiddleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.admin).toBeUndefined();
    });
  });
});
