import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = { email: 'test@example.com', password: 'password123' };
      const hashedPassword = 'hashedPassword';
      const user = { id: 1, email: registerDto.email, password: hashedPassword };
      const token = 'jwt-token';

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockUsersService.findOneByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue(token);

      const result = await authService.register(registerDto);

      expect(result).toEqual({
        access_token: token,
        user: { id: user.id, email: user.email },
      });
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(mockUsersService.create).toHaveBeenCalledWith(registerDto.email, hashedPassword);
    });

    it('should throw error if user already exists', async () => {
      const registerDto = { email: 'test@example.com', password: 'password123' };
      mockUsersService.findOneByEmail.mockResolvedValue({ id: 1, email: registerDto.email });

      await expect(authService.register(registerDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const user = { id: 1, email: loginDto.email, password: 'hashedPassword' };
      const token = 'jwt-token';

      mockUsersService.findOneByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue(token);

      const result = await authService.login(loginDto);

      expect(result).toEqual({
        access_token: token,
        user: { id: user.id, email: user.email },
      });
    });

    it('should throw error with invalid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };
      mockUsersService.findOneByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});