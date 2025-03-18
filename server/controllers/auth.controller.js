import { response } from "../utils/index.js";
import { loginSuperAdminService } from "../services/index.js";
import { messages } from "../messages/index.js";
import jwt from "jsonwebtoken";

export const loginSuperAdminController = async (req, res) => {
  const { payload } = req.body;

  try {
    if (!payload) {
      return response(res, {
        statusCode: 400,
        message: "Controller: Encrypted payload string is required.",
      });
    }

    // Authenticate super admin
    const user = await loginSuperAdminService(payload);

    // Send success response with the token and user details
    return response(res, {
      statusCode: 200,
      message: user.message,
      data: {
        token: user.token,  // Include the JWT token in the response
        user_id: user.foundUser.user_id, 
        user_email: user.foundUser.decrypted_email,
      },
    });
  } catch (error) {
    console.error(error);
    return response(res, {
      statusCode: error.status || 500,
      message: error.message || messages.general.INTERNAL_SERVER_ERROR,
    });
  }
};
