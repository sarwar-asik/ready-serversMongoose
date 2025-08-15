import ApiError from '../../../errors/ApiError';
import { IUser } from '../user.interface';
import { User } from '../user.model';
import { userService } from '../user.services';
import httpStatus from 'http-status';

jest.mock('../user.model.ts');

const mockUser = User as jest.Mocked<typeof User>;

describe('UserService Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userData = {
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'user',
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
  };
  const mockUserDoc = {
    ...userData,
    _id: '507f1f77bcf86cd799439011',
    __v: 0,
    toObject: () => userData,
  };

  describe('create', () => {
    it('should create a user successfully', async () => {
      jest.spyOn(mockUser, 'create').mockResolvedValue(mockUserDoc as any);
      const result = await userService.create(userData as IUser);
      expect(result).toEqual(mockUserDoc);
      expect(mockUser.create).toHaveBeenCalledWith(userData);
    });

    it('should throw ApiError when user creation fails', async () => {
      mockUser.create.mockResolvedValue(null as any);

      await expect(userService.create(userData as IUser)).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user'),
      );
      expect(mockUser.create).toHaveBeenCalledWith(userData);
    });

    it('should handle database errors during creation', async () => {
      const dbError = new Error('Database connection failed');
      mockUser.create.mockRejectedValue(dbError);

      await expect(userService.create(userData as IUser)).rejects.toThrow(
        dbError,
      );
    });
  });

  describe('getById', () => {
    it('should return user when found', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockUser.findById.mockResolvedValue(mockUserDoc as any);

      const result = await userService.getById(userId);

      expect(result).toEqual(mockUserDoc);
      expect(mockUser.findById).toHaveBeenCalledWith(userId);
    });

    it('should return null when user not found', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockUser.findById.mockResolvedValue(null);

      const result = await userService.getById(userId);

      expect(result).toBeNull();
      expect(mockUser.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('getAll ', () => {
    it('should return all users with empty filter', async () => {
      const mockUsers = [mockUserDoc, { ...mockUserDoc, _id: 'another-id' }];
      mockUser.find.mockResolvedValue(mockUsers as any);

      const result = await userService.getAll();

      expect(result).toEqual(mockUsers);
      expect(mockUser.find).toHaveBeenCalledWith({});
    });

    it('should return filtered users', async () => {
      const filter = { role: 'user' };
      const mockUsers = [mockUserDoc];
      mockUser.find.mockResolvedValue(mockUsers as any);

      const result = await userService.getAll(filter);

      expect(result).toEqual(mockUsers);
      expect(mockUser.find).toHaveBeenCalledWith(filter);
    });

    it('should return empty array if not found any users', async () => {
      mockUser.find.mockResolvedValue([]);

      const result = await userService.getAll();

      expect(result).toEqual([]);
      expect(mockUser.find).toHaveBeenCalledWith({});
    });

    it('should handle database errors during getAll', async () => {
      const dbError = new Error('Database error');
      mockUser.find.mockRejectedValue(dbError);

      await expect(userService.getAll()).rejects.toThrow(dbError);
      expect(mockUser.find).toHaveBeenCalledWith({});
    });
  });

  describe('update ', () => {
    it('should update user successfully', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateData = { name: { firstName: 'Jane', lastName: 'Doe' } };
      const updatedUser = { ...mockUserDoc, ...updateData };

      mockUser.findByIdAndUpdate.mockResolvedValue(updatedUser as any);

      const result = await userService.update(userId, updateData);

      expect(result).toEqual(updatedUser);
      expect(mockUser.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        updateData,
        { new: true },
      );
    });

    it('should not return null, if update any data', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateData = { name: { firstName: 'Jane', lastName: 'Doe' } };
      const updatedUser = { ...mockUserDoc, ...updateData };

      mockUser.findByIdAndUpdate.mockResolvedValue(updatedUser as any);

      const result = await userService.update(userId, updateData);

      expect(result).toEqual(updatedUser);
      expect(result).not.toBeNull();
      expect(mockUser.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        updateData,
        { new: true },
      );
    });

    it('should throw ApiError when user not found for update', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateData = { name: { firstName: 'Jane', lastName: 'Doe' } };

      mockUser.findByIdAndUpdate.mockResolvedValue(null);

      await expect(userService.update(userId, updateData)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'User not found'),
      );
    });
  });

  describe('delete ', () => {
    it('should delete user successfully', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockUser.findByIdAndDelete.mockResolvedValue(mockUserDoc as any);

      const result = await userService.delete(userId);

      expect(result).toEqual(mockUserDoc);
      expect(mockUser.findByIdAndDelete).toHaveBeenCalledWith(userId);
    });

    it('should throw ApiError when user not found for deletion', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockUser.findByIdAndDelete.mockResolvedValue(null);

      await expect(userService.delete(userId)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'User not found'),
      );
    });
  });
});
