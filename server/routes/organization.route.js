import { Router } from 'express';
import { createOrganizationController } from '../controllers/index.js';

export const organizationRouter = Router();

organizationRouter.post('/create', createOrganizationController); // endpoint: /api/organization/create