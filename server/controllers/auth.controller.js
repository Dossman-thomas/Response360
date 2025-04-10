import { response } from "../utils/index.js";
import { loginSuperAdminService } from "../services/index.js";
import { messages } from "../messages/index.js";

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

    // Send success response with the encrypted token
    return response(res, {
      statusCode: 200,
      message: user.message,
      data: { token: user.encryptedToken, userId: user.encryptedId },
    });
  } catch (error) {
    console.error(error);
    return response(res, {
      statusCode: error.status || 500,
      message: error.message || messages.general.INTERNAL_SERVER_ERROR,
    });
  }
};
