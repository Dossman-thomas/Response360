import { Router } from "express";
import {
  createOrganizationController,
  getAllOrganizationsController,
  updateOrganizationController,
  deleteOrganizationController,
} from "../controllers/index.js";

export const organizationRouter = Router();

// Create an organization
organizationRouter.post("/create", createOrganizationController); // endpoint: /api/organization/create

// Read an organization
organizationRouter.post("/read", getAllOrganizationsController); // endpoint: /api/organization/read

// Update an organization
organizationRouter.put("/update/:orgId", updateOrganizationController); // endpoint: /api/organization/update/:orgId

// Delete an organization
organizationRouter.delete("/delete/:orgId", deleteOrganizationController); // endpoint: /api/organization/delete/:orgId