import { UserModel } from '../database/models/index.js';
import { encryptService, decryptService } from '../services/index.js';
import { decryptSensitiveData } from '../utils/index.js';
import bcrypt from 'bcrypt';
import { env } from '../config/index.js';

if (!env.jwt.secret || !env.jwt.expires || !env.jwt.rememberMe) {
  throw new Error('❌ Missing one or more required JWT environment variables.');
}

import jwt from 'jsonwebtoken';

const pubkey = env.encryption.pubkey;

if (!pubkey) {
  throw new Error('❌ Missing public key for encryption/decryption.');
}

const loginAttempts = new Map(); 

const MAX_ATTEMPTS = 5; 
const WINDOW_MINUTES = 15;

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

    // rate limiting logic
    const now = Date.now();
    const attemptData = loginAttempts.get(user_email) || { count: 0, lastAttempt: now };
    
    if (now - attemptData.lastAttempt > WINDOW_MINUTES * 60 * 1000) {
      // Reset if window has passed
      loginAttempts.set(user_email, { count: 1, lastAttempt: now });
    } else if (attemptData.count >= MAX_ATTEMPTS) {
      const error = new Error(`Too many login attempts. Try again in ${WINDOW_MINUTES} minutes.`);
      error.status = 429;
      throw error;
    } else {
      // Increment attempt count
      loginAttempts.set(user_email, {
        count: attemptData.count + 1,
        lastAttempt: now,
      });
    }

    // Query the database to find a matching user
    const sequelize = UserModel.sequelize;
    const [decryptedExpr] = decryptSensitiveData('user_email', pubkey);
    const user = await UserModel.findOne({
      attributes: ['user_id', [decryptedExpr, 'user_email'], 'user_password'],
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
    const tokenExpiry = rememberMe ? env.jwt.rememberMe : env.jwt.expires;

    // Generate JWT token if authentication is successful
    const token = jwt.sign({ id: user.user_id }, env.jwt.secret, {
      expiresIn: tokenExpiry,
    });

    // Encrypt the token and user details before sending them back
    const responsePayload = {
      token: encryptService(token),
      userId: encryptService(user.user_id),
    };

    // validate encrypted payload structure
    if (!responsePayload.token || !responsePayload.userId) {
      throw new Error('Service: Encryption failed or missing token/userId.');
    }

    // Encrypt the response payload
    const encryptedPayload = encryptService(responsePayload);

    // on successful login, reset the attempt count
    loginAttempts.delete(user_email); 

    // Return success message along with the token and user details
    return {
      encryptedPayload,
    };
  } catch (error) {
    console.error(`[${new Date().toISOString()}] loginSuperAdminService Error:`, {
      message: error.message,
      stack: error.stack,
      ...(error.status && { status: error.status })
    });
    throw error;
  }
  
};
