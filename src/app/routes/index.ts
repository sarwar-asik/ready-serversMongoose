import express from 'express';
import { UserRouter } from '../modules/user/user.route';
import { AuthRouter } from '../modules/auth/auth.route';
import { ImageRoutes } from '../modules/image/image.route';

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
  {
    path: '/image',
    route: ImageRoutes,
  },
];

modulesRoutes.forEach(route => router.use(route.path, route.route));

export default router;
