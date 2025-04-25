import jwt from 'jsonwebtoken';
import { UserModel } from '../database/models/index.js';
import { env } from '../config/index.js';
import { decryptService } from './index.js';
import { validatePasswordStrength } from '../utils/index.js';

export const passwordResetService = async (payload) => {
  try {
    // Validate presence of environment variables
    if(!env.jwt.secret) {
      throw new Error('JWT secret is not defined in the environment variables.');
    }

    // Decrypt the payload
    const decryptedPayload = await decryptService(payload);
    // Extract token and newPassword from the decrypted payload
    const { token, newPassword } = decryptedPayload;
    // validate structure of decrypted payload
    if (!token || !newPassword) {
      const error = new Error('Invalid payload structure.');
      error.status = 400;
      throw error;
    }

    // Validate password strength
    const passwordValidationResult = validatePasswordStrength(newPassword);
    if (!passwordValidationResult.isValid) {
      throw new Error(passwordValidationResult.message);
    }

    // Decode URL-safe token
    let decodedToken;
    try {
      decodedToken = decodeURIComponent(token);
    } catch (error) {
      throw new Error('Token is not properly URL-encoded');
    }

    // Decrypt the token
    let decryptedToken;
    try {
      decryptedToken = await decryptService(decodedToken);
    } catch (error) {
      throw new Error('Malformed token. Failed to decrypt.');
    }

    // Now verify the decrypted token
    let verifiedToken;
    try {
      verifiedToken = jwt.verify(decryptedToken, env.jwt.secret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }

    // Validate the structure of the decrypted token
    if (!verifiedToken || !verifiedToken.userId) {
      const error = new Error('Invalid token structure.');
      error.status = 400;
      throw error;
    }

    // Find the user based on the decoded userId
    const foundUser = await UserModel.findOne({
      where: { user_id: verifiedToken.userId },
    });

    // Check if the user exists
    if (!foundUser) {
      const error = new Error('User not found.');
      error.status = 404;
      throw error;
    }

    // Step 3: Update the user's password (no need to hash it manually due to the hooks)
    foundUser.user_password = newPassword; // This will automatically be hashed before saving due to the beforeUpdate hook
    await foundUser.save();

    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    // Handle token expiration and other errors
    if (error instanceof jwt.TokenExpiredError) {
      return { success: false, message: 'Reset token expired' };
    } else if (error instanceof jwt.JsonWebTokenError) {
      return { success: false, message: 'Invalid token' };
    } else if (error instanceof Error && error.message.includes('Invalid payload structure')) {
      return { success: false, message: 'Payload structure is invalid' };
    }

    console.error('Password reset error:', error);
    return {
      success: false,
      message: error.message || 'Failed to reset password',
    };
  }
};
