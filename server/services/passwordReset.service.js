import jwt from 'jsonwebtoken';
import { UserModel } from '../database/models'; // Assuming you're using Sequelize for models
import { env } from '../config/index.js'; // For JWT secret

export const passwordResetService = async (token, newPassword) => {
  try {
    // Step 1: Verify the token
    const decoded = jwt.verify(token, env.server.jwtSecret);

    // Step 2: Find the user based on the decoded userId
    const user = await UserModel.findOne({ where: { user_id: decoded.userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Step 3: Update the user's password (assuming you're encrypting it)
    user.password = newPassword; // You may want to hash this password first before saving
    await user.save();

    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, message: error.message || 'Failed to reset password' };
  }
};
