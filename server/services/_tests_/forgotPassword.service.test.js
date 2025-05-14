// Test suite for forgot password service
import { jest } from '@jest/globals';
import {
  forgotPasswordService,
  getUserByEmailService,
  encryptService,
  decryptService,
  passwordResetService
} from '../index.js';
import { createError } from '../../utils/index.js';
import jwt from 'jsonwebtoken';
import { env } from '../../config/index.js';

// Mock dependencies
jest.mock('../index.js', () => ({
  forgotPasswordService: jest.fn(),
  getUserByEmailService: jest.fn(),
  encryptService: jest.fn(),
  decryptService: jest.fn(),
  sendResetPasswordEmailService: jest.fn(),
}));
jest.mock('jsonwebtoken');
jest.mock('../../utils/index.js', () => ({
  createError: jest.fn((msg, status, meta) => ({ message: msg, status, ...meta })),
}));
jest.mock('../../config/index.js', () => ({
  env: {
    jwt: {
      secret: 'test-secret',
      forgotPass: '15m',
    },
    frontEndUrl: 'https://frontend.com',
  },
}));

describe('forgotPasswordService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true for a valid encrypted payload', async () => {
    const encryptedPayload = 'validEncryptedPayload';
    const mockUser = {
      user_id: '123',
      user_email: 'test@example.com',
      first_name: 'Tom',
    };
    const jwtToken = 'jwt.token.here';
    const encryptedToken = 'encryptedToken';
    const encryptedEmailPayload = 'encryptedEmailPayload';

    // Set up mocked return values
    getUserByEmailService.mockResolvedValue(mockUser);
    decryptService.mockResolvedValue(mockUser);
    jwt.sign.mockReturnValue(jwtToken);
    encryptService
      .mockResolvedValueOnce(encryptedToken) // for token
      .mockResolvedValueOnce(encryptedEmailPayload); // for email payload
    sendResetPasswordEmailService.mockResolvedValue(true);

    // Import the real forgotPasswordService to call (not the mock)
    const { forgotPasswordService: realForgotPasswordService } = jest.requireActual('../index.js');

    const result = await realForgotPasswordService(encryptedPayload);

    expect(result).toBe(true);
    expect(getUserByEmailService).toHaveBeenCalledWith(encryptedPayload);
    expect(decryptService).toHaveBeenCalledWith(mockUser);
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: mockUser.user_id },
      'test-secret',
      { expiresIn: '15m' }
    );
    expect(encryptService).toHaveBeenCalledWith(jwtToken);
    expect(sendResetPasswordEmailService).toHaveBeenCalledWith(encryptedEmailPayload);
  });
});