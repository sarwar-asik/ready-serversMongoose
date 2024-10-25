import express from 'express';
import { userController } from './user.controller';
import validateRequest from '../../middlesWare/validateUserRequest';
import { UserValidation } from './user.validation';
import auth from '../../middlesWare/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

// it is optional

router.post(
  '/create-user',
  validateRequest(UserValidation.createUserZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  userController.createUser
);
router.get(
  '/my-profile',
  // auth(ENUM_USER_ROLE.ADMIN),
  userController.myProfileController
);

router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), userController.getSingleUser);

router.get('/', 
  // auth(ENUM_USER_ROLE.ADMIN), 
  userController.getALLUser);

router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), userController.deleteUser);

router.patch(
  '/my-profile',
  validateRequest(UserValidation.updateUserZodSchema),
  userController.updateMyProfile
);

router.patch(
  '/:id',
  validateRequest(UserValidation.updateUserZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  userController.updateUser
);

export const UserRouter = router;
