import express from 'express';

import validateRequest from '../../middlesWare/validateUserRequest';
import { AuthValidation } from './auth.validation';
import { authController, signUpAuthController } from './auth.controller';

import { UserValidation } from '../USER/user.validation';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidation.createUserZodSchema),
  signUpAuthController
);
router.post(
  '/login',
  validateRequest(AuthValidation.createUserZodSchema),
  authController.loginController
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  authController.refreshTokenController
);

// router.get("/",userController.getUser)

export const AuthRouter = router;
