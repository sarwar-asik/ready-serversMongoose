import { Request, Response } from 'express';
import config from '../../config';
import { IRefreshTokenResponse } from './auth.Interface';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { authService } from './auth.sevices';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';

class AuthController {
  login = catchAsync(async (req: Request, res: Response) => {
    const loginData = { ...req.body };
    const result = await authService.login(loginData);

    const { refreshToken, ...others } = result;

    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    sendResponse(res, {
      success: true,
      message: 'Successfully logged in',
      statusCode: 200,
      data: others,
    });
  });

  refreshToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.headers.authorization;
    if (!refreshToken) {
      throw new ApiError(httpStatus.UNAUTHORIZED, `You are not authorized`);
    }

    const result = await authService.refreshToken(refreshToken);

    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    sendResponse<IRefreshTokenResponse>(res, {
      statusCode: 200,
      success: true,
      message: 'User logged in successfully!',
      data: result || null,
    });
  });

  signUp = catchAsync(async (req: Request, res: Response) => {
    const user = { ...req.body };
    const result = await authService.signUp(user);

    sendResponse(res, {
      success: true,
      message: 'Successfully created user',
      statusCode: 200,
      data: result,
    });
  });
}

export const authController = new AuthController();
