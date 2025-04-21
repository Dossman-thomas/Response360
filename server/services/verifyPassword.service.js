import { UserModel } from '../database/models/index.js';
import { env } from '../config/index.js';
import { decryptSensitiveData } from '../utils/index.js';
import { decryptService } from './index.js';

const pubkey = env.encryption.pubkey;

export const verifyPasswordService = async (payload) => {
  try {
    // Decrypt the payload
    const decryptedPayload = await decryptService(payload);
    if (!decryptedPayload) {
      const error = new Error('Invalid payload');
      error.status = 400;
      throw error;
    }

    const { user_email, currentPassword } = decryptedPayload;

    // Find the user by email
    const sequelize = UserModel.sequelize;
    const [decryptedExpr] = decryptSensitiveData('user_email', pubkey);

    // Find the user by matching the decrypted email
    const foundUser = await UserModel.findOne({
      where: sequelize.where(decryptedExpr, user_email),
    });

    if (!foundUser) {
      const error = new Error('User not found.');
      error.status = 404;
      throw error;
    }

    // Verify the password
    const isMatch = await foundUser.verifyPassword(currentPassword);

    // If the password does not match, throw an error
    if (!isMatch) {
      const error = new Error('Invalid password');
      error.status = 401;
      throw error;
    }

    return {
      success: true,
      message: 'Password verified successfully.',
    };
  } catch (error) {
    console.error('Error in verifyPasswordService:', error);
    return {
      success: false,
      message: error.message || 'Failed to verify password',
    };
  }
};
