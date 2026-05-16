import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { LoginUserDto } from '../dto/login-user.dto';
import type { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: any;
  let configService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            setupInitialData: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should set cookies and return user data on successful login', async () => {
      const loginDto: LoginUserDto = { email: 'test@test.com', password: 'password123' };
      const mockResponse = { cookie: jest.fn() } as unknown as Response;
      
      authService.login.mockResolvedValue({
        user: { id: 1, email: 'test@test.com' },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      configService.get.mockReturnValue('development');

      const result = await controller.login(loginDto, mockResponse, undefined);

      expect(authService.login).toHaveBeenCalledWith(loginDto, undefined);
      expect(mockResponse.cookie).toHaveBeenCalledWith('Authentication', 'access-token', expect.any(Object));
      expect(mockResponse.cookie).toHaveBeenCalledWith('Refresh', 'refresh-token', expect.any(Object));
      expect(result).toEqual({ message: 'Login exitoso', user: { id: 1, email: 'test@test.com' } });
    });
  });

  describe('setup', () => {
    it('should call authService.setupInitialData with api key', async () => {
      const apiKey = 'test-api-key';
      const expectedResult = { message: 'Setup completado exitosamente.' };
      authService.setupInitialData.mockResolvedValue(expectedResult);

      const result = await controller.setup(apiKey);

      expect(authService.setupInitialData).toHaveBeenCalledWith(apiKey);
      expect(result).toEqual(expectedResult);
    });
  });
});
