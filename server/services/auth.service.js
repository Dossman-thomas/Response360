import { UserModel } from '../database/models/index.js';
import { env } from '../config/index.js';
import { encryptService, decryptService } from '../services/index.js';
import { decryptSensitiveData } from '../utils/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const pubkey = env.encryption.pubkey;

export const loginSuperAdminService = async (payload) => {
  try {
    // Decrypt the payload first (decryptService should return { user_email, user_password })
    const decryptedData = await decryptService(payload);
    // Check if decryption was successful and contains the required fields
    if (!decryptedData.user_email || !decryptedData.user_password) {
      throw new Error('Service: Decryption failed or missing credentials.');
    }
    // Extract user_email, user_password, and rememberMe from decrypted data
    const { user_email, user_password, rememberMe } = decryptedData;

    // Query the database to find a matching user
    const sequelize = UserModel.sequelize;
    const [decryptedExpr] = decryptSensitiveData('user_email', pubkey);
    console.log('decryptedExpr', decryptedExpr);
    const user = await UserModel.findOne({
      attributes: [
        'user_id',
        [decryptedExpr, 'user_email'],
        'user_password',
      ],
      where: sequelize.where(decryptedExpr, user_email),
    });

    // Check if user exists
    if (!user || user.length === 0) {
      const error = new Error(
        'Invalid credentials. Please check your email and password, then try again.'
      );
      error.status = 404;
      throw error;
    }

    // Compare the decrypted password with the hashed password in the db
    const isPasswordValid = await bcrypt.compare(
      user_password,
      user.user_password
    );

    // check if password is valid
    if (!isPasswordValid) {
      const error = new Error(
        'Invalid credentials. Please check your email and password, then try again.'
      );
      error.status = 404;
      throw error;
    }

    // Set token expiration based on "Remember Me" flag
    const tokenExpiry = rememberMe ? '90d' : '1h'; // Use 90 days for "Remember Me", else 1 hour

    // Generate JWT token if authentication is successful
    const token = jwt.sign(
      { id: user.user_id, email: user.user_email },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    // Encrypt the token and user details before sending them back
    const responsePayload = {
      token: encryptService(token),
      userId: encryptService(user.user_id),
      user_email: encryptService(user.user_email),
      user_password: encryptService(user_password),
    };

    // Encrypt the response payload
    const encryptedPayload = encryptService(responsePayload);

    // Return success message along with the token and user details
    return {
      message: 'Success! Email and password verified!',
      encryptedPayload,
    };
  } catch (error) {
    throw error;
  }
};
