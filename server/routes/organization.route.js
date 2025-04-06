import { Router } from "express";
import {
  createOrganizationController,
  getAllOrganizationsController,
  getOrganizationByIdController,
  updateOrganizationController,
  deleteOrganizationController,
} from "../controllers/index.js";
import { decryptOrgIdParam } from "../middleware/decryptId.middleware.js";

export const organizationRouter = Router();

// Create an organization
organizationRouter.post("/create", createOrganizationController); // endpoint: /api/organization/create

// Read an organization
organizationRouter.post("/read", getAllOrganizationsController); // endpoint: /api/organization/read

// Read an organization by ID
organizationRouter.get(
  "/read/:encryptedOrgId",
  decryptOrgIdParam,
  getOrganizationByIdController
); // endpoint: /api/organization/read/:encryptedOrgId

// Update an organization
organizationRouter.put(
  "/update/:encryptedOrgId",
  decryptOrgIdParam,
  updateOrganizationController
); // endpoint: /api/organization/update/:encryptedOrgId

// Delete an organization
organizationRouter.delete(
  "/delete/:encryptedOrgId",
  decryptOrgIdParam,
  deleteOrganizationController
); // endpoint: /api/organization/delete/:encryptedOrgId
