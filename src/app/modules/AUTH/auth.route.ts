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



/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Signup User
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successfully signup
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully signed up
 *                 data:
 *                   type: object
 *                   example: {}
 */

export const AuthRouter = router;
