import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ObjectId } from 'mongodb';


describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            signIn: jest.fn(),
            getAllUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  const mockUser: User = {
    id: new ObjectId(),
    username: 'testuser',
    avatarURL: 'http://example.com/avatar.png',
    createdAt: new Date(),
  };

  

  describe('register', () => {
    it('should register a user successfully', async () => {
      jest.spyOn(authService, 'register').mockResolvedValue(mockUser);
      const result = await authController.register(mockUser);
      expect(result).toEqual(mockUser);
      expect(authService.register).toHaveBeenCalledWith(mockUser);
    });

    it('should throw an error if user already exists', async () => {
      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new HttpException('User already exists', HttpStatus.CONFLICT));

      await expect(authController.register(mockUser)).rejects.toThrow(HttpException);
    });
  });

  describe('signIn', () => {
    it('should return user data with a token', async () => {
      const mockAuthResponse = {
        id: new ObjectId(),
        username: 'testuser',
        avatarURL: 'http://example.com/avatar.png',
        token: 'mocked_jwt_token'
      };

      jest.spyOn(authService, 'signIn').mockResolvedValue(mockAuthResponse);
      const result = await authController.signIn(mockUser);
      expect(result).toEqual(mockAuthResponse)
    });

    it('should throw an error for invalid credentials', async () => {
      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValue(new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED));

      await expect(authController.signIn(mockUser)).rejects.toThrow(HttpException);
    });
  });

  describe('getAllUsers', () => {
    it('should return a list of users', async () => {
      const mockUsers = [mockUser, { ...mockUser, username: 'anotherUser' }];
      jest.spyOn(authService, 'getAllUsers').mockResolvedValue(mockUsers);

      const result = await authController.getAllUsers();
      expect(result).toEqual(mockUsers);
      expect(authService.getAllUsers).toHaveBeenCalled();
    });

    it('should handle errors when fetching users', async () => {
      jest
        .spyOn(authService, 'getAllUsers')
        .mockRejectedValue(new HttpException('Failed to fetch users', HttpStatus.INTERNAL_SERVER_ERROR));

      await expect(authController.getAllUsers()).rejects.toThrow(HttpException);
    });
  });
});
