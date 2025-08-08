import { Types } from 'mongoose';
import { NextFunction, Request, Response, RequestHandler } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import { User } from '../modules/user/user.model';
import ApiError from '../errors/ApiError';
import { JwtHelper } from '../helpers/jwtHelper';
import config from '../config';

export interface IAuthMiddleware {
  authorize(...roles: string[]): RequestHandler;
}

export class AuthMiddleware implements IAuthMiddleware {
  public authorize(...roles: string[]): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const tokenWithBearer = req.headers.authorization;

        if (!tokenWithBearer) {
          throw new ApiError(
            httpStatus.UNAUTHORIZED,
            'You are not authorized for this role',
          );
        }

        if (tokenWithBearer && tokenWithBearer.startsWith('Bearer')) {
          const token = tokenWithBearer.split(' ')[1];
          // Verify token
          const verifyUser = JwtHelper.verifyToken(
            token,
            config.jwt.secret as Secret,
          );
          req.user = verifyUser;

          // Check if user exists and is active
          const isExist = await User.findOne({
            is_active: true,
            $or: [
              { _id: new Types.ObjectId(verifyUser._id as string) },
              { _id: new Types.ObjectId(verifyUser.id as string) },
            ],
          });

          if (!isExist) {
            throw new ApiError(
              httpStatus.UNAUTHORIZED,
              'You are not authorized',
            );
          }

          // Check user role permissions
          if (roles.length && !roles.includes(verifyUser.role)) {
            throw new ApiError(
              httpStatus.FORBIDDEN,
              'Access Forbidden: You do not have permission to perform this action',
            );
          }

          return next();
        }

        // If Bearer not present or malformed
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'You are not authorized for this role',
        );
      } catch (error) {
        next(error);
      }
    };
  }
}

// Singleton instance for easy import and use
export const authMiddleware = new AuthMiddleware();

// For backward compatibility and easier migration
const auth = (...roles: string[]) => authMiddleware.authorize(...roles);
export default auth;
