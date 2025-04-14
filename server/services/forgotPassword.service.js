import jwt from "jsonwebtoken";
import { getUserByEmailService } from "./index.js"; 
import { sendResetPasswordEmailService } from "./index.js";
import { env } from "../config/index.js";

export const forgotPasswordService = async (email) => {
    const user = await getUserByEmailService(email);
  
    const token = jwt.sign(
      { userId: user.user_id },
      env.server.jwtSecret,
      { expiresIn: "15m" }
    );
  
    const resetLink = `${env.frontendUrl}/reset-password?token=${token}`;
  
    const emailSent = await sendResetPasswordEmailService(email, resetLink);
  
    if (!emailSent) {
      throw new Error("Failed to send reset email.");
    }
  
    return true;
  };
  
  