import { createSuperAdminService } from "../services/index.js";

export const createSuperAdminController = async (req, res) => {
  try {
    // Extract super admin data from the request body
    const superAdminData = req.body;

    // Call the service function to create the Super Admin
    const result = await createSuperAdminService(superAdminData);

    // Send a successful response
    return res.status(201).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Error in createSuperAdminController:", error);

    // Send an error response
    return res.status(500).json({
      message: "Failed to create Super Admin.",
      error: error.message,
    });
  }
};
