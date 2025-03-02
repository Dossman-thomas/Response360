import { Router } from 'express';
import { commonRouter } from './common.route.js';
import { cryptoRouter } from './crypto.route.js';

export const routes = Router();

routes.use('/common', commonRouter); // add common routes

routes.use('/crypto', cryptoRouter); // add crypto routes