import { Router } from 'express';
import authRoute from './auth';
import eventRoute from './event';
import jwtMiddleware from '../middlewares/jwt';

const routes = Router();

routes.use('/auth', authRoute);
routes.use('/events', jwtMiddleware, eventRoute);

export default routes;
