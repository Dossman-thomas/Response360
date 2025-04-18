import { UserModel } from '../database/models/index.js';
import { decryptService } from './index.js';

export const updateUserPasswordService = async (payload) => {
    try {
      // Step 1: Decrypt the payload
      const decryptedPayload = await decryptService(payload);
  
      const { userId, newPassword } = decryptedPayload;
  
      // Step 2: Find the user by userId
      const foundUser = await UserModel.findOne({
        where: { user_id: userId },
      });
  
      if (!foundUser) {
        const error = new Error('User not found.');
        error.status = 404;
        throw error;
      }
  
      // Step 3: Update the password (Sequelize hook will hash it)
      foundUser.user_password = newPassword;
      await foundUser.save();
  
      return {
        success: true,
        message: 'Password updated successfully.',
      };
    } catch (error) {
      console.error('Error in updateUserPasswordService:', error);
      return {
        success: false,
        message: error.message || 'Failed to update password',
      };
    }
  };
  