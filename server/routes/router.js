import { Router } from 'express';
import { commonRouter } from './common.route.js';

export const routes = Router();

routes.use('/common', commonRouter); // add common routes