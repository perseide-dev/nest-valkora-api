import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PermissionsGuard } from './permissions.guard';
import { Users } from 'src/modules/users/entities/user.entity';
import { Permissions } from 'src/modules/permissions/entities/permissions.entity';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import { mockRepository } from '../utils/test.utils';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Focus } from '../enums/focus.enum';
import { Modules } from '../enums/module.enum';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;
  let userRepository: any;
  let permissionRepository: any;
  let profileRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Users),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Permissions),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Profile),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    guard = module.get<PermissionsGuard>(PermissionsGuard);
    reflector = module.get<Reflector>(Reflector);
    userRepository = module.get(getRepositoryToken(Users));
    permissionRepository = module.get(getRepositoryToken(Permissions));
    profileRepository = module.get(getRepositoryToken(Profile));
  });

  const mockExecutionContext = (userPayload: any, params: any = {}): ExecutionContext => ({
    switchToHttp: () => ({
      getRequest: () => ({
        user: userPayload,
        params,
      }),
    }),
    getHandler: jest.fn(),
  } as any);

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if no metadata is set', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(null);
    const context = mockExecutionContext({ sub: 'user-uuid' });
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should return false if user is not in request payload', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue({ module: Modules.Users, action: 'read' });
    const context = mockExecutionContext(null);
    const result = await guard.canActivate(context);
    expect(result).toBe(false);
  });

  it('should throw ForbiddenException if user or role is not found', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue({ module: Modules.Users, action: 'read' });
    userRepository.findOne.mockResolvedValue(null);
    
    const context = mockExecutionContext({ sub: 'user-uuid' });
    
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should allow access if permission focus is ALL', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue({ module: Modules.Users, action: 'read' });
    userRepository.findOne.mockResolvedValue({ uuid: 'user-uuid', rol: { id: 1 } });
    permissionRepository.find.mockResolvedValue([{ read: true, focus: Focus.ALL }]);

    const context = mockExecutionContext({ sub: 'user-uuid' });
    const result = await guard.canActivate(context);
    
    expect(result).toBe(true);
  });

  it('should allow SELF access for Profiles read automatically', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue({ module: Modules.Profiles, action: 'read' });
    userRepository.findOne.mockResolvedValue({ uuid: 'user-uuid', rol: { id: 1 } });
    permissionRepository.find.mockResolvedValue([{ read: true, focus: Focus.SELF }]);

    const context = mockExecutionContext({ sub: 'user-uuid' }, { uuid: 'target-profile-uuid' });
    const result = await guard.canActivate(context);
    
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException if no valid permission authorizes specific resource', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue({ module: Modules.Users, action: 'update' });
    userRepository.findOne.mockResolvedValue({ uuid: 'user-uuid', rol: { id: 1 } });
    // User trying to update another user with only SELF permission
    permissionRepository.find.mockResolvedValue([{ update: true, focus: Focus.SELF }]);

    const context = mockExecutionContext({ sub: 'user-uuid' }, { uuid: 'different-user-uuid' });
    
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });
});
