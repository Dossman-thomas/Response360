import { createSuperAdminService } from '../services/index.js';
import { messages } from '../messages/index.js';
import { response } from '../utils/index.js';

export const createSuperAdminController = async (req, res) => {
  try {
    // Extract super admin data from the request body
    const superAdminData = req.body;

    // Call the service function to create the Super Admin
    const result = await createSuperAdminService(superAdminData);

    // Send a successful response
    return response(res, {
      statusCode: 201,
      message: messages.superAdmin.SUPER_ADMIN_ADDED,
      data: result,
    });
  } catch (error) {
    console.error('Error in createSuperAdminController:', error);

    // Send an error response
    return response(res, {
      statusCode: error.status || 500,
      message: error.message || messages.superAdmin.SUPER_ADMIN_CREATION_FAILED,
      error: error.message,
    });
  }
};
