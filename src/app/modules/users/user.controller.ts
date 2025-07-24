import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponce';
import { IUser } from './user.interface';

import ApiError from '../../../errors/ApiError';
import { UserService, userService } from './user.services';

class UserController {
  create = catchAsync(async (req: Request, res: Response) => {
    const userData: IUser = req.body;
    const result = await userService.create(userData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'User created successfully',
      data: result,
    });
  });

  getUserById = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await userService.getById(userId);

    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    sendResponse<IUser | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User fetched successfully',
      data: result,
    });
  });

  getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const filter = req.query || {};
    const result = await userService.getAll(filter);

    sendResponse<IUser[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Users fetched successfully',
      data: result,
    });
  });

  updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const updateData = req.body;
    const result = await userService.updateUser(userId, updateData);

    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    sendResponse<IUser | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User updated successfully',
      data: result,
    });
  });

  deleteUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await userService.deleteUser(userId);

    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    sendResponse<IUser | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User deleted successfully',
      data: result,
    });
  });
}

export const userController = new UserController();
