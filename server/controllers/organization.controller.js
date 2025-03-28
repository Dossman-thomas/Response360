import {
  createOrganizationService,
  getAllOrganizationsService,
  getOrganizationByIdService,
  updateOrganizationService,
  deleteOrganizationService,
} from "../services/index.js";
import { response } from "../utils/index.js";
import { messages } from "../messages/index.js";
import { validate as validateUuid } from "uuid";

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

// Controller to handle the reading of an organization
export const getAllOrganizationsController = async (req, res) => {
  try {
    const { page, limit, sorts, filters, searchQuery } = req.body;

    const results = await getAllOrganizationsService({
      page,
      limit,
      sorts,
      filters,
      searchQuery,
    });

    return response(res, {
      statusCode: 200,
      data: results,
    });
  } catch (error) {
    console.error(error);
    return response(res, {
      statusCode: error.status || 500,
      message: error.message || messages.general.INTERNAL_SERVER_ERROR,
    });
  }
};

// Controller to handle the reading of an organization by ID
export const getOrganizationByIdController = async (req, res) => {
  try {
    const { orgId } = req.params;

    if (!orgId || !validateUuid(orgId)) {  // Ensure orgId is provided and valid
      return res.status(400).json({
        status: 400,
        message: "Invalid or missing organization ID in the request",
      });
    }

    const encryptedOrgData = await getOrganizationByIdService(orgId);

    return response(res, {
      statusCode: 200,
      data: encryptedOrgData,
    });
  } catch (error) {
    console.error(error);
    return response(res, {
      statusCode: error.status || 500,
      message: error.message || messages.general.INTERNAL_SERVER_ERROR,
    });
  }
};

// Controller to handle the updating of an organization
export const updateOrganizationController = async (req, res) => {
  try {
    // Step 1: Validate the incoming request data
    const { payload } = req.body;
    const { orgId } = req.params; // Get the organization ID from the URL params

    if (!payload) {
      return res.status(400).json({
        status: 400,
        message: "Missing encrypted data in the request",
      });
    }

    if (!orgId) {
      return res.status(400).json({
        status: 400,
        message: "Organization ID is required",
      });
    }

    // Step 2: Call the updateOrganizationService to handle the update logic
    const updatedOrg = await updateOrganizationService(orgId, payload);

    // Step 3: Return the successful response
    return response(res, {
      statusCode: updatedOrg.statusCode,
      message: updatedOrg.message,
    });
  } catch (error) {
    console.error(error);
    return response(res, {
      statusCode: error.status || 500,
      message: error.message || messages.general.INTERNAL_SERVER_ERROR,
    });
  }
};

// Controller to handle the deletion of an organization
export const deleteOrganizationController = async (req, res) => {
  try {
    // Step 1: Get the organization ID from the request parameters
    const { orgId } = req.params;

    if (!orgId) {
      return res.status(400).json({
        status: 400,
        message: "Missing organization ID in the request",
      });
    }

    // Step 2: Call the deleteOrganizationService to handle the soft deletion
    const result = await deleteOrganizationService(orgId);

    // Step 3: Return the successful response
    return response(res, {
      statusCode: result.statusCode,
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return response(res, {
      statusCode: error.status || 500,
      message: error.message || messages.general.INTERNAL_SERVER_ERROR,
    });
  }
};
