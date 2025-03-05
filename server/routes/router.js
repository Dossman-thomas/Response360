import { Router } from 'express';
import { commonRouter } from './common.route.js';
import { cryptoRouter } from './crypto.route.js';
import { superAdminRouter } from './super-admin.route.js';

export const routes = Router();

routes.use('/common', commonRouter); // add common routes

routes.use('/crypto', cryptoRouter); // add crypto routes

routes.use('/super-admin', superAdminRouter); // add super admin routes