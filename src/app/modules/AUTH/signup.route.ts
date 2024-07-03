import express from 'express';

import validateRequest from '../../middlesWare/validateUserRequest';

import { createUserAuthController } from './signup.controller';
import { UserValidation } from '../USER/user.validation';


const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidation.createUserZodSchema),
  createUserAuthController
)


export const AuthSignUPRouter = router;