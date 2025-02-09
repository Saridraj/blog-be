import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ObjectId, Repository } from 'typeorm';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const userData = {
        username: 'testuser',
        avatarURL: 'test.png',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...userData,
        id: new ObjectId(),
        createdAt: new Date(),
      });

      const result = await authService.register(userData as User);
      expect(result).toHaveProperty('username', userData.username);
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if username is already taken', async () => {
      const userData = { username: 'testuser', avatarURL: 'test.png' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userData as User);

      await expect(authService.register(userData as User)).rejects.toThrow(
        'This username has already been registered.',
      );
    });
  });

  describe('signIn', () => {
    it('should return user info with token if credentials are valid', async () => {
      const userData = {
        username: 'testuser',
        avatarURL: 'test.png',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userData as User);
      jest.spyOn(jwt, 'sign').mockReturnValue('mocked-jwt-token');

      const result = await authService.signIn(userData as User);
      expect(result).toHaveProperty('token', 'mocked-jwt-token');
      expect(result).toHaveProperty('username', userData.username);
    });

    it('should throw an error if username is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        authService.signIn({ username: 'wronguser' } as User),
      ).rejects.toThrow('Username or password is incorrect.');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { username: 'user1', avatarURL: 'test.png' },
        { username: 'user2', avatarURL: 'test.png' },
      ];

      jest.spyOn(userRepository, 'find').mockResolvedValue(mockUsers as User[]);

      const result = await authService.getAllUsers();
      expect(result).toHaveLength(2);
      expect(result[0].username).toBe('user1');
    });
  });
});
