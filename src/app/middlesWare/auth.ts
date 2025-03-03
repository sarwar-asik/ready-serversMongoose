import { Types } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import { User } from '../modules/USER/user.model';

const auth =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenWithBearer = req.headers.authorization;

      if (!tokenWithBearer) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'You are not authorized for this role'
        );
      }

      // console.log(tokenWithBearer, 'tokenWithBearer');
      if (tokenWithBearer && tokenWithBearer.startsWith('Bearer')) {
        const token = tokenWithBearer.split(' ')[1];

        //verify token
        const verifyUser = jwtHelpers.verifyToken(
          token,
          config.jwt.secret as Secret
        );
        
        // eslint-disable-next-line no-console
        // console.log(verifyUser, 'verifyUser');
        //set user to headers
        req.user = verifyUser;
        // console.log(verifyUser, 'verifyUser');
        const isExist = await User.findOne({
         
          is_active: true,
          $or: [
            { _id: new Types.ObjectId(verifyUser._id) },
            { _id: new Types.ObjectId(verifyUser.id)  },
          ],
        });

        if (!isExist) {
          throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
        }

        // console.log(roles);
        // console.log(verifyUser.role);

        if (roles.length && !roles.includes(verifyUser.role)) {
          throw new ApiError(
            httpStatus.FORBIDDEN,
            'Access Forbidden: You do not have permission to perform this action'
          );
        }
        // console.log(req.user, 'req.user');
        next();
      }
    } catch (error) {
      next(error);
    }
    // next();
  };

export default auth;
