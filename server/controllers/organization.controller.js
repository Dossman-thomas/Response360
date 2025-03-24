import { createOrganizationService } from "../services/index.js";
import { response } from "../utils/index.js";
import { messages } from "../messages/index.js";

// Controller to handle the creation of an organization
export const createOrganizationController = async (req, res) => {
  try {
    // Step 1: Validate the incoming request data
    const { payload } = req.body;

    if (!payload) {
      return res.status(400).json({
        status: 400,
        message: "Missing encrypted data in the request",
      });
    }

    // Step 2: Call the createOrganizationService to handle the creation logic
    const newOrg = await createOrganizationService(payload);

    // Step 3: Return the successful response
    return response(res, {
      statusCode: 201,
      message: newOrg.message,
    });
} catch (error) {
    console.error(error);
    return response(res, {
      statusCode: error.status || 500,
      message: error.message || messages.general.INTERNAL_SERVER_ERROR,
    });
  }
};
