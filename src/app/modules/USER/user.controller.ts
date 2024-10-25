/* eslint-disable no-console */
import { Request, Response } from 'express';
import { User } from './user.model';
import { UserService } from './user.services';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponce';
import { IUser } from './user.interface';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { Secret } from 'jsonwebtoken';

import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import config from '../../../config';


const createUser = catchAsync(async (req: Request, res: Response) => {
  const { ...user } = req.body;
  // console.log(user, 'from controller=================');

  const result = await UserService.createUserServices(user);
  if (result) {
    sendResponse(res, {
      success: true,
      message: 'successfully create User',
      statusCode: 200,
      data: result,
    });
    // next()
  }
});

const getALLUser = catchAsync(async (req: Request, res: Response) => {
  const data = await User.find({});
  sendResponse(res, {
    success: true,
    message: 'Successfully get Users.',
    statusCode: 200,
    data: data,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await UserService.getSingleUser(id);
  // console.log(id,"id");

  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully !',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await UserService.deleteUser(id);

  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: 'Student deleted successfully !',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await UserService.updateUser(id, updatedData);

  sendResponse<IUser>(res, {
    statusCode: 201,
    success: true,
    message: 'Academic Faculty updated successfully',
    data: result,
  });
});

const myProfileController = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `You are not authorized`);
  }

  const verifiedUser = jwtHelpers.verifyToken(
    token as string,
    config.jwt.secret as Secret
  );

  const id = verifiedUser._id;

  const result = await UserService.myProfileServices(id);


  sendResponse<Partial<IUser>>(res, {
    statusCode: 200,
    success: true,
    message: "User's information retrieved successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      `You are not Correct authorized`
    );
  }

  console.log(token);

  const verifiedUser = jwtHelpers.verifyToken(
    token as string,
    config.jwt.secret as Secret
  );

  const id = verifiedUser?._id;

  const updatedData = req.body;

  const newUpdateData = updatedData


  newUpdateData.password = await bcrypt.hash(updatedData?.password, Number(10));


  const result = await UserService.updateMyProfile(id, newUpdateData);

  sendResponse<Partial<IUser>>(res, {
    statusCode: 201,
    success: true,
    message: 'Users information retrieved successfully',
    data: result,
  });
});

export const userController = {
  createUser,
  getALLUser,
  getSingleUser,
  deleteUser,
  updateUser,
  myProfileController,
  updateMyProfile,
};
