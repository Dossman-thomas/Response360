import { Router } from "express";
import {
  createOrganizationController,
  getAllOrganizationsController,
  getOrganizationByIdController,
  updateOrganizationController,
  deleteOrganizationController,
} from "../controllers/index.js";

export const organizationRouter = Router();

// Create an organization
organizationRouter.post("/create", createOrganizationController); // endpoint: /api/organization/create

// Read an organization
organizationRouter.post("/read", getAllOrganizationsController); // endpoint: /api/organization/read

// Read an organization by ID
organizationRouter.get("/read/:orgId", getOrganizationByIdController); // endpoint: /api/organization/read/:orgId

// Update an organization
organizationRouter.put("/update/:orgId", updateOrganizationController); // endpoint: /api/organization/update/:orgId

// Delete an organization
organizationRouter.delete("/delete/:orgId", deleteOrganizationController); // endpoint: /api/organization/delete/:orgId