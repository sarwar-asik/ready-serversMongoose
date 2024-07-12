import express from 'express';
import { UserRouter } from '../modules/USER/user.route';
import { AuthRouter } from '../modules/AUTH/auth.route';

const router = express.Router();

const modulesRoutes = [
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/users',
    route: UserRouter,
  },
];

modulesRoutes.forEach(route => router.use(route.path, route.route));

export default router;
