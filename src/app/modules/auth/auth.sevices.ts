import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import {
  ILogin,
  ILoginResponse,
  IRefreshTokenResponse,
} from './auth.Interface';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { User } from '../user/user.model';
import { IUser } from '../user/user.interface';
import { JwtHelper } from '../../../helpers/jwtHelper';

export class AuthService {
  async login(payload: ILogin): Promise<ILoginResponse> {
    const { email, password } = payload;

    const existingUser = await User.isUserExistsMethod(email);
    if (!existingUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User does not match');
    }

    if (
      existingUser.password &&
      !(await User.isPasswordMatchMethod(password, existingUser.password))
    ) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Password is not correct');
    }

    const { role, _id, email: userEmail } = existingUser;
    const accessToken = JwtHelper.generateToken(
      { _id, role, email: userEmail },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string,
    );

    const refreshToken = JwtHelper.generateToken(
      { _id, role, email: userEmail },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  public async refreshToken(token: string): Promise<IRefreshTokenResponse> {
    let verifiedToken = null;

    try {
      verifiedToken = JwtHelper.verifyToken(
        token,
        config.jwt.refresh_secret as Secret,
      );
    } catch (error) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
    }

    const { email, role, _id } = verifiedToken;

    const newAccessToken = JwtHelper.generateToken(
      { role, _id, email },
      config.jwt.refresh_secret as Secret,
      config.jwt.expires_in as string,
    );

    return {
      accessToken: newAccessToken,
    };
  }

  public async signUp(user: IUser): Promise<IUser | null> {
    const createdUser = await User.create(user);

    if (!createdUser) {
      throw new ApiError(400, 'Failed to create new User');
    }
    return createdUser;
  }
}
export const authService = new AuthService();
