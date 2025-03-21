import { UserModel } from "../database/models/index.js";
import dotenv from "dotenv";
import { QueryTypes } from "sequelize";
import { encryptService, decryptService } from "../services/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const pubkey = process.env.pubkey;

export const loginSuperAdminService = async (payload) => {
  try {
    // Step 1: Decrypt the payload first (decryptService should return { user_email, user_password })
    const decryptedData = await decryptService(payload);

    if (!decryptedData.user_email || !decryptedData.user_password) {
      throw new Error("Service: Decryption failed or missing credentials.");
    }

    const { user_email, user_password, rememberMe } = decryptedData;

    // Step 2: Query the database to find a matching user
    const sequelize = UserModel.sequelize;
    const user = await sequelize.query(
      `SELECT user_id, 
              first_name, 
              last_name, 
              PGP_SYM_DECRYPT(user_email::bytea, :pubkey) as decrypted_email,
              user_password
       FROM users 
       WHERE PGP_SYM_DECRYPT(user_email::bytea, :pubkey) = :email`,
      {
        replacements: { pubkey, email: user_email },
        type: QueryTypes.SELECT,
      }
    );

    if (!user || user.length === 0) {
      const error = new Error(
        "Invalid credentials. Please check your email and password, then try again."
      );
      error.status = 404;
      throw error;
    }

    const foundUser = user[0]; // extract user from array

    console.log("user_password: ", user_password);
    console.log("foundUser.user_password: ", foundUser.user_password);

    // Step 3: Compare the decrypted password with the hashed password in the db
    const isPasswordValid = await bcrypt.compare(
      user_password,
      foundUser.user_password
    );

    console.log("isPasswordValid: ", isPasswordValid);

    if (!isPasswordValid) {
      const error = new Error(
        "Invalid credentials. Please check your email and password, then try again."
      );
      error.status = 404;
      throw error;
    }

    // Step 4: Set token expiration based on "Remember Me" flag
    const tokenExpiry = rememberMe ? "90d" : "1h"; // Use 90 days for "Remember Me", else 1 hour

    // Generate JWT token if authentication is successful
    const token = jwt.sign(
      { id: foundUser.user_id, email: foundUser.decrypted_email },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry } // expires based on "Remember Me"
    );

    const encryptedToken = encryptService(token);

    //  Step 5: Return success message along with the token and user details
    return {
      message: "Success! Email and password verified!",
      encryptedToken, // Return the encrypted token
    };
  } catch (error) {
    throw error;
  }
};
