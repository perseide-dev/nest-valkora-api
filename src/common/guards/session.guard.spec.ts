import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SessionGuard } from './session.guard';
import { AuthService } from 'src/modules/auth/service/auth.service';

describe('SessionGuard', () => {
  let guard: SessionGuard;
  let jwtService: any;
  let authService: any;
  let reflector: Reflector;
  let configService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            refreshSession: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
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

    guard = module.get<SessionGuard>(SessionGuard);
    jwtService = module.get(JwtService);
    authService = module.get(AuthService);
    reflector = module.get<Reflector>(Reflector);
    configService = module.get(ConfigService);
  });

  const mockExecutionContext = (cookies: any = {}): ExecutionContext => ({
    switchToHttp: () => ({
      getRequest: () => ({
        cookies,
      }),
      getResponse: () => ({
        cookie: jest.fn(),
      }),
    }),
    getHandler: jest.fn(),
  } as any);

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if route is public', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(true);
    const context = mockExecutionContext();
    
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException if no tokens are present', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false);
    const context = mockExecutionContext({});
    
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should allow access if access token is valid', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false);
    jwtService.verifyAsync.mockResolvedValue({ sub: 'user-uuid' });
    
    const context = mockExecutionContext({ Authentication: 'valid-token' });
    const result = await guard.canActivate(context);
    
    expect(result).toBe(true);
  });

  it('should refresh session if access token is invalid but refresh token is valid', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false);
    jwtService.verifyAsync.mockRejectedValue(new Error('jwt expired'));
    authService.refreshSession.mockResolvedValue({ accessToken: 'new-valid-token' });
    jwtService.decode.mockReturnValue({ sub: 'user-uuid' });
    configService.get.mockReturnValue('development');
    
    const context = mockExecutionContext({ Authentication: 'invalid-token', Refresh: 'valid-refresh' });
    const result = await guard.canActivate(context);
    
    expect(result).toBe(true);
    expect(authService.refreshSession).toHaveBeenCalledWith('valid-refresh');
  });

  it('should throw UnauthorizedException if both tokens are invalid', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false);
    jwtService.verifyAsync.mockRejectedValue(new Error('jwt expired'));
    authService.refreshSession.mockRejectedValue(new Error('invalid refresh token'));
    
    const context = mockExecutionContext({ Authentication: 'invalid-token', Refresh: 'invalid-refresh' });
    
    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });
});
