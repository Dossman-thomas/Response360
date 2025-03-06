import bcrypt from "bcrypt";
import { UserModel } from "../database/models/index.js";
import jwt from "jsonwebtoken";

// Login Logic for Super Admin
export const loginSuperAdminService = async (email, password) => {
    // Find the user by email
    const user = await UserModel.findOne({ where: { email } });
  
    // If user doesn't exist
    if (!user) throw new Error('User not found');
  
    // Check if the user is a Super Admin
    if (!user.is_super_admin) throw new Error('Access denied. Not a Super Admin');
  
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid password');
  
    // Generate JWT token for the super admin
    const token = jwt.sign({ id: user.id, email: user.email, role: 'super_admin' }, process.env.JWT_SECRET, {
      expiresIn: '1h',  // Token expires in 1 hour
    });
  
    return token;
  };