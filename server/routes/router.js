import { Router } from 'express';
import { commonRouter } from './common.route.js';
import { superAdminRouter } from './super-admin.route.js';
import { authRouter } from './auth.route.js';
import { organizationRouter } from './organization.route.js';

export const routes = Router();

routes.use('/common', commonRouter); // add common routes

routes.use('/super-admin', superAdminRouter); // add super admin routes

routes.use('/auth', authRouter); // add auth routes

routes.use('/organization', organizationRouter); // add organization routes