import { FilterQuery } from 'mongoose';
import { User } from './user.model';
import { IUser } from './user.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

export class UserService {
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

  /**
   * Update a user by ID.
   */
  public async updateUser(
    id: string,
    payload: Partial<IUser>,
  ): Promise<IUser | null> {
    const updatedUser = await User.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return updatedUser;
  }

  /**
   * Delete a user by ID.
   */
  public async deleteUser(id: string): Promise<IUser | null> {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return deletedUser;
  }
}

// Singleton instance for usage
export const userService = new UserService();
