import { Router } from 'express';
import * as authCtrl from '../controllers/auth';
import jwtMiddleware from '../middlewares/jwt';

const routes = Router();

routes.get('/me', jwtMiddleware, authCtrl.getProfile);
routes.post('/me', jwtMiddleware, authCtrl.updateProfile);

routes.get('/google/login', authCtrl.googleLoginPage);
routes.get('/google/callback', authCtrl.googleCallback);
export default routes;
