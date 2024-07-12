/* eslint-disable no-var */
/* eslint-disable no-console */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';

import {
  ILogin,
  ILoginResponse,
  IRefreshTokenResponse,
} from './auth.Interface';
import { Secret } from 'jsonwebtoken';

import 'colors';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { User } from '../USER/user.model';
import { IUser } from '../USER/user.interface';

const authLoginServices = async (payload: ILogin): Promise<ILoginResponse> => {
  const { phoneNumber, password } = payload;

  const isUserExist = await User.isUserExistsMethod(phoneNumber);
  // console.log(isUserExist,"isUserExits");

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not match');
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatchMethod(password, isUserExist?.password))
  ) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Password is not correct');
  }

  // console.log(isUserExist,"isUserExist");

  const { role, _id, phoneNumber: existphoneNumber } = isUserExist;
  //   jwt part ///
  const accessToken = jwtHelpers.createToken(
    { _id, role, phoneNumber: existphoneNumber },

    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { _id, role, phoneNumber: existphoneNumber },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  // eslint-disable-next-line no-console
  console.log(
    'accessToken',
    accessToken,
    'refreshToken',
    refreshToken,
    'refreshToken'
  );

  return {
    accessToken,
    refreshToken,
  };
  // return payload
};

const refreshTokenServices = async (
  token: string
): Promise<IRefreshTokenResponse> => {
  console.log(token, 'from refreshTokenService'.red.bold);

  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
    console.log(verifiedToken, 'verifyToken'.red.bold);
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid your refreshToken');
  }

  const { phoneNumber, role, _id } = verifiedToken;

  const newAccessToken = jwtHelpers.createToken(
    { role, _id, phoneNumber },
    config.jwt.refresh_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const signUpServices = async (user: IUser): Promise<IUser | null> => {
  // console.log(user, 'from services');

  const createdUser = await User.create(user);

  if (!createdUser) {
    throw new ApiError(400, 'Failed to create new User');
  }
  return createdUser;
  // return null;
};

export const authServices = {
  authLoginServices,
  refreshTokenServices,
  signUpServices,
};
