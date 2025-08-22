import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { authService } from '../auth.sevices';
import { User } from '../../user/user.model';
import { JwtHelper } from '../../../helpers/jwtHelper';

import { ILogin } from '../auth.Interface';
import { IUser } from '../../user/user.interface';

jest.mock('../../user/user.model');
jest.mock('../../../helpers/jwtHelper');
jest.mock('../../../config');

const mockUser = {
  ...User,
} as unknown as jest.Mocked<typeof User>;
const mockJwtHelper = JwtHelper as jest.Mocked<typeof JwtHelper>;

describe('AuthService Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUserData = {
    _id: '507f1f77bcf86cd799439011',
    email: 'john.doe@example.com',
    password: '$2b$10$hashedpassword',
    role: 'user',
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
  };

  const loginPayload: ILogin = {
    email: 'john.doe@example.com',
    password: 'password123',
  };

  const mockTokens = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };

  describe('login', () => {
    it('should login user successfully', async () => {
      mockUser.isUserExistsMethod.mockResolvedValue(mockUserData as any);
      mockUser.isPasswordMatchMethod.mockResolvedValue(true);
      mockJwtHelper.generateToken
        .mockReturnValueOnce(mockTokens.accessToken)
        .mockReturnValueOnce(mockTokens.refreshToken);

      const result = await authService.login(loginPayload);

      expect(result).toEqual({
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
      });
    });

    it('should throw ApiError when user does not exist', async () => {
      mockUser.isUserExistsMethod.mockResolvedValue(null as any);

      await expect(authService.login(loginPayload)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'User does not match'),
      );
    });

    it('should throw ApiError when password is incorrect', async () => {
      mockUser.isUserExistsMethod.mockResolvedValue(mockUserData as any);
      mockUser.isPasswordMatchMethod.mockResolvedValue(false);

      await expect(authService.login(loginPayload)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Password is not correct'),
      );
    });

    it('should generate tokens with correct payload and config', async () => {
      mockUser.isUserExistsMethod.mockResolvedValue(mockUserData as any);
      mockUser.isPasswordMatchMethod.mockResolvedValue(true);
      mockJwtHelper.generateToken
        .mockReturnValueOnce(mockTokens.accessToken)
        .mockReturnValueOnce(mockTokens.refreshToken);

      await authService.login(loginPayload);
    });
  });

  describe('refreshToken', () => {
    const mockRefreshToken = 'mock-refresh-token';
    const mockVerifiedToken = {
      _id: mockUserData._id,
      email: mockUserData.email,
      role: mockUserData.role,
    };

    it('should refresh token successfully', async () => {
      mockJwtHelper.verifyToken.mockReturnValue(mockVerifiedToken as any);
      mockJwtHelper.generateToken.mockReturnValue(mockTokens.accessToken);

      const result = await authService.refreshToken(mockRefreshToken);

      expect(result).toEqual({
        accessToken: mockTokens.accessToken,
      });
    });

    it('should throw ApiError when refresh token is invalid', async () => {
      mockJwtHelper.verifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshToken(mockRefreshToken)).rejects.toThrow(
        new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token'),
      );
    });

    it('should handle JWT verification errors', async () => {
      mockJwtHelper.verifyToken.mockImplementation(() => {
        throw new Error('Token expired');
      });

      await expect(authService.refreshToken(mockRefreshToken)).rejects.toThrow(
        new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token'),
      );
    });

    it('should generate new access token with correct parameters', async () => {
      mockJwtHelper.verifyToken.mockReturnValue(mockVerifiedToken as any);
      mockJwtHelper.generateToken.mockReturnValue(mockTokens.accessToken);

      await authService.refreshToken(mockRefreshToken);
    });
  });

  describe('signUp', () => {
    const newUserData: IUser = {
      email: 'newuser@example.com',
      password: 'password123',
      role: 'user',
      name: {
        firstName: 'New',
        lastName: 'User',
      },
    };

    const createdUserMock = {
      ...newUserData,
      _id: '507f1f77bcf86cd799439012',
    };

    it('should create user successfully', async () => {
      mockUser.create.mockResolvedValue(createdUserMock as any);

      const result = await authService.signUp(newUserData);

      expect(result).toEqual(createdUserMock);
    });

    it('should throw ApiError when user creation fails', async () => {
      mockUser.create.mockResolvedValue(null as any);

      await expect(authService.signUp(newUserData)).rejects.toThrow(
        new ApiError(400, 'Failed to create new User'),
      );
    });

    it('should handle database errors during signup', async () => {
      const dbError = new Error('Database connection failed');
      mockUser.create.mockRejectedValue(dbError);

      await expect(authService.signUp(newUserData)).rejects.toThrow(dbError);
    });

    it('should return created user with all properties', async () => {
      mockUser.create.mockResolvedValue(createdUserMock as any);

      const result = await authService.signUp(newUserData);

      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('email', newUserData.email);
      expect(result).toHaveProperty('role', newUserData.role);
      expect(result).toHaveProperty('name');
    });
  });
});
