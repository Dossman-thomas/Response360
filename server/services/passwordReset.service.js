import jwt from "jsonwebtoken";
import { UserModel } from "../database/models/index.js";
import { env } from "../config/index.js";

export const passwordResetService = async (token, newPassword) => {
  try {
    // Step 1: Verify the token
    const decoded = jwt.verify(token, env.server.jwtSecret);

    // Step 2: Find the user based on the decoded userId
    const foundUser = await UserModel.findOne({ where: { user_id: decoded.userId } });

    if (!foundUser) {
      const error = new Error("User not found.");
      error.status = 404;
      throw error;
    }

    // Step 3: Update the user's password (no need to hash it manually due to the hooks)
    foundUser.user_password = newPassword;  // This will automatically be hashed before saving due to the beforeUpdate hook
    await foundUser.save();

    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    // Handle token expiration and other errors
    if (error instanceof jwt.TokenExpiredError) {
      return { success: false, message: 'Reset token expired' };
    }

    console.error('Password reset error:', error);
    return { success: false, message: error.message || 'Failed to reset password' };
  }
};
