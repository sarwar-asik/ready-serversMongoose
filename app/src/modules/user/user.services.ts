import { FilterQuery } from 'mongoose';
import { User } from './user.model';
import { IUser } from './user.interface';
import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';

class UserService {
  public async create(user: IUser): Promise<IUser> {
    const createdUser = await User.create(user);
    if (!createdUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    return createdUser;
  }

  public async getById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  public async getAll(filter: FilterQuery<IUser> = {}): Promise<IUser[]> {
    return User.find(filter);
  }

  public async update(id: string, payload: Partial<IUser>): Promise<IUser> {
    const updatedUser = await User.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return updatedUser;
  }

  public async delete(id: string): Promise<IUser> {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return deletedUser;
  }
}

export const userService = new UserService();
