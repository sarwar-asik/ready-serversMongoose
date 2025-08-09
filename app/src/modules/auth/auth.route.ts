import express from 'express';

import validateRequest from '../../middlesWare/validateUserRequest';
import { AuthValidation } from './auth.validation';
import { authController } from './auth.controller';

import { UserValidation } from '../user/user.validation';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidation.createUserZodSchema),
  authController.signUp,
);
router.post(
  '/login',
  validateRequest(AuthValidation.createUserZodSchema),
  authController.login,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  authController.refreshToken,
);

export const AuthRouter = router;
