import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../database/models/index.js";
import dotenv from "dotenv";
import { Sequelize, QueryTypes } from "sequelize";

dotenv.config();
const pubkey = process.env.pubkey;

export const loginSuperAdminService = async (user_email, user_password) => {
  try {
    // Retrieve the sequelize instance from UserModel
    const sequelize = UserModel.sequelize;

    // Decrypt the email and check if the user exists
    const user = await sequelize.query(
      `SELECT user_id, first_name, last_name, 
              PGP_SYM_DECRYPT(user_email::bytea, :pubkey) as decrypted_email, 
              user_password, user_role, is_super_admin
       FROM users 
       WHERE PGP_SYM_DECRYPT(user_email::bytea, :pubkey) = :email`,
      {
        replacements: { pubkey, email: user_email },
        type: QueryTypes.SELECT,
      }
    );

    if (!user || user.length === 0) {
      throw new Error("Invalid credentials. Please check your email and password.");
    }

    const foundUser = user[0]; // Expecting one user

    // Check if the user is a super admin
    if (!foundUser.is_super_admin) {
      throw new Error("Access denied. Only Super Admins can log in.");
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(user_password, foundUser.user_password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials. Please check your email and password.");
    }

    // Prepare the user response object without the password
    const userResponse = {
      user_id: foundUser.user_id,
      first_name: foundUser.first_name,
      last_name: foundUser.last_name,
      user_email: foundUser.decrypted_email, // Return decrypted email
      user_role: foundUser.user_role,
      is_super_admin: foundUser.is_super_admin,
    };

    // Generate JWT token
    const token = jwt.sign(
      { user_id: foundUser.user_id, user_email: foundUser.decrypted_email, is_super_admin: foundUser.is_super_admin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, user: userResponse };
  } catch (error) {
    throw error;
  }
};
