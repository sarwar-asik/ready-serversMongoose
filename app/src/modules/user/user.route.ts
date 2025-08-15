import express from 'express';
import { userController } from './user.controller';
import validateRequest from '../../middlesWare/validateUserRequest';
import { UserValidation } from './user.validation';
import auth from '../../middlesWare/auth';
import { ENUM_USER_ROLE } from '../../common/enums/user';

const router = express.Router();

// it is optional

router.post(
  '/create',
  validateRequest(UserValidation.createUserZodSchema),
  // auth(ENUM_USER_ROLE.ADMIN),
  userController.create,
);
router.get(
  '/my-profile',
  // auth(ENUM_USER_ROLE.ADMIN),
  userController.getUserById,
);

router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), userController.getUserById);

router.get(
  '/',
  // auth(ENUM_USER_ROLE.ADMIN),
  userController.getAllUsers,
);

router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), userController.delete);

router.patch(
  '/my-profile',
  validateRequest(UserValidation.updateZodSchema),
  userController.update,
);

router.patch(
  '/:id',
  validateRequest(UserValidation.updateZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  userController.update,
);

export const UserRouter = router;
