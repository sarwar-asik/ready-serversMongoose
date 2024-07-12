import express from 'express';
import { UserRouter } from '../modules/USER/user.route';
import { AuthRouter } from '../modules/AUTH/auth.route';
import { ImageRoutes } from '../modules/Image/image.route';

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
