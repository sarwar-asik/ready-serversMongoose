import ApiError from '../../../errors/ApiError';
import { IUser } from '../USER/user.interface';
import { User } from '../USER/user.model';

export const createUserAuthServices = async (
  user: IUser
): Promise<IUser | null> => {
  // console.log(user, 'from services');

  const createdUser = await User.create(user);
  if (!createdUser) {
    throw new ApiError(400, 'Failed to create new User');
  }
  return createdUser;
  return null;
};
