import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/user.service';
import { Roles } from 'src/modules/roles/entities/roles.entity';
import { Permissions } from 'src/modules/permissions/entities/permissions.entity';
import { Users } from 'src/modules/users/entities/user.entity';
import { mockRepository } from 'src/common/utils/test.utils';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue('hashedToken'),
  genSalt: jest.fn().mockResolvedValue('salt'),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: any;
  let jwtService: any;
  let configService: any;
  let roleRepository: any;
  let permissionRepository: any;
  let userRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByIdentity: jest.fn(),
            findOneByUuid: jest.fn(),
            updateRefreshToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Roles),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Permissions),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Users),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    roleRepository = module.get(getRepositoryToken(Roles));
    permissionRepository = module.get(getRepositoryToken(Permissions));
    userRepository = module.get(getRepositoryToken(Users));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const loginDto = { email: 'test@test.com', password: 'password123' };

    it('should throw UnauthorizedException if user not found', async () => {
      usersService.findOneByIdentity.mockRejectedValue(new Error('User not found'));
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      usersService.findOneByIdentity.mockResolvedValue({ uuid: 'test-uuid', password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens and user on successful login', async () => {
      const user = { uuid: 'test-uuid', email: 'test@test.com', password: 'hashed' };
      usersService.findOneByIdentity.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        user,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(usersService.updateRefreshToken).toHaveBeenCalledWith('test-uuid', 'hashedToken');
    });
  });

  describe('refreshSession', () => {
    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('invalid signature'));
      await expect(service.refreshSession('invalid-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user has no stored refresh token', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: 'test-uuid' });
      usersService.findOneByUuid.mockResolvedValue({ uuid: 'test-uuid', hashedRefreshToken: null });

      await expect(service.refreshSession('token')).rejects.toThrow(UnauthorizedException);
    });

    it('should return new access token if refresh token is valid', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: 'test-uuid' });
      usersService.findOneByUuid.mockResolvedValue({ 
        uuid: 'test-uuid', 
        email: 'test@test.com', 
        hashedRefreshToken: 'storedHash' 
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('new-access-token');

      const result = await service.refreshSession('valid-refresh-token');

      expect(result).toEqual({ accessToken: 'new-access-token' });
    });
  });

  describe('initializeSystem', () => {
    it('should create SUPER_ADMIN and return credentials if no users exist', async () => {
      roleRepository.findOne.mockResolvedValue(null);
      roleRepository.create.mockReturnValue({ id: 1, rolName: 'SUPER_ADMIN' });
      roleRepository.save.mockResolvedValue({ id: 1, rolName: 'SUPER_ADMIN' });

      permissionRepository.findOne.mockResolvedValue(null);
      permissionRepository.create.mockReturnValue({ id: 1 });
      
      userRepository.count.mockResolvedValue(0);
      userRepository.create.mockReturnValue({ id: 1 });

      const result = await service.initializeSystem();

      expect(result.message).toBe('Setup completado exitosamente.');
      expect(result.credentials?.email).toBe('admin@valkora.com');
      expect(roleRepository.save).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should return message if system already initialized', async () => {
      roleRepository.findOne.mockResolvedValue({ id: 1, rolName: 'SUPER_ADMIN' });
      permissionRepository.findOne.mockResolvedValue({ id: 1 });
      userRepository.count.mockResolvedValue(1);

      const result = await service.initializeSystem();

      expect(result.message).toBe('El sistema ya ha sido inicializado anteriormente');
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });
});
