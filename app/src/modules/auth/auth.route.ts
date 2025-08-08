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
 *               role:
 *                 type: string
 *               name:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *               address:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - contactNumber
 *               - role
 *               - name
 *               - address
 *           example:
 *             email: "test2"
 *             password: "string"
 *             contactNumber: "string"
 *             role: "user"
 *             name:
 *               firstName: "te"
 *               lastName: "te"
 *             address: "sfasd"
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
