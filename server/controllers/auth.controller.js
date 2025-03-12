import { response } from "../utils/index.js";
import { loginSuperAdminService } from "../services/index.js";
import { messages } from "../messages/index.js";
import jwt from "jsonwebtoken";

export const loginSuperAdminController = async (req, res) => {
  const { user_email, user_password } = req.body;

  try {
    if (!user_email || !user_password) {
      return response(res, {
        statusCode: 400,
        message: messages.auth.MISSING_CREDENTIALS || "Email and password are required.",
      });
    }

    // Authenticate super admin
    const user = await loginSuperAdminService(user_email, user_password);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.user_id, email: user.user_email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send success response
    return response(res, {
      statusCode: 200,
      message: messages.auth.LOGIN_SUCCESS || "Super Admin login successful.",
      data: { user, token }, // Send user details and token
    });
  } catch (error) {
    console.error(error);
    return response(res, {
      statusCode: error.status || 500,
      message: error.message || messages.general.INTERNAL_SERVER_ERROR,
    });
  }
};
